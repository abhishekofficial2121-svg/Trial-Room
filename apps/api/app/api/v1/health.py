"""Health endpoints for the API (readiness + liveness)."""

from fastapi import APIRouter
from apps.api.app.core.config import settings

router = APIRouter()


@router.get("/health", tags=["health"])
async def health():
    """Readiness probe — reports service configuration state (no secrets)."""
    return {
        "status": "ok",
        "service": "trialroom-api",
        "version": "0.1.0",
        "env": settings.APP_ENV,
        "mock_mode": settings.MOCK_MODE,
        "tryon_provider": settings.TRYON_PROVIDER,
    }