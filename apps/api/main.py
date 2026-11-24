"""Trial Room API entry point (V1).

Creates the FastAPI application, registers routers, middleware, and
lifecycle events. All routes live under /api/v1.
"""

import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from apps.api.app.core.config import settings
from apps.api.app.core.database import engine, Base, SessionLocal
from apps.api.app.api.v1 import health, sessions, upload, validate, generate, jobs

logging.basicConfig(level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO))
logger = logging.getLogger("trialroom")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan — replaces deprecated on_event handlers."""
    logger.info("Trial Room API starting (env=%s, mock=%s)", settings.APP_ENV, settings.MOCK_MODE)
    yield
    logger.info("Trial Room API shutting down")
    await engine.dispose()


app = FastAPI(
    title="Trial Room API",
    description="Embeddable virtual try-on API for ecommerce (V1).",
    version="0.1.0",
    docs_url="/docs",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
)

# CORS — strict configuration per spec Section 10.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_id_middleware(request: Request, call_next):
    """Attach a correlation ID to every request and response."""
    import uuid

    request_id = request.headers.get("X-Request-Id", str(uuid.uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-Id"] = request_id
    return response


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Never leak raw stack traces or provider errors to shoppers."""
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An unexpected error occurred.",
                "request_id": getattr(request.state, "request_id", None),
            }
        },
    )


# Routers
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])
app.include_router(sessions.router, prefix=settings.API_PREFIX, tags=["sessions"])
app.include_router(upload.router, prefix=settings.API_PREFIX, tags=["upload"])
app.include_router(validate.router, prefix=settings.API_PREFIX, tags=["validation"])
app.include_router(generate.router, prefix=settings.API_PREFIX, tags=["generation"])
app.include_router(jobs.router, prefix=settings.API_PREFIX, tags=["jobs"])


@app.get("/healthz", tags=["health"], include_in_schema=False)
async def healthz():
    """Liveness probe for container orchestration."""
    return {"status": "ok"}