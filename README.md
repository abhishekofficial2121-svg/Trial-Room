# Trial Room

Embeddable virtual try-on plugin for ecommerce websites — V1 co-founder demonstration.

## Overview

Trial Room lets shoppers see themselves wearing products on ecommerce
sites — not someone else's model. A shopper opens a product page,
launches Trial Room, uploads a photograph, and receives an AI-generated
visualization of themselves wearing the selected product.

**V1 scope:** Clothing only (T-shirts/shirts, full-body workflow,
front-view result). Anonymous sessions. Temporary storage with automatic
deletion.

## Repository layout

```
trial-room/
├── apps/           # demo-store (Next.js), widget (vanilla TS), api (FastAPI)
├── services/       # image_validation, tryon, safety, cleanup
├── packages/       # shared-types, sdk, api-client
├── infrastructure/ # docker, storage, deployment
├── docs/           # architecture, api, integration, privacy, development, ai-model-evaluation
├── tests/          # unit, integration, e2e
├── alembic/        # database migrations
├── docker-compose.yml
├── pyproject.toml
├── .env.example
├── README.md
└── CLAUDE.md
```

## Local development

1. Copy `.env.example` to `.env` and fill in values.
2. Start all services:

```bash
docker compose up --build
```

3. Services:
   - API: http://localhost:8000
   - API docs: http://localhost:8000/docs
   - Demo store: http://localhost:3000
   - MinIO console: http://localhost:9001
   - PostgreSQL: localhost:5432
   - Redis: localhost:6379

4. Run migrations:

```bash
docker compose exec api python -m alembic upgrade head
```

5. Health check:

```bash
curl http://localhost:8000/healthz
curl http://localhost:8000/api/v1/health
```

## Phases

This project follows the phased plan in `CLAUDE.md` and `docs/`.
Phase 1 (Foundation) is the current target: all local services start
reliably and health checks pass.

## Privacy

Customer photographs are temporary processing inputs only — never
stored in PostgreSQL, never logged, never used for training. See
`docs/privacy.md`.

## License

Internal development specification. Not yet released.