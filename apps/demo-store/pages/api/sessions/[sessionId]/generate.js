export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only POST allowed" } });
  }

  const { sessionId } = req.query;
  const { idempotency_key } = req.body || {};

  if (!sessionId) {
    return res.status(400).json({ error: { code: "INVALID_SESSION", message: "Session ID is required" } });
  }

  const job_id = crypto.randomUUID();

  // Demo mode: return job immediately. In production, this queues a Celery background job.
  res.status(200).json({
    job_id,
    status: "queued",
    message: "Try-on job queued. Poll /api/jobs/{job_id} for status.",
    demo: true,
    idempotency_key,
    note: "Demo mode: job created instantly. Production uses Celery background worker for async inference.",
  });
}