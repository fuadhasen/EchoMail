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
from sqlalchemy.orm import joinedload
from sqlalchemy.sql import func
from config import Config
from datetime import datetime
from sqlalchemy import UniqueConstraint



# prod db require ssl
engine = create_engine(Config.DATABASE_URL, connect_args={"ssl": {}})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


class User(Base):
    """Multiple user support table"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=True)
    picture = Column(Text, nullable=True)

    notify_on_response = Column(Boolean, default=True, nullable=False)
    reminder_template = Column(
        Text, nullable=False,
        default=(
            "Hi {name},\n\n"
            "Just following up on my previous email as the response deadline "
            "is approaching. Please let me know if you've had a chance to "
            "review it.\n\n"
            "Best,\n"
            "Fuad"
        ),
    )

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # relationships , nikkah is better btw :)
    google_auth = relationship('GoogleAuth', back_populates='user')
    tracked_emails = relationship('TrackedEmail', back_populates='user', cascade='all, delete-orphan')
    recipients = relationship('Recipient', back_populates='user', cascade='all, delete-orphan')


class GoogleAuth(Base):
    """Stores Google OAuth credentials for the single Echomail User."""
    __tablename__ = "google_auth"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True)

    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text, nullable=True)
    token_type = Column(String(50), nullable=True)
    expires_at = Column(DateTime, nullable=True)

    # Google Account information
    email = Column(String(255), nullable=True)
    name = Column(String(255), nullable=True)
    picture = Column(Text, nullable=True)

    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # relationship (1:1)
    user = relationship('User', back_populates="google_auth")


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

    response_at = Column(DateTime, nullable=True)

    # Relationship
    recipient = relationship("Recipient", back_populates="email_associations")
    tracked_email = relationship('TrackedEmail', back_populates='recipient_associations')


class TrackedEmail(Base):
    """Model for emails that need to be tracked for responses."""

    __tablename__ = "tracked_emails"

    id = Column(Integer, primary_key=True, index=True)
    # if there is no unique FK, its 1 to many
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    email_id = Column(String(255), unique=True, index=True)  # Gmail message ID
    thread_id = Column(String(255), index=True)  # Gmail thread ID
    subject = Column(String(255))
    sender = Column(String(255))
    sent_date = Column(DateTime)
    deadline = Column(DateTime)  # When responses are due
    is_done = Column(Boolean, default=False)  # All required recipients have responded
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    # completed_at?
    completed_at = Column(DateTime, nullable=True)

    # Relationships
    recipient_associations = relationship(
        "TrackedEmailRecipient", back_populates="tracked_email", cascade="all, delete-orphan"
    )
    reminders = relationship(
        "Reminder", back_populates="tracked_email", cascade="all, delete-orphan"
    )
    user = relationship('User', back_populates='tracked_emails')


    def get_pending_recipients(self, db):
        """Get list of recipients who still need to respond."""

        associations = (
            db.query(TrackedEmailRecipient)
            .options(joinedload(TrackedEmailRecipient.recipient))
            .filter(
                TrackedEmailRecipient.tracked_email_id == self.id,
                TrackedEmailRecipient.must_respond,  # Improved boolean syntax
                ~TrackedEmailRecipient.has_responded,  # Using SQLAlchemy's negate operator
            )
            .all()
        )
        
        return [assoc.recipient for assoc in associations]

    def check_if_done(self, db):
        """Check if all required recipients have responded."""
        # Check if there are any required recipients who haven't responded
        pending_count = (
            db.query(TrackedEmailRecipient)
            .filter(
                TrackedEmailRecipient.tracked_email_id == self.id,
                TrackedEmailRecipient.must_respond == True,  # Improved boolean syntax
                TrackedEmailRecipient.has_responded == False,  # Using SQLAlchemy's negate operator
            )
            .count()
        )
        print(pending_count)

        return pending_count == 0

    def update_status(self, db):
        """Update the is_done status based on recipient responses."""
        # here completed_at ?
        was_done = self.is_done
        self.is_done = self.check_if_done(db)

        if (self.is_done) and not was_done:
            # just become completed
            self.completed_at = datetime.now()
        elif not self.is_done and was_done:
            # became incomplete again
            self.completed_at = None



class Recipient(Base):
    """Model for email recipients."""

    __tablename__ = "recipients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    email = Column(String(255), index=True)
    name = Column(String(255), nullable=True)

    # email should be unique with in a user not globally for all users
    __table_args__ = (
        UniqueConstraint("user_id", "email"),
    )

    # Relationships
    email_associations = relationship(
        "TrackedEmailRecipient", back_populates="recipient", cascade="all, delete-orphan"
    )
    user = relationship('User', back_populates='recipients')



class Reminder(Base):
    """Model for email reminders sent to recipients."""

    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    tracked_email_id = Column(Integer, ForeignKey("tracked_emails.id", ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey("recipients.id", ondelete="CASCADE"))
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
