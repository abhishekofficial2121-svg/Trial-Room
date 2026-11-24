# Deploy Trial Room Demo to Vercel

This guide walks you through deploying the Phase 1 Trial Room demo app to
Vercel for a founder demonstration.

## Prerequisites

- A [Vercel account](https://vercel.com) (free tier is sufficient)
- The Trial Room repository pushed to GitHub (or connected via Vercel CLI)

## Option 1: Deploy via Vercel Dashboard (Recommended)

1. Push this repository to GitHub:

```bash
cd 'd:/Trial Room'
git remote add origin https://github.com/YOUR_USERNAME/trial-room.git
git branch -M master
git push -u origin master
```

2. Log in to [Vercel](https://vercel.com/dashboard).
3. Click **"Add New Project"**.
4. Import the `trial-room` repository.
5. Vercel auto-detects Next.js. Click **"Deploy"**.
6. Wait for the build to complete (typically 1–2 minutes).

## Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI:

```bash
npm i -g vercel
```

2. Log in:

```bash
vercel login
```

3. Deploy from the repository root:

```bash
cd 'd:/Trial Room'
vercel
```

4. Follow the prompts to configure the project.

## Environment Variables

No environment variables are required for the demo. The app runs entirely in
mock mode. If you want to connect to a real backend later, add these in the
Vercel dashboard under **Settings → Environment Variables**:

```
NEXT_PUBLIC_API_URL=https://your-api.vercel.app/api
NEXT_PUBLIC_MERCHANT_ID=merchant_demo
MOCK_MODE=false
```

## What the Demo Shows

| Step | What the Founder Sees |
|------|----------------------|
| Homepage | Product catalog with 3 demo garments |
| Product page | Garment details + "Try It On With Trial Room" CTA |
| Consent | Adult confirmation (18+ required) |
| Upload | File upload with validation (format, size) |
| Validating | Simulated validation with progress indicators |
| Generating | Simulated AI generation with stage indicators |
| Result | SVG demo visualization + product reference |
| Error states | Try again / return to store options |

## Important Notes for the Founder

- **This is a demo in mock mode.** No real AI model is running. The
  try-on result is an SVG placeholder.
- **No images are permanently stored.** Uploaded images exist only in
  browser memory during the session.
- **Session TTL:** 30 minutes (simulated).
- **All API routes are serverless functions** on Vercel — no separate
  backend needed for the demo.

## Demo Flow for Founder

1. Open the deployed Vercel URL
2. Browse the product catalog (3 T-shirts/shirts)
3. Click "View Product" on any garment
4. Click "Try It On With Trial Room"
5. Check the adult confirmation box
6. Upload any photograph (JPEG, PNG, WebP, max 10 MB)
7. Watch the validation → generation → result progression
8. See the demo try-on result
9. Try "Change Photograph" or "Try Another Product"
10. Close Trial Room to return to the store

## Troubleshooting

- **Build fails:** Ensure you're on the `master` branch and all files are committed.
- **API routes return 404:** Verify `vercel.json` is in the repository root.
- **Styling broken:** Tailwind CSS is configured via `tailwind.config.js` and `postcss.config.js`.

## Next Steps After Demo

To move beyond mock mode:
1. Select a commercial try-on API provider (see `docs/ai-model-evaluation.md`)
2. Complete the Section 9.6 provider privacy review
3. Replace mock API routes with real backend integration
4. Deploy the Python FastAPI backend separately (Render, Railway, or AWS)