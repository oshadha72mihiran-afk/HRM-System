# backend/app/core/config.py
from functools import lru_cache
from pathlib import Path
from typing import List

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_ROOT / ".env", 
        env_file_encoding="utf-8", 
        extra="ignore"
    )

    # Database - Using port 5432 (default PostgreSQL port)
    database_url: str = Field(
        default="postgresql://postgres:root@localhost:5432/hrm_db"
    )
    
    # JWT Settings
    jwt_secret: str = Field(
        default="change-me-to-a-secure-secret-key"
    )
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=60)
    
    # File Upload
    upload_dir: str = Field(default="uploads")
    
    # API Settings
    api_v1_prefix: str = Field(default="/api/v1")
    
    # CORS
    cors_origins: List[str] = Field(
        default_factory=lambda: ["http://localhost:3000", "http://localhost:3001"]
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()