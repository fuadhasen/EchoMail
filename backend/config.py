"""Configuration Setting"""

from pydantic_settings import BaseSettings
from pathlib import Path
import os

ENV_FILE = Path(__file__).resolve().parent / ".env"


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
    SAMESITE: str

    model_config = {
        "env_file": ENV_FILE,
        "extra": "ignore"
    }


Config = Settings()
