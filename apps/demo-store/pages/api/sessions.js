export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only POST allowed" } });
  }

  const { merchant_id, product_id, variant_id } = req.body || {};

  if (!merchant_id || !product_id) {
    return res.status(400).json({
      error: { code: "MISSING_FIELDS", message: "merchant_id and product_id are required" },
    });
  }

  const session_id = crypto.randomUUID();
  const expires_at = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 min TTL

  res.status(200).json({
    session_id,
    status: "active",
    expires_at,
    upload_url: `/api/sessions/${session_id}/upload`,
    message: "Session created. Upload a photograph to begin virtual try-on.",
    demo: true,
  });
}