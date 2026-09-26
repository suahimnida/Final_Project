"""RAG 기반 판정 근거 생성.

TODO(5단계): codes/rag_app.py의 FAISS 검색 + Claude 호출 로직을 옮겨와 교체.
"""

from app.schemas import RagResult


def explain(url: str) -> RagResult:
    return RagResult()
