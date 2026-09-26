"""API 요청/응답 스키마. 프론트와 공유하는 계약이므로 필드 변경 시 프론트에 공지할 것."""

from typing import Literal

from pydantic import BaseModel, Field, field_validator


class AnalysisRequest(BaseModel):
    url: str = Field(..., examples=["https://example.com"])

    @field_validator("url")
    @classmethod
    def url_not_blank(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("url이 비어 있습니다.")
        return v


class BlacklistResult(BaseModel):
    matched: bool
    match_type: Literal["none", "exact", "host"]
    source: str


class ModelResult(BaseModel):
    status: Literal["not_connected", "completed", "failed"]
    risk_score: float | None = None
    label: str | None = None


class RagReference(BaseModel):
    url: str
    label: int
    similarity: float


class RagResult(BaseModel):
    summary: str | None = None
    references: list[RagReference] = []


class AnalysisResponse(BaseModel):
    analysis_id: str
    status: Literal["completed", "failed"]
    url: str
    blacklist: BlacklistResult
    model: ModelResult
    rag: RagResult


class HealthResponse(BaseModel):
    status: str
