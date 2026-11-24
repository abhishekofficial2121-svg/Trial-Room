"""Application configuration using pydantic-settings.

All configuration comes from environment variables. Secrets are never
hardcoded. See .env.example for the full list of supported variables.
"""

from pydantic import ConfigDict
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # --- Application ---
    APP_NAME: str = "trial-room"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    LOG_LEVEL: str = "info"
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    API_PREFIX: str = "/api/v1"
    CORS_ORIGINS: str = "http://localhost:3000,http://localhost:3001"

    # --- Security ---
    SESSION_SECRET_KEY: str = "change-me-in-production-min-32-chars"
    JWT_SECRET_KEY: str = "change-me-in-production-min-32-chars"
    ENCRYPTION_KEY: str = "change-me-32-byte-base64-value"

    # --- Database ---
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "trialroom"
    POSTGRES_PASSWORD: str = "changeme"
    POSTGRES_DB: str = "trialroom"
    DATABASE_URL: str = "postgresql+psycopg2://trialroom:changeme@localhost:5432/trialroom"

    # --- Cache / Queue ---
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_PASSWORD: str = ""
    REDIS_DB: int = 0
    CELERY_BROKER_URL: str = "redis://:changeme@localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://:changeme@localhost:6379/1"

    # --- Object Storage ---
    STORAGE_PROVIDER: str = "minio"
    STORAGE_BUCKET: str = "trialroom-assets"
    AWS_ACCESS_KEY_ID: str = "minioadmin"
    AWS_SECRET_ACCESS_KEY: str = "minioadmin"
    STORAGE_ENDPOINT: str = "http://localhost:9000"
    STORAGE_REGION: str = "us-east-1"
    STORAGE_USE_SSL: bool = False

    # --- AI / Try-on ---
    TRYON_PROVIDER: str = "mock"
    TRYON_MODEL_ID: str = "placeholder"
    TRYON_DEVICE: str = "cpu"
    TRYON_WORKER_CONCURRENCY: int = 1

    # --- Retention (minutes) ---
    SESSION_TTL_MINUTES: int = 30
    MAX_ASSET_LIFETIME_MINUTES: int = 60
    CLEANUP_INTERVAL_MINUTES: int = 5

    # --- Merchant ---
    MERCHANT_API_KEY: str = "changeme-merchant-key"

    # --- Feature flags ---
    MOCK_MODE: bool = False
    ENABLE_CAMERA_UPLOAD: bool = True

    model_config = ConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()