export default function handler(req, res) {
  res.status(200).json({
    status: "ok",
    service: "trialroom-demo",
    version: "0.1.0",
    env: "demo",
    mock_mode: true,
    tryon_provider: "mock",
    message: "Trial Room Demo API — Mock mode for founder demonstration",
  });
}