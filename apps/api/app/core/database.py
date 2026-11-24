"""Database connection and session management (SQLAlchemy).

Only metadata is stored in PostgreSQL — never image bytes, face
embeddings, or body measurements (spec Section 9.4).

When PostgreSQL is not available (e.g. local dev without Docker),
set DATABASE_URL=sqlite:///./trialroom.db to fall back to SQLite.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from apps.api.app.core.config import settings

# Allow SQLite fallback for local development without Docker/PostgreSQL.
database_url = settings.DATABASE_URL
if database_url.startswith("postgresql") and os.getenv("TRIALROOM_DB_FALLBACK", "").lower() in ("1", "true", "yes"):
    database_url = "sqlite:///./trialroom.db"

engine = create_engine(
    database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    connect_args={"check_same_thread": False} if database_url.startswith("sqlite") else {},
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Yield a SQLAlchemy session and ensure it is closed after use."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()