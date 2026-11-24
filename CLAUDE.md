# CLAUDE.md — Trial Room Operating Instructions

This file directs how I (Cline) work on this repository. It is kept in
sync with `TRIAL ROOM V1 Specification.md` and updated as decisions
change.

## Role

Senior product-minded full-stack engineer and AI systems architect.
Decisions preserve modularity, privacy, testability, and a clear path
to commercial integration.

## Before coding (per phase)

1. Read the specification section relevant to the phase.
2. Inspect existing repository and files.
3. Identify existing working code and dependencies.
4. Identify missing services and credentials.
5. Evaluate candidate models and licenses (Phase 0 gate).
6. Document data-flow and privacy risks.
7. Propose implementation plan and folder structure.
8. List decisions requiring approval.

## Implementation rules

- TypeScript for widget, SDK, and demo storefront.
- Python for API and AI processing unless a justified alternative is documented.
- Keep UI, domain logic, API routes, and provider integrations separate.
- Use typed schemas (Pydantic for Python, TypeScript interfaces for TS).
- Use database migrations (Alembic).
- Use environment variables / secret management (never commit secrets).
- Use reusable components.
- Write tests for critical logic.
- Handle errors explicitly.
- Keep configuration out of business logic.
- Avoid unnecessary dependencies and premature microservices.
- Keep documentation updated.

## AI implementation rules

- Never claim a mocked integration is real.
- Mock providers must be explicitly enabled in development mode (`MOCK_MODE=true`).
- Never return hardcoded images as actual AI results.
- Verify model and weight licensing before adoption.
- Verify provider retention before sending user images (docs/ai-model-evaluation.md).
- Do not silently switch to a materially different model.
- Use bounded retries and timeouts.
- Validate every generated output.
- Record limitations and known failure modes.

## Privacy rules

- Never permanently store shopper photographs.
- Never use shopper photographs for training.
- Never log image contents.
- Never expose public image URLs.
- Delete source and result assets on expiry or explicit deletion.
- Verify deletion and retry failures.
- Enforce tenant and session isolation.

## Phase checkpoints

At the end of each phase, report:
1. What was implemented.
2. What works end to end.
3. Tests run and their results.
4. What remains incomplete.
5. External credentials/services still needed.
6. Risks or blockers.
7. The next phase.

## Current phase: Phase 1 — Foundation

Exit criteria: All local services start reliably and health checks pass.

## Verified facts (from specification + direct checks)

- OOTDiffusion (`levihsu/OOTDiffusion`) is CC BY-NC-SA 4.0 (NonCommercial) — excluded for commercial V1 use without a separate commercial license.
- IDM-VTON (`Alexzhanghao/IDM-VTON`) and CatVTON (`Yu-Zheng1999/CatVTON`) repos returned 404 — licenses still to be located/verified.
- Working directory `d:\Trial Room` was empty; no existing code or git repo.

## Next step after Phase 1

Phase 2 — Demo store and widget: build Next.js demo storefront, sample garment catalogue, product detail pages, variant selection, Trial Room widget/modal, connect widget to session API.