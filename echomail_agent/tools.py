import json
from typing import Any
from backend.gmail_services import GmailService
from backend.models import SessionLocal
from backend.db_services import EmailTrackerService
from google.adk.tools.tool_context import ToolContext


def search_my_sent_email(
    search_term: str | None = None,
    subject: str | None = None,
    recipient: str | None = None,
    tool_context: ToolContext | None = None,
) -> list[dict[str, Any]]:
    """Search the authenticated user's sent emails.

    Use this tool when the user asks to find, search for, or locate
    an email they previously sent.

    Args:
        search_term: A word or phrase to search for in the email subject or body.
        subject: Text to search for specifically in the subject.
        recipient: The email address of the person the email was sent to.

    Returns:
        A list of matching sent emails.
    """
    user_id = tool_context.state["user_id"]

    gmail = GmailService(user_id=user_id)

    emails = gmail.search_sent_emails(
        search_term=search_term,
        subject=subject,
        recipient=recipient,
    )

    results = []

    for email in emails:
        msg_id = email['id']

        result = {
            "id": email["id"],
            "thread_id": email["threadId"],
            "sender": gmail.get_email_sender(
                msg_id=msg_id
            ),
            "subject": gmail.get_email_subject(
                msg_id=msg_id
            ),
            "recipients": gmail.get_email_recipient(
                msg_id=msg_id
            ),
            "sentDate": gmail.get_email_sentdate(
                msg_id=msg_id
            ),
            "snippet": gmail.get_email_snippet(
                msg_id=msg_id
            ),
        }

        results.append(
            result
        )

    tool_context.state["sent_email_context"] = {
        "items": [
            {
                "id": email["id"],
                "thread_id": email["thread_id"],
                "subject": email["subject"],
                "recipients": email["recipients"],
            }
            for email in results
        ]
    }

    return results


def fetch_tracked_emails(user_id: int) -> list[dict[str, Any]]:
    db = SessionLocal()

    try:
        emails = EmailTrackerService.get_all_tracked_emails(
            db=db,
            user_id=user_id,
        )

        result = []

        for email in emails:
            recipients_info = EmailTrackerService.get_recipients_for_email(
                db=db,
                tracked_email_id=email.id,
                user_id=user_id,
            )

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
                    "recipients": recipients_info["all_recipients"],
                }
            )

        return result

    finally:
        db.close()


def get_tracked_emails(
    tool_context: ToolContext | None = None,
) ->  list[dict[str, Any]]:
    """Get all emails currently tracked by the authenticated user.

    Args:
        request: A short request describing why the tracked emails are needed.
    """

    user_id = tool_context.state["user_id"]
    results = fetch_tracked_emails(user_id)

    tool_context.state["tracked_emails_context"] = {
        "items": [
            {
                "tracked_email_id": email["id"],
                "email_id": email["email_id"],
                "thread_id": email["thread_id"],
                "subject": email["subject"],
            }
            for email in results
        ]
    }

    return results


def get_email_replies(
    msg_id: str,
    tool_context: ToolContext | None = None,
) -> list[dict[str, Any]]:
    """Get replies to a sent email.

    Use this tool when the user asks whether someone replied to an
    email, who replied, or what someone said in response.

    Args:
        msg_id: The Gmail message ID of the sent email.

    Returns:
        A list of replies with sender, date, and message content.
    """
    user_id = tool_context.state["user_id"]
    db = SessionLocal()

    try:
        # check whether the email is being tracked
        tracked_emails = EmailTrackerService.get_all_tracked_emails(
            db=db,
            user_id=user_id,
        )

        tracked_email = next(
            (
                email
                for email in tracked_emails
                if email.email_id == msg_id
            ),
            None,
        )

        # email is not tracked
        if not tracked_email:
            return {
                "tracked": False,
                "message": (
                    "This email is not currently being tracked in "
                    "EchoMail, so its replies cannot be checked."
                ),
                "replies": [],
            }

        # email is tracked
        gmail = GmailService(user_id)

        responses = gmail.get_email_responses_with_details(
            msg_id=msg_id,
            max_results=100
        )

        replies = [
            {
                "sender": response["sender"],
                "sent_at": response["sent_at"].isoformat(),
                "content": response["snippet"],
            }
            for response in responses
        ]


        return {
            "tracked": True,
            "message": "",
            "replies": replies,
        }

    finally:
        db.close()


def set_selected_tracked_email(
    tracked_email_id: int,
    tool_context: ToolContext | None = None,
) -> dict[str, Any]:
    """Store a tracked email as the currently selected email."""

    context = tool_context.state.get("tracked_emails_context")

    if not context:
        return {
            "success": False,
            "message": "No tracked email context is available.",
        }

    selected = next(
        (
            email
            for email in context["items"]
            if email["tracked_email_id"] == tracked_email_id
        ),
        None,
    )

    if not selected:
        return {
            "success": False,
            "message": "The requested tracked email was not found.",
        }

    tool_context.state["selected_tracked_email_context"] = selected

    return {
        "success": True,
    }


def create_follow_up_draft(
    tracked_email_id: int,
    draft_body: str,
    tool_context: ToolContext | None = None,
)-> dict[str, Any]:
    """Store a follow-up draft for later confirmation."""
    tool_context.state["pending_follow_up_context"] = {
        "tracked_email_id": tracked_email_id,
        "draft_body": draft_body,
    }

    return {
        "success": True,
        "message": "Follow-up draft created.",
    }

def send_ai_follow_up(
    tracked_email_id: int,
    draft_body: str,
    tool_context: ToolContext | None = None,
) -> dict[str, Any]:
    """Send a follow-up draft to pending recipients of a tracked email."""

    user_id = tool_context.state["user_id"]

    db = SessionLocal()

    try:
        gmail_service = GmailService(user_id=user_id)

        if not gmail_service.is_available():
            return {
                "success": False,
                "message": "Gmail service is currently unavailable.",
            }

        reminders = EmailTrackerService.send_ai_follow_up(
            db=db,
            tracked_email_id=tracked_email_id,
            user_id=user_id,
            draft_body=draft_body,
            gmail_service=gmail_service,
        )

        return {
            "success": True,
            "sent_count": len(reminders),
        }

    finally:
        db.close()
