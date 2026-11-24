"""Job status endpoints (V1 stub).

Returns queued, processing, quality-checking, completed, or failed state.
Only returns result references to the owning session (spec Section 12.5).
"""

from fastapi import APIRouter, Path
from pydantic import BaseModel

router = APIRouter()


class JobStatusResponse(BaseModel):
    job_id: str
    status: str
    progress_stage: str | None = None
    result_url: str | None = None
    error_code: str | None = None
    message: str


@router.get("/jobs/{job_id}", response_model=JobStatusResponse, tags=["jobs"])
async def get_job_status(job_id: str = Path(...)):
    """Return the status of a background try-on job.

    Phase 1 stub returns a not-found state. Phase 4 wires this to Celery
    task results and signed result URLs.
    """
    return JobStatusResponse(
        job_id=job_id,
        status="unknown",
        message="Job not found. It may have expired or the job ID may be invalid.",
    )