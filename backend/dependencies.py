from fastapi import HTTPException, Depends
from gmail_services import GmailService
from models import User
from oauth import get_current_user

def get_email_service(current_user: User = Depends(get_current_user)):
    # dependency injection
    gmail_service = GmailService(current_user.id)

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
