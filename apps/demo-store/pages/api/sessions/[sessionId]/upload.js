export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only POST allowed" } });
  }

  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: { code: "INVALID_SESSION", message: "Session ID is required" } });
  }

  res.status(200).json({
    session_id: sessionId,
    upload_url: `/api/sessions/${sessionId}/upload/signed`,
    method: "PUT",
    expires_in_seconds: 900, // 15 minutes
    max_file_size_mb: 10,
    accepted_formats: ["image/jpeg", "image/png", "image/webp"],
    message: "Upload authorization ready. Select a photograph (JPEG, PNG, or WebP, max 10 MB).",
    demo: true,
  });
}