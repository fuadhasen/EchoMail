import uvicorn
import httpx
import json
import os
from fastapi import FastAPI, Query, Depends, HTTPException, Body
from fastapi.responses import RedirectResponse
from typing import List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, Field
from contextlib import asynccontextmanager
from config import Config

from gmail_services import GmailService
from models import get_db, create_tables
from db_services import EmailTrackerService
from scheduler import start_scheduler, stop_scheduler, check_email_responses
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware


# Pydantic models for request/response validation
class SentEmailSearchCriteria(BaseModel):
    subject: Optional[str] = None
    body_content: Optional[str] = None
    recipient: Optional[str] = None


class RecipientBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None


class RecipientWithResponse(RecipientBase):
    has_responded: bool
    must_respond: bool
    response_id: Optional[str] = None
    last_reminder_sent: Optional[datetime] = None


class TrackEmailRequest(BaseModel):
    # email_id: str
    recipient_emails: List[EmailStr]
    must_respond_emails: List[EmailStr]
    deadline: Optional[datetime] = Field(
        default_factory=lambda: datetime.now() + timedelta(days=7)
    )


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
        from_attributes = True


class MarkRespondedRequest(BaseModel):
    recipient_email: EmailStr
    response_id: str


class SendReminderRequest(BaseModel):
    recipient_emails: List[str]
    custom_message: Optional[str] = None


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
TOKEN_PATH=Path("token.json")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


@app.get("/")
async def root():
    return {"message": "Email Tracker API"}


@app.get("/auth/callback")
async def auth_callback(code: str):
    "Google redirect url"
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
    
    with open(TOKEN_PATH, "w") as f:
        json.dump(token_data, f)


    return RedirectResponse(url="http://localhost:5173")


@app.get('/user_info')
async def user_info():
    """Retrieve user information
    """
    print('user info is hitted')
    gmail_service = GmailService()

    if not gmail_service.is_available():
        error_message = (gmail_service.get_credentials_error() or "Gmail service not available")
        return {"error": error_message, "user_info": ""}
    
    user_info = gmail_service.get_user_info()
    return {"user_info": user_info}


@app.post('/logout')
async def logout():
    """user logout endpoint
    """
    if not TOKEN_PATH.exists():
        return {"status": "unauthenticated"}

    try:
        os.remove(TOKEN_PATH)
    except Exception as e:
        raise HTTPException(status_code=403, detail="logout Failed")


@app.get("/me")
async def status_checking():
    """check status"""

    if TOKEN_PATH.exists():
        return {"status": "authenticated"}
    return {"status": "unauthenticated"}


@app.get("/search-sent-emails")
async def search_sent_emails_endpoint(
    search_term: Optional[str] = Query(
        None, description="Search term to find in email subject and content"
    ),
    max_results: int = Query(
        5, ge=1, le=100, description="Maximum number of results to return"
    ),
):
    """
    Search for sent emails by a single search term that looks in both subject and body content.
    This simplifies the search interface by using one field instead of separate fields.
    """
    gmail_service = GmailService()

    # Check if Gmail service is available before proceeding
    if not gmail_service.is_available():
        error_message = (
            gmail_service.get_credentials_error() or "Gmail service not available"
        )
        return {"error": error_message, "emails": []}

    emails = gmail_service.search_sent_emails(
        search_term=search_term,
        max_results=max_results,
    )

    # Return detailed information for each email
    detailed_emails = []
    for email in emails:
        msg_id = email["id"]
        details = {
            "id": msg_id,
            "subject": gmail_service.get_email_subject(msg_id=msg_id),
            "sender": gmail_service.get_email_sender(msg_id=msg_id),
            "recipients": gmail_service.get_email_recipient(msg_id=msg_id),
            "snippet": email.get("snippet", ""),
            "thread_id": email.get("threadId", ""),
        }
        detailed_emails.append(details)

    return {"emails": detailed_emails}


@app.get("/email_recipients/{msg_id}")
async def get_email_recipients(msg_id: str):
    gmail_service = GmailService()

    if not gmail_service.is_available():
        error_message = (gmail_service.get_credentials_error() or "Gmail service not available")
        return {"error": error_message}

    recipients = gmail_service.get_email_recipient(msg_id=msg_id)
    return {"recipients": recipients}


@app.get("/email-responses/{msg_id}")
async def get_email_responses(
    msg_id: str,
    max_results: int = Query(
        10, ge=1, le=100, description="Maximum number of results to return"
    ),
):
    """
    Get detailed responses to a specific email message.
    """
    gmail_service = GmailService()

    # Check if Gmail service is available before proceeding
    if not gmail_service.is_available():
        error_message = (
            gmail_service.get_credentials_error() or "Gmail service not available"
        )
        return {"error": error_message, "responses": []}

    detailed_responses = gmail_service.get_email_responses_with_details(
        msg_id=msg_id, max_results=max_results
    )
    return {"responses": detailed_responses}


