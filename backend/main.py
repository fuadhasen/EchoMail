"""Main Application Entry Point"""

import uvicorn
import httpx
import json
import os
from email.utils import parsedate_to_datetime
from urllib.parse import urlencode
from fastapi import FastAPI, Query, Depends, HTTPException, Body, WebSocket
from websocket import websocket_endpoint
from websocket import manager, WebSocketDisconnect
from fastapi.responses import RedirectResponse
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from contextlib import asynccontextmanager
from config import Config
from oauth import create_access_token, get_current_user, get_current_websocket_user
from fastapi.responses import JSONResponse
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build

from sqlalchemy import func

from gmail_services import GmailService
from models import get_db, create_tables, User
from db_services import EmailTrackerService
from scheduler import start_scheduler, stop_scheduler, check_email_responses
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from dependencies import get_email_service
from datetime import datetime, timedelta
from models import GoogleAuth, SessionLocal, TrackedEmail

from encryption import encrypt_token


class SettingsUpdate(BaseModel):
    notify_on_response: bool
    reminder_template: str

# Pydantic models for request/response validation
class SentEmailSearchCriteria(BaseModel):
    subject: Optional[str] = None
    body_content: Optional[str] = None
    recipient: Optional[str] = None


class RecipientBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


# when returning tracked email details
class RecipientWithResponse(RecipientBase):
    has_responded: bool
    must_respond: bool
    response_id: Optional[str] = None
    last_reminder_sent: Optional[datetime] = None


class TrackEmailRequest(BaseModel):
    # email_id: str
    recipient_emails: List[EmailStr]
    must_respond_emails: List[EmailStr]
    deadline: datetime


class TrackedEmailResponse(BaseModel):
    id: int
    email_id: str
    thread_id: str
    subject: str
    sender: str
    sent_date: datetime
    deadline: datetime
    is_done: bool
    created_at: datetime
    recipients: List[RecipientWithResponse]

    class Config:
        # convert db objects to json
        from_attributes = True


class MarkRespondedRequest(BaseModel):
    recipient_email: EmailStr
    response_id: str | None = None


class MarkUnRespondedRequest(BaseModel):
    recipient_email: EmailStr


class SendReminderRequest(BaseModel):
    recipient_emails: List[str]
    custom_message: Optional[str] = None


class UserResponse(BaseModel):
    name: str
    email: str
    avatar: Optional[str] = None


scopes = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/gmail.send"
    ]


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables and start the scheduler
    create_tables()
    start_scheduler()
    print(
        "Application started - Background scheduler is running to check emails every 10 minutes"
    )

    yield  # This is where the application runs

    # Shutdown: stop the scheduler
    stop_scheduler()
    print("Application shutting down - Background scheduler stopped")


app = FastAPI(lifespan=lifespan)


# Temporarily for single user support!
# TOKEN_PATH=Path("token.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", Config.FRONTEND_URL ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
    db = SessionLocal()
    user = None

    try:
        user = get_current_websocket_user(websocket, db)

        await manager.connect(websocket, user.id)
        while True:
            await websocket.receive_text()

    except WebSocketDisconnect:
        if user:
            manager.disconnect(websocket, user.id)

    except HTTPException:
        await websocket.close(code=1008)

    except Exception as e:
        print(f"WebSocket error: {e}")

        if user:
            manager.disconnect(websocket, user.id)
    finally:
        db.close()

@app.get("/")
async def root():
    return {"message": "Welcome to Echomail"}

@app.post("/test_websocket")
async def test_websocket():
    await manager.broadcast({
        "type": "test",
        "message": "Hello from EchoMail backend!"
    })

    return {"success": True}

# google login endpoint
@app.get("/auth/google")
async def google_login():
    google_auth_url = "https://accounts.google.com/o/oauth2/auth"

    params = {
        "client_id": Config.CLIENT_ID,
        "redirect_uri": Config.REDIRECT_URI,
        "response_type": "code",
        "scope": " ".join(scopes),
        "access_type": "offline",
        # "prompt": "consent",
    }

    url = f"{google_auth_url}?{urlencode(params)}"
    return RedirectResponse(url=url)


