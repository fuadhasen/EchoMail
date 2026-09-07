from cryptography.fernet import Fernet
from config import Config

cipher = Fernet(Config.TOKEN_ENCRYPTION_KEY)

def encrypt_token(token: str):
    """Encrypt an OAuth token before storing it in the database."""
    return cipher.encrypt(token.encode()).decode()

def decrypt_token(encrypted_token: str) -> str:
    """Decrypt an OAuth token retrieved from the database."""
    return cipher.decrypt(encrypted_token.encode()).decode()
