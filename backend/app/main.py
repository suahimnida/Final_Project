"""피싱 URL 분석 API 서버.

실행 (backend/ 폴더에서):
    uvicorn app.main:app --reload
"""

import uuid
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.schemas import AnalysisRequest, AnalysisResponse, HealthResponse
from app.services import blacklist, model, rag


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 첫 요청이 느려지지 않도록 서버 시작 시 블랙리스트를 미리 로드
    blacklist.load_blacklist()
    yield


app = FastAPI(title="피싱 URL 분석 API", version="0.1.0", lifespan=lifespan)


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok")


@app.post("/api/v1/analyses", response_model=AnalysisResponse)
def create_analysis(request: AnalysisRequest):
    return AnalysisResponse(
        analysis_id=str(uuid.uuid4()),
        status="completed",
        url=request.url,
        blacklist=blacklist.check_blacklist(request.url),
        model=model.predict(request.url),
        rag=rag.explain(request.url),
    )
