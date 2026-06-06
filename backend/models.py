from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    create_engine,
)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
from sqlalchemy.sql import func
from config import Config


# Create a SQLite database in the current directory
# DATABASE_URL = "sqlite:///./email_tracker.db"
# engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

engine = create_engine(Config.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class TrackedEmailRecipient(Base):
    """Model for the association between TrackedEmail and Recipient with additional attributes."""

    __tablename__ = "tracked_email_recipients"

    tracked_email_id = Column(
        Integer, ForeignKey("tracked_emails.id", ondelete="CASCADE"), primary_key=True
    )
    recipient_id = Column(Integer, ForeignKey("recipients.id", ondelete="CASCADE"), primary_key=True,)
    must_respond = Column(Boolean, default=True)
    has_responded = Column(Boolean, default=False)
    response_id = Column(String(255), nullable=True) # Gmail Message ID of the response
    last_reminder_sent = Column(DateTime, nullable=True)


class TrackedEmail(Base):
    """Model for emails that need to be tracked for responses."""

    __tablename__ = "tracked_emails"

    id = Column(Integer, primary_key=True, index=True)
    email_id = Column(String(255), unique=True, index=True)  # Gmail message ID
    thread_id = Column(String(255), index=True)  # Gmail thread ID
    subject = Column(String(255))
    sender = Column(String(255))
    sent_date = Column(DateTime)
    deadline = Column(DateTime)  # When responses are due
    is_done = Column(Boolean, default=False)  # All required recipients have responded
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # Relationships
    recipient_associations = relationship(
        "TrackedEmailRecipient", backref="tracked_email", cascade="all, delete-orphan"
    )
    reminders = relationship(
        "Reminder", back_populates="tracked_email", cascade="all, delete-orphan"
    )

    def get_pending_recipients(self, db):
        """Get list of recipients who still need to respond."""

        pending = []
        associations = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == self.id,
                TrackedEmailRecipient.must_respond,  # Improved boolean syntax
                ~TrackedEmailRecipient.has_responded,  # Using SQLAlchemy's negate operator
            )
            .all()
        )

        for assoc in associations:
            recipient = (
                db.query(Recipient).filter(Recipient.id == assoc.recipient_id).first()
            )
            if recipient:
                pending.append(recipient)

        return pending

    def check_if_done(self, db):
        """Check if all required recipients have responded."""

        # Check if there are any required recipients who haven't responded
        pending_count = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == self.id,
                TrackedEmailRecipient.must_respond,  # Improved boolean syntax
                ~TrackedEmailRecipient.has_responded,  # Using SQLAlchemy's negate operator
            )
            .count()
        )

        return pending_count == 0

    def update_status(self, db):
        """Update the is_done status based on recipient responses."""
        self.is_done = self.check_if_done(db)
        db.add(self)
        db.commit()


class Recipient(Base):
    """Model for email recipients."""

    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    name = Column(String(255), nullable=True)

    # Relationships
    email_associations = relationship(
        "TrackedEmailRecipient", backref="recipient", cascade="all, delete-orphan"
    )


class Reminder(Base):
    """Model for email reminders sent to recipients."""

    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    tracked_email_id = Column(Integer, ForeignKey("tracked_emails.id", ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey("recipients.id"))
    sent_at = Column(DateTime, default=func.now())
    content = Column(Text, nullable=True)  # Content of the reminder

    # Relationships
    tracked_email = relationship("TrackedEmail", back_populates="reminders")
    recipient = relationship("Recipient")


# Create all tables in the database
def create_tables():
    Base.metadata.create_all(bind=engine)


# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
