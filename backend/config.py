"""Configuration Setting"""

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    CLIENT_ID: str
    CLIENT_SECRET: str
    REDIRECT_URI: str
    TOKEN_URI: str

    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

Config = Settings()
