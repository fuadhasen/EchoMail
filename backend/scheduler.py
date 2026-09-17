"""
Scheduler for background tasks, including automatic email checking and notification.
"""

import logging
import re
from datetime import datetime
import subprocess
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.schedulers.asyncio import AsyncIOScheduler
import notifiers
from requests import Session

from gmail_services import GmailService
from models import SessionLocal
from db_services import EmailTrackerService
from websocket import manager

# Configure logging
logging.basicConfig(
    level=logging.DEBUG, # so that we can see debug level and above msg
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def get_db_session():
    """Create and return a new database session."""
    return SessionLocal()


def extract_email_address(sender_string):
    """
    Extract email address from a sender string which might be in format:
    "Name <email@domain.com>" or just "email@domain.com"

    Args:
        sender_string (str): The sender string to extract email from

    Returns:
        str: The extracted email address or None if not found
    """
    if not sender_string:
        return None

    # Check if it's in the format "Name <email@domain.com>"
    email_pattern = r"<([^<>]+)>"
    match = re.search(email_pattern, sender_string)

    if match:
        return match.group(1).strip()

    # Check if the entire string is an email address
    email_pattern = r"[\w\.-]+@[\w\.-]+"
    match = re.search(email_pattern, sender_string)

    if match:
        return match.group(0).strip()

    return None


# Initialize notifiers for different notification methods
# You can configure this to use different notification providers
# such as email, Slack, or desktop notifications
def send_notification(title: str, message: str) -> bool:
    """
    Send a notification using the notifiers library.

    Args:
        title: The notification title
        message: The notification message

    Returns:
        bool: Whether the notification was sent successfully
    """
    try:
        # Log the notification as a fallback
        logger.info(f"NOTIFICATION - {title}: {message}")

        # Try multiple notification methods in order of preference

        # 1. Try to use the system notify-send command directly (works on most Linux systems)
        try:
            subprocess.run(["notify-send", title, message], check=False)
            logger.info(f"System notification sent: {title}")
            return True
        except (ImportError, FileNotFoundError, subprocess.SubprocessError):
            logger.debug("notify-send not available, trying notifiers library")

        # 2. Try using notifiers library with multiple providers
        providers = ["notify", "desktop", "terminal_notifier"]

        for provider_name in providers:
            try:
                provider = notifiers.get_notifier(provider_name)
                if provider is not None:
                    provider.notify(title=title, message=message)
                    logger.info(f"Notification sent via {provider_name}: {title}")
                    return True
            except Exception as provider_error:
                logger.debug(f"Provider {provider_name} failed: {str(provider_error)}")

        # 3. Fall back to logging only if all notification methods fail
        logger.warning(
            f"No notification methods available. Message logged only: {title} - {message}"
        )
        return True  # Return True since we at least logged the notification sadly

    except Exception as e:
        logger.error(f"Failed to send notification: {str(e)}")
        return False


async def check_email_responses():
    """Check for new responses to tracked emails.

    This function is called by the scheduler and should handle any exceptions gracefully
    to prevent the application from crashing.
    
    """
    db_session = None
    try:
        db_session = get_db_session()
        print('scheduler is excuting')

        # Get all unfinished tracked emails
        tracked_emails = EmailTrackerService.get_pending_tracked_emails(db_session)
        gmail_services = {}

        # For each email, check if there are new responses
        for email in tracked_emails:
            try:
                user_id = email.user_id

                if user_id not in gmail_services:
                    gmail_service = GmailService(user_id)
                    if not gmail_service.is_available():
                        print(
                            f"Gmail service not available for user {user_id}: "
                            f"{gmail_service.get_credentials_error()}"
                        )
                        continue

                    gmail_services[user_id] = gmail_service

                gmail_service = gmail_services[user_id]

                # Get the responses from Gmail API
                responses = gmail_service.get_email_responses_with_details(
                    msg_id=email.email_id
                )

                # For each response, check if it's from a tracked recipient
                for response in responses:
                    response_sender = response.get("sender", "")
                    response_id = response.get("id", "")

                    # Extract email address from sender (which might be in format "Name <email@domain.com>")
                    email_address = extract_email_address(response_sender)

                    # Check if this sender is one of our tracked recipients
                    result = EmailTrackerService.check_and_mark_responded(
                        db=db_session,
                        tracked_email_id=email.id,
                        sender_email=email_address,
                        response_id=response_id,
                    )

                    if result["response_detected"]:
                        await manager.send_to_user(
                            user_id=user_id,
                            message={
                                "type": "response_detected",
                                "tracked_email_id": result["tracked_email_id"],
                                "recipient_email": result["recipient_email"],
                                "email_id": result["email_id"],
                                "subject": result["subject"],
                            },
                        )

                    if (result["tracking_completed"]):
                        await manager.send_to_user(
                            user_id=user_id,
                            message={
                                "type": "tracking_completed",
                                "tracked_email_id": result["tracked_email_id"],
                                "email_id": result["email_id"],
                                "subject": result["subject"],
                            },
                        )

            except Exception as e:
                print(f"Error checking responses for email {email.id}: {str(e)}")
                continue

    except Exception as e:
        print(f"Error in check_email_responses: {str(e)}")
    finally:
        db_session.close()



def sent_automatic_reminders(db: Session):
    reminders = EmailTrackerService.get_automatic_reminders_due(db)

    sent_count = 0

    for reminder_info in reminders:
        email = reminder_info["email"]
        recipient = reminder_info["recipient"]
        user = reminder_info["user"]

        try:
            gmail_service = GmailService(email.user_id)

            if not gmail_service.is_available():
                print(
                    f"Skipping {recipient.email}: "
                    f"Gmail service unavailable for user {user.email}"
                )
                continue

            reminder = EmailTrackerService.add_reminder(
                db=db,
                tracked_email_id=email.id,
                user_id=email.user_id,
                recipient_email=recipient.email,
                content=user.reminder_template,
                gmail_service=gmail_service,
            )

            if reminder:
                sent_count += 1
        except Exception as e:
            print(
                f"Failed automatic reminder for "
                f"{recipient.email}: {e}"
            )
            continue

    return sent_count


def run_automatic_reminders():
    db = SessionLocal()
    try:
        sent_count = sent_automatic_reminders(db)
        logger.info(
            f"Automatic reminder job completed. "
            f"Reminders sent: {sent_count}"
        )
    except Exception as e:
        logger.error(
            f"Automatic reminder job failed: {e}"
        )
    finally:
        db.close()

# Create and configure the scheduler
scheduler = AsyncIOScheduler()


def start_scheduler():
    """Start the background scheduler if it's not already running."""
    print('Scheduler started')
    if not scheduler.running:
        # Check emails every 10 minutes
        scheduler.add_job(
            check_email_responses,
            trigger=IntervalTrigger(minutes=1),  # Changed from 2 to 10 minutes
            id="check_email_responses",
            name="Check for email responses every 10 minutes",
            replace_existing=True,
        )

        # auto reminder ?, now is the time
        scheduler.add_job(
            run_automatic_reminders,
            trigger=IntervalTrigger(minutes=60),
            id="automatic_reminders",
            name="Send automatic reminders every 1 minute",
            replace_existing=True,
        )

        scheduler.start()

        logger.info(
            "Scheduler started - will check for email responses every 10 minutes"
        )


def stop_scheduler():
    """Stop the background scheduler if it's running."""
    if scheduler.running:
        scheduler.shutdown()
        logger.info("Scheduler stopped")
