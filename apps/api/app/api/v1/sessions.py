"""Session management endpoints (V1).

Anonymous session creation for a merchant/product context.
Session metadata only — no image bytes stored (spec Section 9.4).
"""

from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field
from uuid import uuid4
from datetime import datetime, timedelta

from apps.api.app.core.config import settings
from apps.api.app.core.database import SessionLocal, engine
from sqlalchemy import Column, String, DateTime
from apps.api.app.core.database import Base

router = APIRouter()


# --- Domain model (placeholder; will be migrated to Alembic in Phase 2) ---
class SessionORM(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True)
    merchant_id = Column(String, nullable=False, index=True)
    product_id = Column(String, nullable=False, index=True)
    variant_id = Column(String, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)


# --- Schemas ---
class SessionCreateRequest(BaseModel):
    merchant_id: str = Field(..., description="Merchant identifier")
    product_id: str = Field(..., description="Product identifier")
    variant_id: str | None = Field(None, description="Selected product variant")


class SessionCreateResponse(BaseModel):
    session_id: str
    status: str
    expires_at: str
    upload_url: str | None = None
    message: str


def _create_session_in_db(session_id: str, merchant_id: str, product_id: str,
                          variant_id: str | None, expires_at: datetime):
    """Persist session to PostgreSQL. Returns True on success."""
    db = SessionLocal()
    try:
        session = SessionORM(
            id=session_id,
            merchant_id=merchant_id,
            product_id=product_id,
            variant_id=variant_id,
            expires_at=expires_at,
        )
        db.add(session)
        db.commit()
        return True
    except Exception:
        db.rollback()
        return False
    finally:
        db.close()


@router.post("/sessions", response_model=SessionCreateResponse, tags=["sessions"])
async def create_session(
    request: SessionCreateRequest,
    x_request_id: str | None = Header(None, alias="X-Request-Id"),
):
    """Create an anonymous temporary session for a merchant/product context."""
    session_id = str(uuid4())
    expires_at = datetime.utcnow() + timedelta(minutes=settings.SESSION_TTL_MINUTES)

    db_ok = _create_session_in_db(session_id, request.merchant_id,
                                  request.product_id, request.variant_id, expires_at)

    if not db_ok:
        # Development fallback when PostgreSQL is not yet available.
        # In production, database writes are required (session isolation).
        return SessionCreateResponse(
            session_id=session_id,
            status="active",
            expires_at=expires_at.isoformat(),
            upload_url=f"{settings.API_PREFIX}/sessions/{session_id}/upload",
            message="Session created (dev mode: database unavailable). Upload a photograph to begin.",
        )

    return SessionCreateResponse(
        session_id=session_id,
        status="active",
        expires_at=expires_at.isoformat(),
        upload_url=f"{settings.API_PREFIX}/sessions/{session_id}/upload",
        message="Session created. Upload a photograph to begin.",
    )