# AI Model Evaluation — Trial Room V1

## Candidate models evaluated (VERSION 2 — after Phase 0 license verification)

| Model | Repository | License | Commercial use | V1 viability |
|-------|-----------|---------|----------------|---------------|
| OOTDiffusion | levihsu/OOTDiffusion | CC BY-NC-SA 4.0 | ❌ No (NonCommercial) | Excluded |
| IDM-VTON | yisol/IDM-VTON | CC BY-NC-SA 4.0 | ❌ No (NonCommercial) | Excluded |
| CatVTON | Zheng-Chong/CatVTON-Page | None (no LICENSE file) | ❓ Unknown / All rights reserved | Cannot use without license clarification |

## License verification details

### OOTDiffusion (`levihsu/OOTDiffusion`)
- License: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0)
- Verified via GitHub API: `spdx_id: "NOASSERTION"`, license text confirms CC BY-NC-SA 4.0
- **Commercial use: NOT permitted** without a separate commercial license from the rights holder
- Source: Direct LICENSE file fetch (confirmed Nov 2026)

### IDM-VTON (`yisol/IDM-VTON`)
- License: **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International** (CC BY-NC-SA 4.0)
- Verified via GitHub API: `spdx_id: "NOASSERTION"`, LICENSE.txt confirms CC BY-NC-SA 4.0
- Note: The spec's guessed repo URL (`Alexzhanghao/IDM-VTON`) was incorrect — the actual repo is `yisol/IDM-VTON` (5,266 stars, ECCV 2024)
- **Commercial use: NOT permitted** without a separate commercial license from the rights holder
- Source: Direct LICENSE.txt fetch (confirmed Nov 2026)

### CatVTON (`Zheng-Chong/CatVTON-Page`)
- License: **None** — no LICENSE file in the repository (GitHub API returned 404 for `/license`)
- Note: The spec's guessed repo URL (`Yu-Zheng1999/CatVTON`) was incorrect — the actual project page is `Zheng-Chong/CatVTON-Page` (1,914 stars, ICLR 2025)
- No core code repository found in GitHub search (only the project page and third-party wrappers/adaptations)
- **Commercial use: Cannot be determined** — absence of a license means all rights are reserved by default; no license grant exists for commercial deployment
- Source: GitHub API license endpoint returned 404 (confirmed Nov 2026)

## Decision: No self-hosted try-on model for V1

**All three candidate models from the specification are unsuitable for commercial V1 deployment:**
1. Two have explicit NonCommercial (CC BY-NC-SA 4.0) licenses
2. One has no license at all

Using any of these models commercially would require obtaining a separate commercial license from the rights holder(s). This has not been pursued for V1.

## Recommended path forward

**Option A: Commercial virtual try-on API provider** (recommended for V1)
- Evaluate providers that offer virtual try-on as a service
- Must pass the Section 9.6 provider privacy review BEFORE sending any shopper images:
  - Input retention period
  - Output retention period
  - Whether data is used for training
  - Data processing region
  - Subprocessors
  - Deletion support
  - Zero-retention options and contractual terms
- Examples to research: providers offering API-based virtual try-on (to be researched in Phase 2)

**Option B: Permissive-license alternative** (e.g., Stable Diffusion inpainting / ControlNet)
- Base models (SD 1.5, SDXL) generally have permissive deployment licenses
- Need to verify specific fine-tune/ControlNet licenses
- Trade-off: weaker garment detail/print preservation vs. dedicated try-on models
- Higher risk of identity drift and product mismatch

**Option C: Obtain commercial license** (post-V1)
- Contact rights holders of IDM-VTON, CatVTON, or OOTDiffusion for commercial terms
- Record terms in this document before any shopper image is processed

## Mock mode for development

- `TRYON_PROVIDER=mock` and `MOCK_MODE=true` are set in `.env.example` for local development
- Mock providers are explicitly development-only and must never be used in production
- No hardcoded images are ever represented as real AI results (spec Section 20.4)

## Evaluation criteria (pending model selection)

When a model/provider is selected, verify:
- Repository and maintenance status
- Model and code license + commercial-use permissions
- Model-weight license
- GPU memory and compute requirements
- Input/output constraints, supported garment categories
- Inference latency (target: <60 s front view, spec Section 18)
- Data handling and external dependencies (privacy Section 9)

Record the final decision here before any shopper image is sent to a provider.