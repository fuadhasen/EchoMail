from fastapi import HTTPException
from gmail_services import GmailService

def get_email_service():
    # dependency injection
    gmail_service = GmailService()

    if not gmail_service.is_available():
        error = gmail_service.get_credentials_error()

        if error == "GMAIL_AUTH_EXPIRED":
            raise HTTPException(
                status_code=401,
                detail={
                    "code": "gmail_auth_expired",
                    "message": "Please reconnect your Gmail account.",
                },
            )

        raise HTTPException(
            status_code=500,
            detail={
                "code": "gmail_service_error",
                "message": error,
            },
        )

    return gmail_service
