"""분석 결과를 SQLite에 저장/조회한다.

DB 파일 위치는 DB_PATH 환경변수로 바꿀 수 있다 (기본: backend/data/analyses.db).
"""

import os
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from app.schemas import AnalysisResponse, AnalysisSummary

_DEFAULT_PATH = Path(__file__).resolve().parents[1] / "data" / "analyses.db"


def _db_path() -> Path:
    return Path(os.environ.get("DB_PATH") or _DEFAULT_PATH)


def _connect() -> sqlite3.Connection:
    path = _db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(path)
    conn.row_factory = sqlite3.Row  # 조회 결과를 row["url"]처럼 열 이름으로 꺼낼 수 있게
    return conn


def init_db() -> None:
    """테이블이 없으면 만든다. 이미 있으면 아무 일도 하지 않는다."""
    conn = _connect()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS analyses (
                id          TEXT PRIMARY KEY,
                url         TEXT NOT NULL,
                created_at  TEXT NOT NULL,
                result_json TEXT NOT NULL
            )
            """
        )
        conn.commit()
    finally:
        conn.close()


def save_analysis(result: AnalysisResponse) -> None:
    conn = _connect()
    try:
        conn.execute(
            "INSERT INTO analyses (id, url, created_at, result_json) VALUES (?, ?, ?, ?)",
            (
                result.analysis_id,
                result.url,
                datetime.now(timezone.utc).isoformat(),
                result.model_dump_json(),
            ),
        )
        conn.commit()
    finally:
        conn.close()


def get_analysis(analysis_id: str) -> AnalysisResponse | None:
    conn = _connect()
    try:
        row = conn.execute(
            "SELECT result_json FROM analyses WHERE id = ?", (analysis_id,)
        ).fetchone()
    finally:
        conn.close()

    if row is None:
        return None
    return AnalysisResponse.model_validate_json(row["result_json"])


def list_analyses(limit: int) -> list[AnalysisSummary]:
    """최근 분석부터 limit개를 반환한다."""
    conn = _connect()
    try:
        rows = conn.execute(
            "SELECT id, url, created_at FROM analyses ORDER BY created_at DESC LIMIT ?",
            (limit,),
        ).fetchall()
    finally:
        conn.close()

    return [
        AnalysisSummary(analysis_id=row["id"], url=row["url"], created_at=row["created_at"])
        for row in rows
    ]
