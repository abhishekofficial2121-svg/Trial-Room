# Trial Room — Founder Demo Script

## Setup (5 minutes)

1. Deploy to Vercel using `DEPLOY_VERCEL.md`
2. Open the deployed URL
3. Have a test photograph ready (any JPEG/PNG/WebP of a person, max 10 MB)

## Demo Walkthrough (10 minutes)

### 1. Homepage (1 minute)

**Say:** "This is the Trial Room demo storefront. Shoppers browse the merchant's
product catalog just like any ecommerce site."

**Action:** Show the 3 demo garments (Black Oversized T-Shirt, White Button-Down
Shirt, Navy Striped T-Shirt).

### 2. Product Page (1 minute)

**Say:** "The shopper selects a garment. The merchant controls product data —
Trial Room just adds the try-on CTA."

**Action:** Click "View Product" on a garment. Show the product detail page.

### 3. Launch Trial Room (1 minute)

**Say:** "The shopper clicks 'Try It On With Trial Room.' The widget opens."

**Action:** Click "Try It On With Trial Room."

### 4. Adult Confirmation (1 minute)

**Say:** "Before any image is uploaded, we require adult confirmation. This is
a privacy and safety requirement — no minors in V1."

**Action:** Check the confirmation box, click "Upload Photograph."

### 5. Upload (1 minute)

**Say:** "The shopper uploads their photograph. We validate format (JPEG/PNG/
WebP), size (max 10 MB), and run quality checks."

**Action:** Upload a test photograph. Show the preview.

### 6. Validation (1 minute)

**Say:** "The backend validates the image — file signature, quality, person
detection, pose, body region visibility, and safety checks."

**Action:** Click "Continue." Show the validating state with progress indicators.

### 7. Generation (2 minutes)

**Say:** "A background job runs the virtual try-on pipeline. In production,
this uses a real AI model on a GPU worker. For this demo, it's simulated."

**Action:** Watch the generation progress: queued → processing → quality_checking → completed.

### 8. Result (2 minutes)

**Say:** "The shopper sees their try-on result — themselves wearing the
selected garment. This is a front view only in V1. We clearly label it as an
AI-generated visualization, not a guarantee of fit."

**Action:** Show the result image and product reference. Point out the disclaimer.

### 9. Recovery Options (1 minute)

**Say:** "The shopper can change their photograph or try another product."

**Action:** Click "Change Photograph" and repeat with a different image. Click
"Try Another Product" to select a different garment.

### 10. Privacy & Cleanup (1 minute)

**Say:** "All images are temporary. Session expires in 30 minutes. Assets are
automatically deleted. Nothing is stored permanently."

**Action:** Click "Close Trial Room" to return to the store.

## Key Messages for the Founder

- ✅ **Customer is the model** — no stock fashion models
- ✅ **Product fidelity** — the selected garment is preserved
- ✅ **Privacy foundational** — temporary processing, automatic deletion
- ✅ **Category-specific** — clothing validation for V1
- ✅ **Gender inclusive** — no gender selection required
- ✅ **Honest visualization** — clearly labeled as AI-generated approximation
- ✅ **Integration-first** — works as an embeddable widget/API

## What's NOT Real (Be Transparent)

- ❌ The AI try-on result is a demo SVG placeholder
- ❌ No real model is running (mock mode)
- ❌ No actual image processing happens
- ❌ All API responses are simulated

## Rollback Plan

If anything goes wrong during the demo:
- Refresh the page to restart the session
- Use "Try Another Product" to test different garments
- The demo is stateless — no data is lost on refresh