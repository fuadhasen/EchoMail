"""Configuration Setting"""

from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    DATABASE_URL: str
    CLIENT_ID: str
    CLIENT_SECRET: str
    REDIRECT_URI: str
    FRONTEND_URL: str
    TOKEN_URI: str

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

USER_PATH=Path("user.json")
TOKEN_PATH=Path("token.json")

Config = Settings()
