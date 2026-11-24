"""Validation endpoints (V1 stub).

Returns category/workflow-specific validation results.
Actual file/quality/person checks implemented in Phase 3.
"""

from fastapi import APIRouter, Path, HTTPException
from pydantic import BaseModel, Field
from typing import List

router = APIRouter()


class ValidationCheck(BaseModel):
    name: str
    passed: bool
    message: str | None = None


class ValidationResponse(BaseModel):
    valid: bool
    category: str = "clothing"
    workflow: str = "full_body_clothing"
    checks: List[ValidationCheck]
    errors: List[str] = []
    message: str


@router.post(
    "/sessions/{session_id}/validate",
    response_model=ValidationResponse,
    tags=["validation"],
)
async def validate_image(session_id: str = Path(...)):
    """Validate an uploaded image for the session.

    Phase 1 stub returns a not-yet-validated state. Phase 3 implements
    file signature, quality, person detection, pose, and safety checks.
    """
    return ValidationResponse(
        valid=False,
        checks=[
            ValidationCheck(
                name="file_received",
                passed=False,
                message="No image has been uploaded yet for this session.",
            )
        ],
        errors=["IMAGE_NOT_UPLOADED"],
        message="Please upload a photograph before validation.",
    )