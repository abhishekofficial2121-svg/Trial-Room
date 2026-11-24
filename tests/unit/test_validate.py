"""Unit tests for validation endpoint stub."""

from fastapi.testclient import TestClient
from apps.api.main import app


def test_validate_no_image():
    client = TestClient(app)
    response = client.post("/api/v1/sessions/session_123/validate")
    assert response.status_code == 200
    data = response.json()
    assert data["valid"] is False
    assert data["category"] == "clothing"
    assert data["workflow"] == "full_body_clothing"
    assert len(data["errors"]) > 0
    assert data["errors"][0] == "IMAGE_NOT_UPLOADED"