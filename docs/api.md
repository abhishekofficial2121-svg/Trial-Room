# API Reference — Trial Room V1

Base path: `/api/v1`

## Endpoints

- `POST /sessions` — Create anonymous session
- `POST /sessions/{session_id}/upload` — Authorize secure upload
- `POST /sessions/{session_id}/validate` — Validate uploaded image
- `POST /sessions/{session_id}/generate` — Queue try-on job (idempotent)
- `GET /jobs/{job_id}` — Get job status
- `DELETE /sessions/{session_id}` — Delete session and assets

OpenAPI docs available at `/docs` when the API is running.