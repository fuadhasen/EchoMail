"""Configuration Setting"""

from pydantic_settings import BaseSettings
from pathlib import Path
import os

class Settings(BaseSettings):
    DATABASE_URL: str
    CLIENT_ID: str
    CLIENT_SECRET: str
    REDIRECT_URI: str
    FRONTEND_URL: str
    TOKEN_URI: str
    TOKEN_ENCRYPTION_KEY: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    COOKIE_SECURE: bool

    model_config = {
        "env_file": os.getenv("ENV_FILE", ".env"),
        "extra": "ignore"
    }

USER_PATH=Path("user.json")
TOKEN_PATH=Path("token.json")

Config = Settings()
