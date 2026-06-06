"""Service module for managing and processing data.
This module provides a set of functions to comunicate with Gmail API
"""

import base64
import json
from config import Config
from pathlib import Path
from typing import List, Dict, Any, Optional, Union


from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class GmailService:
    """Gmail API service class.
    This class provides methods to create and return a Gmail service object
    for interacting with the Gmail API. It handles authentication and
    authorization using OAuth 2.0, and stores the user's access and refresh
    tokens in a file called token.json. which should be created
    using the Google Cloud Console.
    """

    SCOPES = [
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
    TOKEN_PATH = Path("token.json")

    def __init__(self):
        self.creds = None
        self.service = None
        self.error  = None

        # Attempt to initialize the service, handling the case of missing credentials
        try:
            # Check if token file exists
            if self.TOKEN_PATH.exists():
                with open(self.TOKEN_PATH, "r") as f:
                    token_data = json.load(f)

                self.creds = Credentials(
                    token=token_data.get("token") or token_data.get("access_token"),
                    refresh_token=token_data.get("refresh_token"),
                    token_uri=Config.TOKEN_URI,
                    client_id=Config.CLIENT_ID,
                    client_secret=Config.CLIENT_SECRET,
                    scopes=self.SCOPES
                )

                # refresh_token
                if self.creds and self.creds.expired and self.creds.refresh_token:
                    self.creds.refresh(Request())
                    with open(self.TOKEN_PATH, "w") as f:
                        f.write(self.creds.to_json())
                
                self.service = build("gmail", "v1", credentials=self.creds)

            else:
                self.error = "Token file not exist, user is not Authenticated"

        except HttpError as e:
            self.error = f"HTTP Error: {e}"
        except Exception as e:
            self.error = f"Initialization error: {e}"


    def is_available(self):
        """Check if the Gmail service is properly initialized and available.

        Returns:
            bool: True if service is available, False otherwise
        """
        return self.service is not None and self.error is None

    def get_credentials_error(self):
        """Return the credentials error message if any.

        Returns:
            str: Error message or None if no error occurred
        """
        return self.error

    def get_service(self):
        """Return the Gmail service object."""
        return self.service

    def get_emails(self, user_id="me", query="", max_results: int = 10):
        """Get emails from the user's mailbox.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            query (str): A search query to filter the emails.
        Returns:
            list: A list of email messages.
        """
        try:
            results = (
                self.service.users().messages().list(userId=user_id, q=query, maxResults=max_results).execute()
            )
            messages = results.get("messages", [])
            return messages
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []
    
    def get_user_info(self):
        """Get user information (email_addresses, photos, names)
        """
        people_service = build("people", "v1", credentials=self.creds)
        print("scopes", self.creds.scopes)
        if people_service is None:
            return {"error": "user is not authenticated"}
        
        try:
            user_info = (
                people_service.people().get(resourceName='people/me', personFields='names,emailAddresses,photos').execute()
            )
            return user_info
        except HttpError as error:
            print (f'An error occurred: {error}')
            return []

    def search_emails(
        self,
        user_id="me",
        criteria: Dict[str, Any] = None,
        max_results: int = 100,
        search_term: str = None,
    ) -> List[Dict[str, Any]]:
        """Search emails based on multiple criteria.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            criteria (Dict[str, Any]): Dictionary containing search criteria.
                Possible keys:
                - 'from': Sender's email address
                - 'to': Recipient's email address
                - 'subject': Email subject
                - 'after': Date after (YYYY/MM/DD)
                - 'before': Date before (YYYY/MM/DD)
                - 'has': Content to search for, like attachments
                - 'label': Email label
            max_results (int): Maximum number of results to return.
            search_term (str, optional): A single search term that will be used to search in
                both subject and body content. This simplifies searching across multiple fields.

        Returns:
            List[Dict[str, Any]]: A list of email messages matching the criteria.
        """
        try:
            # Build the query string from the criteria dictionary
            query_parts = []
            if criteria:
                for key, value in criteria.items():
                    if key == "from" and value:
                        query_parts.append(f"from:{value}")
                    elif key == "to" and value:
                        query_parts.append(f"to:{value}")
                    elif key == "subject" and value:
                        query_parts.append(f"subject:{value}")
                    elif key == "after" and value:
                        query_parts.append(f"after:{value}")
                    elif key == "before" and value:
                        query_parts.append(f"before:{value}")
                    elif key == "has" and value:
                        query_parts.append(f"has:{value}")
                    elif key == "label" and value:
                        query_parts.append(f"label:{value}")

            # If search_term is provided, search in both subject and body
            if search_term:
                # Gmail's search syntax: Use OR to search in subject or in the general content
                query_parts.append(f"(subject:{search_term} OR {search_term})")

            query = " ".join(query_parts)

            results = (
                self.service.users()
                .messages()
                .list(userId=user_id, q=query, maxResults=max_results)
                .execute()
            )

            messages = results.get("messages", [])
            return messages
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []

    def search_sent_emails(
        self,
        user_id="me",
        subject=None,
        body_content=None,
        recipient=None,
        search_term=None,
        max_results: int = 100,
    ) -> List[Dict[str, Any]]:
        """Search specifically for sent emails by subject, body content, or recipient.

        This is a specialized search method focused on sent emails with simple filtering.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            subject (str, optional): Search for emails containing this text in the subject.
            body_content (str, optional): Search for emails containing this text in the body.
            recipient (str, optional): Search for emails sent to this recipient.
            search_term (str, optional): A single search term that will be used to search in
                both subject and body content simultaneously.
            max_results (int): Maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A list of email messages matching the criteria.
        """
        try:
            # Build the query string
            query_parts = ["from:me"]  # Starting with emails sent by the user

            if subject:
                query_parts.append(f"subject:{subject}")
            if recipient:
                query_parts.append(f"to:{recipient}")
            if body_content:
                query_parts.append(body_content)

            # Use the unified search approach if search_term is provided
            if search_term:
                query_parts.append(f"(subject:{search_term} OR {search_term})")

            query = " ".join(query_parts)

            results = (
                self.service.users()
                .messages()
                .list(userId=user_id, q=query, maxResults=max_results)
                .execute()
            )

            messages = results.get("messages", [])
            return messages
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []

    def get_sent_emails(
        self,
        user_id="me",
        additional_criteria: Optional[Dict[str, Any]] = None,
        max_results: int = 100,
    ) -> List[Dict[str, Any]]:
        """Get emails sent by the user with optional additional criteria.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            additional_criteria (Dict[str, Any], optional): Additional search criteria
                to combine with the 'sent' label.
            max_results (int): Maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A list of sent email messages.
        """
        criteria = additional_criteria or {}
        criteria["label"] = "sent"
        return self.search_emails(user_id, criteria, max_results)

    def get_email_details(self, user_id="me", msg_id=""):
        """Get details of a specific email message.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the email message.
        Returns:
            dict: A dictionary containing the email message details.
        """
        try:
            message = (
                self.service.users().messages().get(userId=user_id, id=msg_id).execute()
            )
            return message
        except HttpError as error:
            print(f"An error occurred: {error}")
            return {}

    def get_email_body(self, user_id="me", msg_id=""):
        """Get the body of a specific email message.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the email message.
        Returns:
            str: The body of the email message.
        """
        try:
            message = self.get_email_details(user_id, msg_id)
            if "payload" in message and "parts" in message["payload"]:
                parts = message["payload"]["parts"]
                for part in parts:
                    if part["mimeType"] == "text/plain":
                        data = part["body"]["data"]
                        return base64.urlsafe_b64decode(data).decode("utf-8")
            # Handle case where email doesn't have parts
            elif (
                "payload" in message
                and "body" in message["payload"]
                and "data" in message["payload"]["body"]
            ):
                data = message["payload"]["body"]["data"]
                return base64.urlsafe_b64decode(data).decode("utf-8")
            return ""
        except HttpError as error:
            print(f"An error occurred: {error}")
            return ""

    def get_email_subject(self, user_id="me", msg_id=""):
        """Get the subject of a specific email message.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the email message.
        Returns:
            str: The subject of the email message.
        """
        try:
            message = self.get_email_details(user_id, msg_id)
            headers = message["payload"]["headers"]
            for header in headers:
                if header["name"] == "Subject":
                    return header["value"]
            return ""
        except HttpError as error:
            print(f"An error occurred: {error}")
            return ""

    def get_email_sender(self, user_id="me", msg_id=""):
        """Get the sender of a specific email message.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the email message.
        Returns:
            str: The sender of the email message.
        """
        try:
            message = self.get_email_details(user_id, msg_id)
            headers = message["payload"]["headers"]
            for header in headers:
                if header["name"] == "From":
                    return header["value"]
            return ""
        except HttpError as error:
            print(f"An error occurred: {error}")
            return ""

    def get_email_recipient(self, user_id="me", msg_id=""):
        """Get the recipient of a specific email message.
        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the email message.
        Returns:
            list: A list of recipient email addresses.
        """
        try:
            message = self.get_email_details(user_id, msg_id)
            headers = message["payload"]["headers"]
            recipients = []

            for header in headers:
                if header["name"] == "To":
                    # Split the recipient string by commas and strip whitespace
                    recipient_str = header["value"]
                    recipient_list = [r.strip() for r in recipient_str.split(",")]
                    recipients.extend(recipient_list)
                # Also check CC and BCC headers for additional recipients
                elif header["name"] == "Cc":
                    cc_str = header["value"]
                    cc_list = [r.strip() for r in cc_str.split(",")]
                    recipients.extend(cc_list)
                elif header["name"] == "Bcc":
                    bcc_str = header["value"]
                    bcc_list = [r.strip() for r in bcc_str.split(",")]
                    recipients.extend(bcc_list)

            return recipients
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []

    def get_emails_with_details(
        self, user_id="me", criteria: Dict[str, Any] = None, max_results: int = 20
    ) -> List[Dict[str, Any]]:
        """Get emails with their details in a single call.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            criteria (Dict[str, Any]): Dictionary containing search criteria.
            max_results (int): Maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A list of emails with their details.
        """
        try:
            emails = self.search_emails(user_id, criteria, max_results)
            detailed_emails = []

            for email in emails:
                msg_id = email["id"]
                details = {
                    "id": msg_id,
                    "subject": self.get_email_subject(user_id, msg_id),
                    "sender": self.get_email_sender(user_id, msg_id),
                    "recipient": self.get_email_recipient(user_id, msg_id),
                    "snippet": email.get("snippet", ""),
                }
                detailed_emails.append(details)

            return detailed_emails
        except Exception as error:
            print(f"An error occurred: {error}")
            return []

    def get_email_responses(
        self, user_id="me", msg_id="", max_results: int = 100
    ) -> List[Dict[str, Any]]:
        """Get responses to a specific email.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the original email message.
            max_results (int): Maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A list of email messages that are responses to the original.
        """
        try:
            # First, get the details of the original message to extract subject
            original_message = self.get_email_details(user_id, msg_id)

            if not original_message:
                return []

            thread_id = original_message.get("threadId", "")

            if not thread_id:
                return []

            # Get all messages in the same thread
            results = (
                self.service.users()
                .threads()
                .get(userId=user_id, id=thread_id)
                .execute()
            )

            # Filter out the original message and keep only responses
            messages = results.get("messages", [])
            responses = [msg for msg in messages if msg.get("id") != msg_id]

            return responses[:max_results]
        except HttpError as error:
            print(f"An error occurred: {error}")
            return []

    def get_email_responses_with_details(
        self, user_id="me", msg_id="", max_results: int = 100
    ) -> List[Dict[str, Any]]:
        """Get responses to a specific email with detailed information.

        Args:
            user_id (str): The user's email address. The special value "me"
                indicates the authenticated user.
            msg_id (str): The ID of the original email message.
            max_results (int): Maximum number of results to return.

        Returns:
            List[Dict[str, Any]]: A list of email messages with details that are responses to the original.
        """
        responses = self.get_email_responses(user_id, msg_id, max_results)
        detailed_responses = []

        for response in responses:
            response_id = response.get("id")
            if response_id:
                # Extract headers and format them properly as a dictionary
                header_dict = {}

                # Get the full message details to access proper headers
                msg_details = self.get_email_details(user_id, response_id)
                if (
                    msg_details
                    and "payload" in msg_details
                    and "headers" in msg_details["payload"]
                ):
                    for header in msg_details["payload"]["headers"]:
                        if header["name"] in ["Subject", "From", "To", "Date"]:
                            header_dict[header["name"].lower()] = header["value"]

                # Format the response with proper types for serialization
                details = {
                    "id": response_id,
                    "subject": self.get_email_subject(user_id, response_id),
                    "sender": self.get_email_sender(user_id, response_id),
                    "recipients": self.get_email_recipient(
                        user_id, response_id
                    ),  # Now returns a list
                    "snippet": response.get("snippet", ""),
                    "labelIds": ",".join(
                        response.get("labelIds", [])
                    ),  # Convert list to string
                    "headers": str(header_dict),  # Convert dict to string
                    "threadId": response.get("threadId", ""),
                }
                detailed_responses.append(details)

        return detailed_responses


def _get_body_content(payload: Dict[str, Any]) -> str:
    """Helper function to extract the body content from the email payload."""
    if "parts" in payload:
        for part in payload["parts"]:
            if part["mimeType"] == "text/plain":
                if "data" in part["body"]:
                    return base64.urlsafe_b64decode(part["body"]["data"]).decode(
                        "utf-8"
                    )
            elif "parts" in part:
                return _get_body_content(part)
    elif "body" in payload and "data" in payload["body"]:
        return base64.urlsafe_b64decode(payload["body"]["data"]).decode("utf-8")
    return ""
