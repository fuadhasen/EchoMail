from pydantic import BaseModel
from typing import Literal, Any
from enum import Enum



class SentEmailRecipient(BaseModel):
    name: str
    email: str


class SentEmailSender(BaseModel):
    name: str
    email: str


class SentEmail(BaseModel):
    id: str
    thread_id: str
    sender: SentEmailSender
    subject: str
    sentDate: str
    snippet: str
    recipients: list[SentEmailRecipient]


class AgentResponse(BaseModel):
    type: Literal[
        "sent_email_search",
        "tracked_emails",
        "text",
    ]
    content: str
    data: list[Any] = []


class AgentIntent(str, Enum):
    GENERAL = "general"
    SENT_EMAIL_SEARCH = "sent_email_search"
    CURRENT_TRACKING_STATUS = "current_tracking_status"
    TRACKED_EMAILS = "tracked_emails"


class IntentResult(BaseModel):
    intent: AgentIntent
    email_subject: str | None = None