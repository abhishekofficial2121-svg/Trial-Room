export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only GET allowed" } });
  }

  const { jobId } = req.query;

  if (!jobId) {
    return res.status(400).json({ error: { code: "INVALID_JOB", message: "Job ID is required" } });
  }

  // Demo result: SVG placeholder that clearly indicates this is a demo visualization
  const svg = `
<svg width="600" height="900" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#f3f4f6"/>
  <!-- Person silhouette -->
  <ellipse cx="300" cy="120" rx="50" ry="60" fill="#d1d5db"/>
  <rect x="240" y="160" width="120" height="200" fill="#d1d5db" rx="20"/>
  <rect x="240" y="360" width="60" height="200" fill="#d1d5db"/>
  <rect x="300" y="360" width="60" height="200" fill="#d1d5db"/>
  <!-- Garment (the try-on result) -->
  <rect x="250" y="180" width="100" height="160" fill="#1f2937" rx="10"/>
  <text x="300" y="260" font-family="Arial" font-size="14" fill="#ffffff" text-anchor="middle">DEMO</text>
  <text x="300" y="280" font-family="Arial" font-size="12" fill="#9ca3af" text-anchor="middle">TRY-ON RESULT</text>
  <!-- Disclaimer -->
  <text x="300" y="820" font-family="Arial" font-size="11" fill="#6b7280" text-anchor="middle">AI-generated visualization — demo mode</text>
  <text x="300" y="840" font-family="Arial" font-size="11" fill="#6b7280" text-anchor="middle">Not a guarantee of fit or sizing</text>
</svg>
  `;

  res.setHeader("Content-Type", "image/svg+xml");
  res.setHeader("Cache-Control", "no-store");
  res.status(200).send(svg.trim());
}