
from fastapi.testclient import TestClient

from app.main import app
from app.services import rag

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


def test_create_analysis_returns_stub():
    res = client.post("/api/v1/analyses", json={"url": "https://example.com"})
    assert res.status_code == 200
    body = res.json()
    assert body["id"]
    assert body["status"] == "completed"
    assert body["url"] == "https://example.com"
    for key in ["verdict", "confidence", "risk_score", "risk_level"]:
        assert body[key] is None
    assert body["detections"] == {
        "url": None, "url_stats": None, "domain": None, "html": None, "image": None
    }
    assert body["ai_analysis"] == {"summary": None, "reasons": []}
    assert body["extracted_features"] == {}
    assert body["similar_cases"] == []
    assert body["blacklist"] == {"matched": False, "match_type": "none", "source": "KISA 2024"}
    assert body["model"] == {"status": "not_connected", "risk_score": None, "label": None}


def test_create_analysis_fills_rag_fields(monkeypatch):
    fake = rag.RagResult(
        verdict="phishing",
        confidence=0.9,
        summary="근거 요약",
        features={"url_length": 20},
        similar_cases=[{"url": "http://evil.tk", "label": 1, "similarity": 0.91}],
    )
    monkeypatch.setattr(rag, "explain", lambda url: fake)

    body = client.post("/api/v1/analyses", json={"url": "http://evil.tk/x"}).json()
    assert body["ai_analysis"] == {"summary": "근거 요약", "reasons": []}
    assert body["extracted_features"] == {"url_length": 20}
    assert body["similar_cases"] == [{"url": "http://evil.tk", "label": 1, "similarity": 0.91}]


def test_create_analysis_rejects_blank_url():
    res = client.post("/api/v1/analyses", json={"url": "   "})
    assert res.status_code == 422


def test_read_analysis_returns_saved_result():
    created = client.post("/api/v1/analyses", json={"url": "https://example.com"}).json()

    res = client.get(f"/api/v1/analyses/{created['id']}")
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
    assert set(items[0]) == {"id", "url", "created_at"}


def test_list_analyses_respects_limit():
    for url in ["https://a.com", "https://b.com", "https://c.com"]:
        client.post("/api/v1/analyses", json={"url": url})

    res = client.get("/api/v1/analyses", params={"limit": 2})
    assert [item["url"] for item in res.json()["items"]] == ["https://c.com", "https://b.com"]


def test_list_analyses_empty():
    res = client.get("/api/v1/analyses")
    assert res.json() == {"items": []}


def test_cors_allows_vite_dev_server():
    res = client.options(
        "/api/v1/analyses",
        headers={"Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST"},
    )
    assert res.status_code == 200
    assert res.headers["access-control-allow-origin"] == "http://localhost:5173"


def test_cors_rejects_unknown_origin():
    res = client.get("/health", headers={"Origin": "http://evil.com"})
    assert "access-control-allow-origin" not in res.headers


def test_list_analyses_rejects_invalid_limit():
    assert client.get("/api/v1/analyses", params={"limit": 0}).status_code == 422
    assert client.get("/api/v1/analyses", params={"limit": 101}).status_code == 422
