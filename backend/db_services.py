from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
from sqlalchemy import func


from models import TrackedEmail, TrackedEmailRecipient, Recipient, Reminder

COOLDOWN = timedelta(hours=24)


class EmailTrackerService:
    """Service for managing tracked emails and their responses."""

    @staticmethod
    def get_tracked_email(db: Session, email_id: str) -> Optional[TrackedEmail]:
        """Get a tracked email by its Gmail message ID(email_id)."""
        return db.query(TrackedEmail).filter(TrackedEmail.email_id == email_id).first()

    @staticmethod
    def get_tracked_email_by_id(db: Session, id: int) -> Optional[TrackedEmail]:
        """Get a tracked email by its internal database ID."""
        return db.query(TrackedEmail).filter(TrackedEmail.id == id).first()

    @staticmethod
    def get_all_tracked_emails(
        db: Session, skip: int = 0, limit: int = 100
    ) -> List[TrackedEmail]:
        """Get all tracked emails."""
        return db.query(TrackedEmail).offset(skip).limit(limit).all()

    @staticmethod
    def get_pending_tracked_emails(
        db: Session, skip: int = 0, limit: int = 100
    ) -> List[TrackedEmail]:
        """Get tracked emails that are not marked as done."""
        return (
            db.query(TrackedEmail)
            .filter(~TrackedEmail.is_done)  # Using SQLAlchemy's negate operator
            .offset(skip)
            .limit(limit)
            .all()
        )

    @staticmethod
    def track_email(
        db: Session,
        email_id: str,
        thread_id: str,
        subject: str,
        sender: str,
        sent_date: datetime,
        recipient_emails: List[str],
        must_respond_emails: List[str],
        deadline: Optional[datetime] = None,
    ) -> TrackedEmail:
        """
        Track a new email for response monitoring.

        Args:
            db: Database session
            email_id: Gmail message ID
            thread_id: Gmail thread ID
            subject: Email subject
            sender: Email sender
            sent_date: Date email was sent
            recipient_emails: List of recipient email addresses
            must_respond_emails: List of recipient emails that must respond
            deadline: Optional deadline for responses (default is 7 days from now)

        Returns:
            Newly created TrackedEmail object
        """
        # Set default deadline if not provided
        if deadline is None:
            deadline = datetime.now() + timedelta(days=7)

        # Create new tracked email
        tracked_email = TrackedEmail(
            email_id=email_id,
            thread_id=thread_id,
            subject=subject,
            sender=sender,
            sent_date=sent_date,
            deadline=deadline,
            is_done=False,
        )
        db.add(tracked_email)
        db.flush()  # Flush to get the ID without committing to associate it with its recipient  

        # Create if the recipient of this email was not created before or get recipients and associate them with the tracked email
        for email in recipient_emails:
            recipient = db.query(Recipient).filter(Recipient.email == email).first()
            if not recipient:
                recipient = Recipient(email=email)
                db.add(recipient)
                db.flush()

            # Create association with must_respond flag
            must_respond = email in must_respond_emails
            association = TrackedEmailRecipient(
                tracked_email_id=tracked_email.id,
                recipient_id=recipient.id,
                must_respond=must_respond,
                has_responded=False,
            )
            db.add(association)

        db.commit()
        db.refresh(tracked_email)
        return tracked_email

    @staticmethod
    def mark_recipient_responded(
        db: Session, tracked_email_id: int, recipient_email: str, response_id: str | None = None
    ) -> bool:
        """
        Mark a recipient as having responded to a tracked email (log response).

        Args:
            db: Database session
            tracked_email_id: Database ID of the tracked email
            recipient_email: Email of the recipient who responded
            response_id: Gmail message ID of the response

        Returns:
            True if successful, False otherwise
        """
        # Get recipient
        recipient = (
            db.query(Recipient).filter(Recipient.email == recipient_email).first()
        )
        if not recipient:
            return False

        # Get association
        association = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == tracked_email_id,
                TrackedEmailRecipient.recipient_id == recipient.id,
            )
            .first()
        )

        if not association:
            return False

        # Update association
        association.has_responded = True
        association.response_id = response_id
        association.response_at = datetime.now()
        db.commit()

        # Check if tracked email is now done and update its status
        tracked_email = (
            db.query(TrackedEmail).filter(TrackedEmail.id == tracked_email_id).first()
        )
        if not tracked_email:
            return False

        # recalculate the email status
        print(tracked_email.is_done)
        tracked_email.update_status(db)
        print(tracked_email.is_done)

        db.commit()

        return True

    @staticmethod
    def mark_recipient_unresponded(
        db: Session, tracked_email_id: int, recipient_email: str
    ) -> bool:
        """
        Mark a recipient as having un-responded to a tracked email (log response).

        Args:
            db: Database session
            tracked_email_id: Database ID of the tracked email
            recipient_email: Email of the recipient who responded
            response_id: Gmail message ID of the response

        Returns:
            True if successful, False otherwise
        """
        # Get recipient
        recipient = (
            db.query(Recipient).filter(Recipient.email == recipient_email).first()
        )
        if not recipient:
            print("Recipient not found:", recipient_email)
            return False

        # Get association
        association = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == tracked_email_id,
                TrackedEmailRecipient.recipient_id == recipient.id,
            )
            .first()
        )

        if not association:
            print(
                "Association not found:",
                tracked_email_id,
                recipient.id,
            )
            return False

        # Update association
        association.has_responded = False
        association.response_id = None
        association.response_at = None
        db.commit()

        # check if tracked_emails and make is_done = False
        tracked_email = (
            db.query(TrackedEmail).filter(TrackedEmail.id == tracked_email_id).first()
        )        
        if not tracked_email:
            return False
        
        tracked_email.update_status(db)

        db.commit()
     
        return True

    @staticmethod
    def mark_email_as_done(db: Session, tracked_email_id: int) -> bool:
        """Manually mark an email as done."""
        tracked_email = (
            db.query(TrackedEmail).filter(TrackedEmail.id == tracked_email_id).first()
        )
        if not tracked_email:
            return False

        tracked_email.is_done = True
        db.add(tracked_email)
        db.commit()
        return True

    @staticmethod
    def mark_email_as_undone(db: Session, tracked_email_id: int) -> bool:
        """Mark an email as not done."""
        tracked_email = (
            db.query(TrackedEmail).filter(TrackedEmail.id == tracked_email_id).first()
        )
        if not tracked_email:
            return False

        tracked_email.is_done = False
        db.add(tracked_email)
        db.commit()
        return True

    @staticmethod
    def add_reminder(
        db: Session,
        tracked_email_id: int,
        recipient_email: str,
        content: Optional[str] = None,
    ) -> Optional[Reminder]:
        """
        Add a record of a reminder sent to single recipient.

        Args:
            db: Database session
            tracked_email_id: Database ID of the tracked email
            recipient_email: Email of the recipient who was reminded
            content: Optional content of the reminder

        Returns:
            Newly created Reminder object or None if failed
        """
        recipient = (
            db.query(Recipient).filter(Recipient.email == recipient_email).first()
        )
        if not recipient:
            return None

        assoc = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == tracked_email_id,
                TrackedEmailRecipient.recipient_id == recipient.id,
            )
            .first()
        )

        if not assoc:
            return None
        
        # COOLDOWN Restriction
        if assoc.last_reminder_sent:
            elapsed = datetime.now() - assoc.last_reminder_sent

            if elapsed < COOLDOWN:
                raise HTTPException(
                status_code=429,
                detail="Reminder can only be sent once every 24 hours.",
            )
        

        reminder = Reminder(
            tracked_email_id=tracked_email_id,
            recipient_id=recipient.id,
            content=content,
            sent_at=datetime.now(),
        )
        db.add(reminder)

        if assoc:
            assoc.last_reminder_sent = datetime.now()
            db.add(assoc)

        db.commit()
        db.refresh(reminder)
        return reminder

    @staticmethod
    def get_recipients_for_email(db: Session, tracked_email_id: int) -> Dict[str, Any]:
        """
        Get lists of all recipients, required recipients, and those who have/haven't responded.

        Returns a dictionary with four lists:
        - all_recipients: All recipients of the email
        - required_recipients: Recipients who must respond
        - responded_recipients: Required recipients who have responded
        - pending_recipients: Required recipients who haven't responded
        """
        # Get all associations for this email (1 email to many recipients)
        associations = (
            db.query(TrackedEmailRecipient)
            .filter(TrackedEmailRecipient.tracked_email_id == tracked_email_id)
            .all()
        )

        all_recipients = []
        required_recipients = []
        responded_recipients = []
        pending_recipients = []

        for assoc in associations:
            recipient = (
                db.query(Recipient).filter(Recipient.id == assoc.recipient_id).first()
            )
            if recipient:
                all_recipients.append(
                    {
                        "id": recipient.id,
                        "email": recipient.email,
                        "name": recipient.name,
                        "must_respond": assoc.must_respond,
                        "has_responded": assoc.has_responded,
                        "response_id": assoc.response_id,
                        "last_reminder_sent": assoc.last_reminder_sent,
                        "response_at": assoc.response_at
                    }
                )

                if assoc.must_respond:
                    required_recipients.append(
                        {
                            "id": recipient.id,
                            "email": recipient.email,
                            "name": recipient.name,
                        }
                    )

                    if assoc.has_responded:
                        responded_recipients.append(
                            {
                                "id": recipient.id,
                                "email": recipient.email,
                                "name": recipient.name,
                                "response_id": assoc.response_id,
                                "response_at": assoc.response_at
                            }
                        )
                    else:
                        pending_recipients.append(
                            {
                                "id": recipient.id,
                                "email": recipient.email,
                                "name": recipient.name,
                                "last_reminder_sent": assoc.last_reminder_sent,
                            }
                        )

        return {
            "all_recipients": all_recipients,
            "required_recipients": required_recipients,
            "responded_recipients": responded_recipients,
            "pending_recipients": pending_recipients,
        }

    @staticmethod
    def get_reminders_needing_sending(db: Session) -> List[Dict[str, Any]]:
        """
        Get a list of recipients who need reminders sent, based on the rules:
        - Email is not marked as done
        - Recipient is required to respond and hasn't yet
        - No reminder sent in the last 12 hours
        """
        now = datetime.now()
        reminder_threshold = now - timedelta(hours=12)

        # Get all tracked emails that aren't done and haven't pass the deadline
        tracked_emails = (
            db.query(TrackedEmail)
            .filter(
                ~TrackedEmail.is_done,  # Using SQLAlchemy's negate operator instead of is_done == False
                TrackedEmail.deadline
                > now,  # Only remind for emails that haven't passed their deadline
            )
            .all()
        )

        reminders_to_send = []

        for email in tracked_emails:
            # Get associations for required recipients who haven't responded
            associations = (
                db.query(TrackedEmailRecipient)
                .filter(
                    TrackedEmailRecipient.tracked_email_id == email.id,
                    TrackedEmailRecipient.must_respond,  # Removed == True for cleaner code
                    ~TrackedEmailRecipient.has_responded,  # Using SQLAlchemy's negate operator
                    (
                        (TrackedEmailRecipient.last_reminder_sent is None)
                        | (
                            TrackedEmailRecipient.last_reminder_sent
                            < reminder_threshold
                        )
                    ),
                )
                .all()
            )

            for assoc in associations:
                recipient = (
                    db.query(Recipient)
                    .filter(Recipient.id == assoc.recipient_id)
                    .first()
                )
                if recipient:
                    reminders_to_send.append(
                        {
                            "email": email,
                            "recipient": recipient,
                            "days_remaining": (email.deadline - now).days,
                            "association": assoc,
                        }
                    )

        return reminders_to_send

    @staticmethod
    def check_and_mark_responded(
        db: Session, tracked_email_id: int, sender_email: str, response_id: str
    ) -> bool:
        """
        Check if a sender is a tracked recipient and mark them as responded if so.
        This method is used by the automatic response checking process.

        Args:
            db: Database session
            tracked_email_id: Database ID of the tracked email
            sender_email: Email address of the response sender
            response_id: Gmail message ID of the response

        Returns:
            return information about what happened so the caller can later decide
            whether to broadcast a WebSocket event.
        """
        # Try to find a recipient with this email address
        recipient = db.query(Recipient).filter(Recipient.email == sender_email).first()
        if not recipient:
            return False

        # Check if this recipient is associated with the tracked email
        association = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == tracked_email_id,
                TrackedEmailRecipient.recipient_id == recipient.id,
            )
            .first()
        )

        if not association:
            return {"response_detected": False, "tracking_completed": False}

        # If recipient already marked as responded, do nothing boom, this is where we know new responses
        if association.has_responded:
            return {
                "response_detected": False,
                "tracking_completed": False,
            }

        # Mark recipient as responded
        association.has_responded = True
        association.response_id = response_id
        association.response_at = datetime.now()
        db.add(association)

        # Get the tracked email and update its status
        tracked_email = (
            db.query(TrackedEmail).filter(TrackedEmail.id == tracked_email_id).first()
        )


        if not tracked_email:
            db.commit()

            return {
                "response_detected": True,
                "tracking_completed": False,
            }

        # Check if all required recipients have responded
        required_recipients = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == tracked_email_id,
                TrackedEmailRecipient.must_respond.is_(True),
            )
            .all()
        )

        all_responded = (len(required_recipients) > 0 and all(
            recipient.has_responded for recipient in required_recipients
        ))

        # remember whether the email was already completed
        was_already_done = tracked_email.is_done

        tracking_completed = False

        # If all required recipients have responded, mark the email as done and notify the user?,
        if all_responded and not was_already_done:

            tracked_email.is_done = True
            tracked_email.completed_at = datetime.now()
            db.add(tracked_email)
            
            tracking_completed = True

        # Commit changes
        db.commit()

        return {
            "response_detected": True,
            "tracking_completed": tracking_completed,
            "tracked_email_id": tracked_email.id,
            "email_id": tracked_email.email_id,
            "recipient_email": sender_email,
            "subject": tracked_email.subject
        }

    def get_daily_activities(db: Session):
        """get daily activity history from the databases"""
        responses = (
            db.query(
                func.date(TrackedEmailRecipient.response_at).label("day"),
                func.count().label("responses")
            )
            .filter(TrackedEmailRecipient.response_at.isnot(None))
            .group_by(func.date(TrackedEmailRecipient.response_at))
            .order_by(func.date(TrackedEmailRecipient.response_at))
            .all()
        )

        reminders = (
            db.query(
                func.date(Reminder.sent_at).label("day"),
                func.count().label("reminders"),
            )
            .group_by(func.date(Reminder.sent_at))
            .all()
        )

        completed = (
            db.query(
                func.date(TrackedEmail.completed_at).label("day"),
                func.count().label("completed"),
            )
            .filter(TrackedEmail.completed_at.isnot(None))
            .group_by(func.date(TrackedEmail.completed_at))
            .all()
        )

        activity = {}
        for row in responses:
            activity[str(row.day)] = {
                "day": str(row.day),
                "responses": row.responses,
                "reminders": 0,
            }

        for row in reminders:
            if str(row.day) not in activity:
                activity[str(row.day)] = {
                    "day": str(row.day),
                    "responses": 0,
                    "reminders": 0,
                }
            
            activity[str(row.day)]["reminders"] = row.reminders

        for row in completed:
            if str(row.day) not in activity:
                activity[str(row.day)] = {
                    "day": str(row.day),
                    "responses": 0,
                    "reminders": 0,
                    "completed": 0,
                }

            activity[str(row.day)]["completed"] = row.completed

        return sorted(activity.values(), key=lambda x: x["day"])

