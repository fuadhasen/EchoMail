"""
Scheduler for background tasks, including automatic email checking and notification.
"""

import logging
import re
from datetime import datetime
import subprocess
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
import notifiers

from gmail_services import GmailService
from models import SessionLocal
from db_services import EmailTrackerService

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
        return True  # Return True since we at least logged the notification

    except Exception as e:
        logger.error(f"Failed to send notification: {str(e)}")
        return False


def check_email_responses():
    """Check for new responses to tracked emails.

    This function is called by the scheduler and should handle any exceptions gracefully
    to prevent the application from crashing.
    """
    try:
        # Initialize the Gmail service
        gmail_service = GmailService()

        # Check if Gmail service is properly initialized
        if not gmail_service.is_available():
            print(
                f"Gmail service not available: {gmail_service.get_credentials_error()}"
            )
            return

        db_session = get_db_session()
        print('scheduler is excuting')

        # Get all unfinished tracked emails
        tracked_emails = EmailTrackerService.get_pending_tracked_emails(db_session)

        # For each email, check if there are new responses
        for email in tracked_emails:
            try:
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

                    if email_address:
                        # Check if this sender is one of our tracked recipients
                        EmailTrackerService.check_and_mark_responded(
                            db=db_session,
                            tracked_email_id=email.id,
                            sender_email=email_address,
                            response_id=response_id,
                        )
            except Exception as e:
                print(f"Error checking responses for email {email.id}: {str(e)}")
                continue

        db_session.close()
    except Exception as e:
        print(f"Error in check_email_responses: {str(e)}")


# Create and configure the scheduler
scheduler = BackgroundScheduler()


def start_scheduler():
    """Start the background scheduler if it's not already running."""
    print('Scheduler started')
    if not scheduler.running:
        # Check emails every 10 minutes
        scheduler.add_job(
            check_email_responses,
            trigger=IntervalTrigger(minutes=10),  # Changed from 2 to 10 minutes
            id="check_email_responses",
            name="Check for email responses every 10 minutes",
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
