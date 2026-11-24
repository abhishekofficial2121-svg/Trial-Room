# Development — Trial Room V1

## Local setup

1. Copy `.env.example` to `.env`.
2. Start services with Docker Compose: `docker compose up --build`.
3. Run migrations: `docker compose exec api python -m alembic upgrade head`.
4. Health check: `curl http://localhost:8000/healthz`.

## Without Docker

Python 3.11 and Node.js 24 are available locally. Install API dependencies:

```bash
pip install -e .
```

Then run the API with uvicorn:

```bash
uvicorn apps.api.main:app --reload
```

Note: PostgreSQL, Redis, and MinIO are required for full functionality.