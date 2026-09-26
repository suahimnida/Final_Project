
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_create_analysis_returns_stub():
    res = client.post("/api/v1/analyses", json={"url": "https://example.com"})
    assert res.status_code == 200
    body = res.json()
    assert body["analysis_id"]
    assert body["status"] == "completed"
    assert body["url"] == "https://example.com"
    assert body["blacklist"] == {"matched": False, "match_type": "none", "source": "KISA 2024"}
    assert body["model"] == {"status": "not_connected", "risk_score": None, "label": None}
    assert body["rag"] == {"summary": None, "references": []}


def test_create_analysis_rejects_blank_url():
    res = client.post("/api/v1/analyses", json={"url": "   "})
    assert res.status_code == 422
