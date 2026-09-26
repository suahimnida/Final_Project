
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


def test_read_analysis_returns_saved_result():
    created = client.post("/api/v1/analyses", json={"url": "https://example.com"}).json()

    res = client.get(f"/api/v1/analyses/{created['analysis_id']}")
    assert res.status_code == 200
    assert res.json() == created


def test_read_analysis_unknown_id_returns_404():
    res = client.get("/api/v1/analyses/does-not-exist")
    assert res.status_code == 404


def test_list_analyses_newest_first():
    for url in ["https://a.com", "https://b.com", "https://c.com"]:
        client.post("/api/v1/analyses", json={"url": url})

    res = client.get("/api/v1/analyses")
    assert res.status_code == 200
    items = res.json()["items"]
    assert [item["url"] for item in items] == ["https://c.com", "https://b.com", "https://a.com"]
    assert set(items[0]) == {"analysis_id", "url", "created_at"}


def test_list_analyses_respects_limit():
    for url in ["https://a.com", "https://b.com", "https://c.com"]:
        client.post("/api/v1/analyses", json={"url": url})

    res = client.get("/api/v1/analyses", params={"limit": 2})
    assert [item["url"] for item in res.json()["items"]] == ["https://c.com", "https://b.com"]


def test_list_analyses_empty():
    res = client.get("/api/v1/analyses")
    assert res.json() == {"items": []}


def test_list_analyses_rejects_invalid_limit():
    assert client.get("/api/v1/analyses", params={"limit": 0}).status_code == 422
    assert client.get("/api/v1/analyses", params={"limit": 101}).status_code == 422
