"""Unit tests for session creation endpoint."""

from fastapi.testclient import TestClient
from apps.api.main import app


def test_create_session():
    client = TestClient(app)
    response = client.post(
        "/api/v1/sessions",
        json={
            "merchant_id": "merchant_demo",
            "product_id": "product_001",
            "variant_id": "variant_black_m",
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert "session_id" in data
    assert data["status"] == "active"
    assert "expires_at" in data
    assert "upload_url" in data
    assert data["upload_url"].endswith(f"/sessions/{data['session_id']}/upload")