# Email tracking endpoints
@app.post("/emails/{email_id}/track")
async def track_email(
    email_id: str, track_request: TrackEmailRequest, db: Session = Depends(get_db)
):
    """
    Start tracking an email for responses from selected recipients.
    """
    # First, check if this email is already tracked
    existing = EmailTrackerService.get_tracked_email(db, email_id)
    if existing:
        return {"message": "Email already tracked", "tracked_email_id": existing.id}

    # Get email details from Gmail
    gmail_service = GmailService()
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
                    sent_date = datetime.strptime(
                        header["value"], "%a, %d %b %Y %H:%M:%S %z"
                    )
                except ValueError:
                    pass

    # Calculate deadline
    deadline = track_request.deadline

    # Track the email
    tracked_email = EmailTrackerService.track_email(
        db=db,
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
    recipients_info = EmailTrackerService.get_recipients_for_email(db, tracked_email.id)

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
):
    """
    Get all tracked emails with their current status.
    """
    if show_done:
        emails = EmailTrackerService.get_all_tracked_emails(db, skip, limit)
    else:
        emails = EmailTrackerService.get_pending_tracked_emails(db, skip, limit)

    result = []
    for email in emails:
        recipients_info = EmailTrackerService.get_recipients_for_email(db, email.id)
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
async def get_tracked_email(tracked_email_id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific tracked email.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    recipients_info = EmailTrackerService.get_recipients_for_email(db, email.id)

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
        "required_recipients": recipients_info["required_recipients"],
        "responded_recipients": recipients_info["responded_recipients"],
        "pending_recipients": recipients_info["pending_recipients"],
    }


@app.post("/tracked-emails/{tracked_email_id}/mark-responded")
async def mark_recipient_responded(
    tracked_email_id: int, request: MarkRespondedRequest, db: Session = Depends(get_db)
):
    """
    Mark a recipient as having responded to a tracked email.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    success = EmailTrackerService.mark_recipient_responded(
        db=db,
        tracked_email_id=tracked_email_id,
        recipient_email=request.recipient_email,
        response_id=request.response_id,
    )

    if not success:
        raise HTTPException(
            status_code=400, detail="Failed to mark recipient as responded"
        )

    # Check if email is now complete
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id)

    return {
        "success": True,
        "tracked_email_id": tracked_email_id,
        "recipient_email": request.recipient_email,
        "is_email_done": email.is_done,
    }


@app.post("/tracked-emails/{tracked_email_id}/mark-done")
async def mark_email_done(tracked_email_id: int, db: Session = Depends(get_db)):
    """
    Manually mark a tracked email as done.
    """
    success = EmailTrackerService.mark_email_as_done(db, tracked_email_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    return {"success": True, "tracked_email_id": tracked_email_id, "is_done": True}


@app.post("/tracked-emails/{tracked_email_id}/mark-undone")
async def mark_email_undone(tracked_email_id: int, db: Session = Depends(get_db)):
    """
    Mark a tracked email as not done.
    """
    success = EmailTrackerService.mark_email_as_undone(db, tracked_email_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    return {"success": True, "tracked_email_id": tracked_email_id, "is_done": False}


@app.post("/tracked-emails/{tracked_email_id}/send-reminders")
async def send_reminders(
    tracked_email_id: int, request: SendReminderRequest, db: Session = Depends(get_db)
):
    """
    Send reminders to specific recipients manually.
    """
    email = EmailTrackerService.get_tracked_email_by_id(db, tracked_email_id)
    if not email:
        raise HTTPException(status_code=404, detail="Tracked email not found")

    # In a real application, here we would send actual email reminders
    # For now, we'll just record that reminders were sent

    success_count = 0
    recipients = []

    for recipient_email in request.recipient_emails:
        reminder = EmailTrackerService.add_reminder(
            db=db,
            tracked_email_id=tracked_email_id,
            recipient_email=recipient_email,
            content=request.custom_message,
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
async def manually_check_responses():
    """
    Manually trigger the email response checking process.
    Useful for testing or immediate checks.
    """
    try:
        # First check if Gmail service is available
        gmail_service = GmailService()
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
async def send_automatic_reminders(db: Session = Depends(get_db)):
    """
    Send automatic reminders to recipients who haven't responded.
    In a real app, this would be run by a scheduled task.
    """
    reminders_to_send = EmailTrackerService.get_reminders_needing_sending(db)

    sent_count = 0
    reminders_sent = []

    for reminder_info in reminders_to_send:
        email = reminder_info["email"]
        recipient = reminder_info["recipient"]
        days_remaining = reminder_info["days_remaining"]

        # In a real app, send an actual email here
        # For now, just record that a reminder was sent

        reminder = EmailTrackerService.add_reminder(
            db=db,
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


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
