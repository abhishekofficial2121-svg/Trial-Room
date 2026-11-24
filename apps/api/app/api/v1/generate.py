"""Generation endpoints (V1 stub).

Creates an idempotent background job and returns a job ID.
Never holds the request open for model inference (spec Section 7.1).
"""

from fastapi import APIRouter, Path, HTTPException
from pydantic import BaseModel, Field
from uuid import uuid4

router = APIRouter()


class GenerateRequest(BaseModel):
    session_id: str
    idempotency_key: str | None = Field(
        None, description="Client-generated idempotency key to prevent duplicate inference"
    )


class GenerateResponse(BaseModel):
    job_id: str
    status: str
    message: str


@router.post(
    "/sessions/{session_id}/generate",
    response_model=GenerateResponse,
    tags=["generation"],
)
async def generate_tryon(session_id: str = Path(...), request: GenerateRequest = None):
    """Queue a virtual try-on background job.

    Phase 1 stub returns an accepted job. Phase 4 implements real
    asynchronous inference via Celery.
    """
    job_id = str(uuid4())
    return GenerateResponse(
        job_id=job_id,
        status="queued",
        message="Try-on job queued. Poll /api/v1/jobs/{job_id} for status.",
    )