# redirect uri
@app.get("/auth/callback")
async def auth_callback(code: str):
    "Google redirect url"
    # creat user, jwt, set cookies and redirect
    token_url = Config.TOKEN_URI
    data = {
        "code": code,
        "client_id": Config.CLIENT_ID,
        "client_secret": Config.CLIENT_SECRET,
        "redirect_uri": Config.REDIRECT_URI,
        "grant_type": "authorization_code",
    }

    async with httpx.AsyncClient() as client:
        res = await client.post(token_url, data=data)
        res.raise_for_status()
        token_data = res.json()

    # at this time credentials are not saved, cant build gmail service so lets use token_data
    credentials = Credentials(
        token=token_data["access_token"],
        refresh_token=token_data.get("refresh_token"),
        token_uri=Config.TOKEN_URI,
        client_id=Config.CLIENT_ID,
        client_secret=Config.CLIENT_SECRET,
        scopes=GmailService.SCOPES,
    )

    user_info = GmailService.get_user_info(credentials)
    print(user_info)

    # calculate when the access token expires
    expires_at = datetime.now() + timedelta(
        seconds=token_data.get("expires_in", 3600)
    )

    db = SessionLocal()

    try:
        # Find user, or create it
        user = db.query(User).filter(User.email == user_info["email"]).first()
        if not user:
            user = EmailTrackerService.create_user(db, user_info)

        # find google token belonging to this user
        google_auth = db.query(GoogleAuth).filter(GoogleAuth.user_id == user.id).first()
        if google_auth:
            google_auth.access_token = encrypt_token(token_data["access_token"])

            # Google may not return a refresh token every time.
            if token_data.get("refresh_token"):
                google_auth.refresh_token =  encrypt_token(
                    token_data["refresh_token"]
                )

            google_auth.token_type = token_data.get("token_type")
            google_auth.expires_at = expires_at
        else:
            google_auth = GoogleAuth(
                user_id = user.id,
                access_token=encrypt_token(
                    token_data["access_token"]
                ),
                refresh_token=(
                    encrypt_token(token_data["refresh_token"])
                    if token_data.get("refresh_token")
                    else None
                ),
                token_type=token_data.get("token_type"),
                expires_at=expires_at,
            )

            db.add(google_auth)

        db.commit()
        db.refresh(google_auth)

        # Jwt access token
        access_token = create_access_token({"user_id": user.id})
    finally:
        db.close()

    response = RedirectResponse(
        url=Config.FRONTEND_URL
    )

    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=Config.COOKIE_SECURE,
        samesite="none",
    )

    return response


@app.get("/auth/me")
async def check_status(
    current_user: User = Depends(get_current_user)
):
    """check status and return logged-in user"""

    return {
        "authenticated": True,
        "user": {
            "email": current_user.email,
            "name": current_user.name,
            "picture": current_user.picture,
        }
    }


@app.post('/logout')
async def logout():
    """user logout endpoint
    """
    response = JSONResponse(content={"status": "logged_out"})

    response.delete_cookie(key="access_token")
    return response

@app.get('/settings')
def get_settings(
    current_user: User = Depends(get_current_user),
):
    return {
        "notify_on_response": current_user.notify_on_response,
        "reminder_template": current_user.reminder_template,
    }

