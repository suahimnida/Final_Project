"""피싱 URL 분석 API 서버.

실행 (backend/ 폴더에서):
    uvicorn app.main:app --reload
"""

import os
import uuid
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

# backend/.env의 값을 환경변수로 읽어온다 (이미 설정된 환경변수가 우선)
load_dotenv(Path(__file__).resolve().parents[1] / ".env")

from app import db  # noqa: E402
from app.schemas import (
    AiAnalysis,
    AnalysisListResponse,
    AnalysisRequest,
    AnalysisResponse,
    HealthResponse,
)
from app.services import blacklist, model, rag


@asynccontextmanager
async def lifespan(app: FastAPI):
    # 첫 요청이 느려지지 않도록 서버 시작 시 블랙리스트를 미리 로드
    blacklist.load_blacklist()
    db.init_db()
    rag.load_rag()
    yield


app = FastAPI(title="피싱 URL 분석 API", version="0.1.0", lifespan=lifespan)

# 프론트 개발 서버(Vite)에서 오는 요청을 허용. 쉼표로 여러 주소 지정 가능
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="ok")


@app.post("/api/v1/analyses", response_model=AnalysisResponse)
def create_analysis(request: AnalysisRequest):
    rag_result = rag.explain(request.url)
    result = AnalysisResponse(
        id=str(uuid.uuid4()),
        status="completed",
        url=request.url,
        ai_analysis=AiAnalysis(summary=rag_result.summary),
        extracted_features=rag_result.features,
        similar_cases=rag_result.similar_cases,
        blacklist=blacklist.check_blacklist(request.url),
        model=model.predict(request.url),
    )
    db.save_analysis(result)
    return result


@app.get("/api/v1/analyses", response_model=AnalysisListResponse)
def list_analyses(limit: int = Query(20, ge=1, le=100)):
    return AnalysisListResponse(items=db.list_analyses(limit))


@app.get("/api/v1/analyses/{analysis_id}", response_model=AnalysisResponse)
def read_analysis(analysis_id: str):
    result = db.get_analysis(analysis_id)
    if result is None:
        raise HTTPException(status_code=404, detail="분석 결과를 찾을 수 없습니다.")
    return result
