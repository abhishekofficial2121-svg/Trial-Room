"""Upload endpoints (V1 stub).

Secure upload handling returns a short-lived upload authorization.
Actual file validation happens server-side (Phase 3).
"""

from fastapi import APIRouter, Path, HTTPException, status
from pydantic import BaseModel
from datetime import datetime, timedelta

from apps.api.app.core.config import settings

router = APIRouter()


class UploadAuthorizeResponse(BaseModel):
    session_id: str
    upload_url: str
    method: str = "PUT"
    expires_in_seconds: int
    max_file_size_mb: int = 10
    accepted_formats: list[str] = ["image/jpeg", "image/png", "image/webp"]
    message: str


@router.post(
    "/sessions/{session_id}/upload",
    response_model=UploadAuthorizeResponse,
    tags=["upload"],
)
async def authorize_upload(session_id: str = Path(...)):
    """Return a short-lived signed upload URL for the session.

    The widget PUTs the image directly to private object storage.
    Server-side validation occurs on a separate validate call.
    """
    expires_in = 900  # 15 minutes
    return UploadAuthorizeResponse(
        session_id=session_id,
        upload_url=f"{settings.API_PREFIX}/sessions/{session_id}/upload/signed",
        expires_in_seconds=expires_in,
        message="Upload authorization ready. Select a photograph (JPEG, PNG, or WebP, max 10 MB).",
    )