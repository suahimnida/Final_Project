import pytest

from app.services import rag

FAKE_CASES = [
    {"url": "http://evil.tk/login", "label": 1, "description": "...", "similarity": 0.91},
    {"url": "https://naver.com", "label": 0, "description": "...", "similarity": 0.52},
]


@pytest.fixture
def fake_rag(monkeypatch):
    """벡터 스토어와 Claude 대신 가짜 함수를 끼워 넣는다."""
    monkeypatch.setattr(rag, "_state", {"extract_features": lambda url: {"url": url}})
    monkeypatch.setattr(rag, "_row_to_description", lambda feats: f"URL: {feats['url']}")
    monkeypatch.setattr(rag, "_retrieve", lambda description: FAKE_CASES)
    monkeypatch.setattr(
        rag,
        "_ask_claude",
        lambda description, cases: {"verdict": "phishing", "confidence": 0.9, "reason": "근거 요약"},
    )


def test_explain_without_rag_returns_empty():
    assert rag._state is None
    result = rag.explain("https://example.com")
    assert result.summary is None
    assert result.references == []


def test_explain_maps_rag_output(fake_rag):
    result = rag.explain("http://evil.tk/login")
    assert result.summary == "근거 요약"
    assert [r.url for r in result.references] == ["http://evil.tk/login", "https://naver.com"]
    assert result.references[0].label == 1
    assert result.references[0].similarity == pytest.approx(0.91)


def test_explain_returns_empty_when_claude_fails(fake_rag, monkeypatch):
    def fail(description, cases):
        raise RuntimeError("API 오류")

    monkeypatch.setattr(rag, "_ask_claude", fail)
    result = rag.explain("http://evil.tk/login")
    assert result.summary is None
    assert result.references == []


def test_load_rag_without_vector_store(tmp_path, monkeypatch):
    monkeypatch.setenv("RAG_INDEX_DIR", str(tmp_path))
    assert rag.load_rag() is False
    assert rag._state is None
