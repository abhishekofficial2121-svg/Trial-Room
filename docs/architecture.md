# Architecture — Trial Room V1

Three independently understandable layers:

1. **Core platform** (FastAPI + Python): sessions, upload, validation, product metadata, AI orchestration, background jobs (Celery), quality/safety checks, temporary storage (S3-compatible), result delivery, cleanup.
2. **Embeddable widget + SDK** (vanilla TypeScript): CTA integration, upload UI, validation/processing states, result viewer, error UI, responsive rendering.
3. **Demo storefront** (Next.js): realistic product pages, variants, gallery, Trial Room CTA.

## Data flow

Shopper → product page → widget → session API → signed upload URL → private object storage → validation API → generate API → Celery worker → try-on provider → output QA/safety → result storage → signed result URL → widget viewer → TTL cleanup.

## Privacy boundary

PostgreSQL stores metadata only (no image bytes). Object storage is private with short-lived signed URLs. Session TTL 30 min, max asset lifetime 60 min, cleanup worker every 5 min.