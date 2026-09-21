from typing import Any
from backend.gmail_services import GmailService

TEST_USER_ID = 5

def search_my_sent_email(
    search_term: str | None = None,
    subject: str | None = None,
    recipient: str | None = None,
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

    gmail = GmailService(user_id=TEST_USER_ID)

    return gmail.search_sent_emails(
        search_term=search_term,
        subject=subject,
        recipient=recipient,
    )
