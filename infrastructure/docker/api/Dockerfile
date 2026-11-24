FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# System dependencies (libpq for psycopg2, build tools)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY pyproject.toml ./
RUN pip install --no-cache-dir -e .

# Application code (mounted via docker-compose volumes for live reload)
COPY apps ./apps
COPY packages ./packages
COPY services ./services

# Healthcheck
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
  CMD curl -f http://localhost:8000/healthz || exit 1

EXPOSE 8000

CMD ["sh", "-c", "python -m alembic upgrade head && uvicorn apps.api.main:app --host 0.0.0.0 --port 8000"]