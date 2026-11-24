export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { code: "METHOD_NOT_ALLOWED", message: "Only POST allowed" } });
  }

  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: { code: "INVALID_SESSION", message: "Session ID is required" } });
  }

  // Demo mode: validation always passes for the founder demonstration
  // In production, this would run file signature, quality, person detection, pose, and safety checks
  res.status(200).json({
    valid: true,
    category: "clothing",
    workflow: "full_body_clothing",
    checks: {
      file_valid: true,
      image_quality: true,
      person_detected: true,
      single_person: true,
      required_body_regions_visible: true,
      face_required: false,
      safety_passed: true,
    },
    errors: [],
    message: "Your image is ready for virtual try-on.",
    demo: true,
    note: "Demo mode: validation simulated. Production runs real file signature, quality, person detection, pose, and safety checks.",
  });
}