@app.put('/settings')
def update_settings(
    settings: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    current_user.notify_on_response = settings.notify_on_response
    current_user.reminder_template = settings.reminder_template

    db.commit()
    db.refresh(current_user)

    return {
        "notify_on_response": current_user.notify_on_response,
        "reminder_template": current_user.reminder_template,
    }


@app.get("/search-sent-emails")
async def search_sent_emails_endpoint(
    search_term: Optional[str] = Query(
        None, description="Search term to find in email subject and content"
    ),
    max_results: int = Query(
        5, ge=1, le=100, description="Maximum number of results to return"
    ),
    gmail_service: GmailService = Depends(get_email_service)
):
    """
    Search for sent emails by a single search term that looks in both subject and body content.
    This simplifies the search interface by using one field instead of separate fields.
    """
    emails = gmail_service.search_sent_emails(
        search_term=search_term,
        max_results=max_results,
    )

    # Return detailed information for each email
    detailed_emails = []
    for email in emails:
        msg_id = email["id"]
        details = {
            # original message id is here
            "id": msg_id,
            "subject": gmail_service.get_email_subject(msg_id=msg_id),
            "sender": gmail_service.get_email_sender(msg_id=msg_id),
            "recipients": gmail_service.get_email_recipient(msg_id=msg_id),
            "snippet": gmail_service.get_email_snippet(msg_id=msg_id),
            "sentdate": gmail_service.get_email_sentdate(msg_id=msg_id),
            "thread_id": email.get("threadId", ""),
        }
        detailed_emails.append(details)

    return {"emails": detailed_emails}


@app.get("/email_recipients/{msg_id}")
async def get_email_recipients(msg_id: str, gmail_service: GmailService = Depends(get_email_service)):
    recipients = gmail_service.get_email_recipient(msg_id=msg_id)
    return {"recipients": recipients}


@app.get("/email-responses/{msg_id}")
async def get_email_responses(
    msg_id: str,
    max_results: int = Query(
        10, ge=1, le=100, description="Maximum number of results to return"
    ),
    gmail_service: GmailService = Depends(get_email_service)
):
    """
    Get detailed responses to a specific email message.
    """
    detailed_responses = gmail_service.get_email_responses_with_details(
        msg_id=msg_id, max_results=max_results
    )
    return {"responses": detailed_responses}


# Email tracking endpoints
@app.post("/emails/{email_id}/track")
async def track_email(
    email_id: str,
    track_request: TrackEmailRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Start tracking an email for responses from selected recipients.
    """
    # First, check if this email is already tracked, can get its own tracked email only
    existing = EmailTrackerService.get_tracked_email(db, email_id, current_user.id)
    if existing:
        return {"message": "Email already tracked", "tracked_email_id": existing.id}

    # Get email details from Gmail for authenticated user
    gmail_service = GmailService(current_user.id)
    email_details = gmail_service.get_email_details(msg_id=email_id)

    if not email_details:
        raise HTTPException(status_code=404, detail="Email not found in Gmail")

    # Extract email details
    subject = gmail_service.get_email_subject(msg_id=email_id)
    sender = gmail_service.get_email_sender(msg_id=email_id)
    thread_id = email_details.get("threadId", "")

    # Parse sent date from headers
    sent_date = datetime.now()  # Default to now if we can't parse
    if "payload" in email_details and "headers" in email_details["payload"]:
        for header in email_details["payload"]["headers"]:
            if header["name"] == "Date":
                # Simple date parsing - in a real app, you'd want to use a more robust parser
                try:
                    sent_date = parsedate_to_datetime(header["value"])
                except ValueError:
                    pass

    # Calculate deadline , string should be parsed into datetime
    deadline = track_request.deadline

    # Track the email
    tracked_email = EmailTrackerService.track_email(
        db=db,
        user_id=current_user.id,
        email_id=email_id,
        thread_id=thread_id,
        subject=subject,
        sender=sender,
        sent_date=sent_date,
        recipient_emails=track_request.recipient_emails,
        must_respond_emails=track_request.must_respond_emails,
        deadline=deadline,
    )

    # Get recipient details for response
    recipients_info = EmailTrackerService.get_recipients_for_email(db, tracked_email.id, current_user.id)

    return {
        "tracked_email_id": tracked_email.id,
        "email_id": email_id,
        "thread_id": thread_id,
        "subject": subject,
        "sender": sender,
        "sent_date": sent_date,
        "deadline": deadline,
        "recipients": recipients_info["all_recipients"],
        "required_recipients": recipients_info["required_recipients"],
    }


@app.get("/tracked-emails")
async def get_tracked_emails(
    skip: int = 0,
    limit: int = 100,
    show_done: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Get all tracked emails with their current status for specific user.
    """
    if show_done:
        emails = EmailTrackerService.get_all_tracked_emails(db, current_user.id, skip, limit)
    else:
        emails = EmailTrackerService.get_pending_tracked_emails_for_user(db, current_user.id, skip, limit)

    result = []
    for email in emails:
        recipients_info = EmailTrackerService.get_recipients_for_email(db, email.id, current_user.id)
        result.append(
            {
                "id": email.id,
                "email_id": email.email_id,
                "thread_id": email.thread_id,
                "subject": email.subject,
                "sender": email.sender,
                "sent_date": email.sent_date,
                "deadline": email.deadline,
                "is_done": email.is_done,
                "created_at": email.created_at,
                "recipients": recipients_info["all_recipients"],
                "pending_recipients": recipients_info["pending_recipients"],
            }
        )

    return {"tracked_emails": result}


@app.get("/tracked-emails/{tracked_email_id}")
async def get_tracked_email(
    tracked_email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)

    ):
    """
    Get details of a specific tracked email.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id, current_user.id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    recipients_info = EmailTrackerService.get_recipients_for_email(db, email.id, current_user.id)

    return {
        "id": email.id,
        "email_id": email.email_id,
        "thread_id": email.thread_id,
        "subject": email.subject,
        "sender": email.sender,
        "sent_date": email.sent_date,
        "deadline": email.deadline,
        "is_done": email.is_done,
        "created_at": email.created_at,
        "recipients": recipients_info["all_recipients"],
        # "required_recipients": recipients_info["required_recipients"],
        # "responded_recipients": recipients_info["responded_recipients"],
        "pending_recipients": recipients_info["pending_recipients"],
    }


@app.post("/tracked-emails/{tracked_email_id}/mark-responded")
async def mark_recipient_responded(
    tracked_email_id: int,
    request: MarkRespondedRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a recipient as having responded to a tracked email.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id, current_user.id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    success = EmailTrackerService.mark_recipient_responded(
        db=db,
        tracked_email_id=tracked_email_id,
        recipient_email=request.recipient_email,
        user_id=current_user.id,
        response_id=request.response_id,
    )

    if not success:
        raise HTTPException(
            status_code=400, detail="Failed to mark recipient as responded"
        )

    # Check if email is now complete
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id, current_user.id)

    return {
        "success": True,
        "tracked_email_id": tracked_email_id,
        "recipient_email": request.recipient_email,
        "is_email_done": email.is_done,
    }

@app.post("/tracked-emails/{tracked_email_id}/mark-unresponded")
async def mark_recipient_unresponded(
    tracked_email_id: int,
    request: MarkUnRespondedRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a recipient as having unresponded to a tracked email.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id, current_user.id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    success = EmailTrackerService.mark_recipient_unresponded(
        db=db,
        tracked_email_id=tracked_email_id,
        user_id=current_user.id,
        recipient_email=request.recipient_email,
    )

    if not success:
        raise HTTPException(
            status_code=400, detail="Failed to mark recipient as unresponded"
        )

    return {
        "success": True,
        "tracked_email_id": tracked_email_id,
        "recipient_email": request.recipient_email,
        "is_email_done": email.is_done,
    }


@app.post("/tracked-emails/{tracked_email_id}/mark-done")
async def mark_email_done(
    tracked_email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    """
    Manually mark a tracked email as done.
    """
    success = EmailTrackerService.mark_email_as_done(db, tracked_email_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    return {"success": True, "tracked_email_id": tracked_email_id, "is_done": True}


@app.post("/tracked-emails/{tracked_email_id}/mark-undone")
async def mark_email_undone(
    tracked_email_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
    ):
    """
    Mark a tracked email as not done.
    """
    success = EmailTrackerService.mark_email_as_undone(db, tracked_email_id, current_user.id)
    if not success:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    return {"success": True, "tracked_email_id": tracked_email_id, "is_done": False}


@app.post("/tracked-emails/{tracked_email_id}/send-reminders")
async def send_reminders(
    tracked_email_id: int,
    request: SendReminderRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    gmail_service: GmailService = Depends(get_email_service)
):
    """
    Send reminders to specific recipients manually, 24 hour cooldown should be respected.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id, current_user.id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    # In a real application, here we would send actual email reminders
    # For now, we'll just record that reminders were sent

    success_count = 0
    recipients = []

    for recipient_email in request.recipient_emails:
        reminder = EmailTrackerService.add_reminder(
            db=db,
            user_id=current_user.id,
            tracked_email_id=tracked_email_id,
            recipient_email=recipient_email,
            content=request.custom_message,
            gmail_service=gmail_service,
        )

        if reminder:
            success_count += 1
            recipients.append(recipient_email)

    return {
        "success": success_count > 0,
        "tracked_email_id": tracked_email_id,
        "reminders_sent": success_count,
        "recipients": recipients,
    }


# Manual trigger to check for email responses (for testing/debugging)
@app.post("/check-responses")
async def manually_check_responses(current_user: User = Depends(get_current_user)):
    """
    Manually trigger the email response checking process.
    Useful for testing or immediate checks.
    """
    try:
        # First check if Gmail service is available
        gmail_service = GmailService(current_user.id)
        if not gmail_service.is_available():
            error_message = (
                gmail_service.get_credentials_error() or "Gmail service not available"
            )
            return {"success": False, "message": error_message}

        # Run the check_email_responses function
        check_email_responses()
        return {
            "success": True,
            "message": "Email response check completed successfully",
        }
    except Exception as e:
        return {"success": False, "message": f"Error checking responses: {str(e)}"}


# In a production app, you would have a background task for automatic reminders
# This endpoint simulates that for demonstration purposes
@app.post("/automatic-reminders")
async def send_automatic_reminders(
    db: Session = Depends(get_db),
):
    """
    Send automatic reminders to recipients who haven't responded.
    In a real app, this would be run by a scheduled task. yeah 24h, or 12h reminder cadence
    we need also reminder template here
    """
    reminders_to_send = EmailTrackerService.get_automatic_reminders_due(db)

    sent_count = 0
    reminders_sent = []

    for reminder_info in reminders_to_send:
        email = reminder_info["email"]
        recipient = reminder_info["recipient"]
        days_remaining = reminder_info["days_remaining"]

        reminder = EmailTrackerService.add_reminder(
            db=db,
            user_id=email.user_id,
            tracked_email_id=email.id,
            recipient_email=recipient.email,
            content=f"Automatic reminder: Please respond to the email '{email.subject}'. {days_remaining} days remaining until deadline.",
        )

        if reminder:
            sent_count += 1
            reminders_sent.append(
                {
                    "email_id": email.email_id,
                    "subject": email.subject,
                    "recipient": recipient.email,
                    "days_remaining": days_remaining,
                }
            )

    return {"success": True, "reminders_sent": sent_count, "details": reminders_sent}


# automation activities endpoint
@app.get("/automation/responses")
async def get_daily_responses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """automatic responses activity"""
    results = EmailTrackerService.get_daily_activities(db, current_user.id)
    return results


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
