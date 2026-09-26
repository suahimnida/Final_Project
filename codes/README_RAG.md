# 피싱 URL 판별 RAG 웹 서비스

`preprocess.py`로 만든 특징 데이터를 벡터 스토어에 넣고,
새로운 URL이 들어오면 유사한 과거 사례를 검색해서(Retrieval)
그 사례를 근거로 Claude가 최종 판정을 내리는(Generation) 구조입니다.

## 파일 구성

- `preprocess.py` (기존 파일) — URL 특징 추출 / 데이터 정제
- `build_vector_store.py` (신규) — 특징 CSV → FAISS 벡터 스토어 생성
- `rag_app.py` (신규) — FastAPI 웹 서비스 (RAG 판정 API)
- `requirements.txt` (신규) — 필요 패키지 목록

**주의**: `rag_app.py`가 `preprocess.py`를 import하므로, 반드시 두 파일을 같은 폴더에 두세요.

## 실행 순서

### 1) 패키지 설치

```bash
pip install -r requirements.txt --break-system-packages
```

### 2) 특징 데이터 생성 (preprocess.py)

```bash
python preprocess.py --input PhiUSIIL_Phishing_URL_Dataset.csv --output features_output.csv --invert-label
```

> UCI PHIUSIIL 원본 데이터를 쓴다면 라벨 방향이 반대이므로 `--invert-label` 옵션을 꼭 확인하세요.

### 3) 벡터 스토어 구축

```bash
python build_vector_store.py --input features_output.csv --index-dir vector_store
```

첫 실행 시 `sentence-transformers` 임베딩 모델(약 90MB)을 자동으로 다운로드합니다.

### 4) Anthropic API 키 설정

```bash
# Windows (PowerShell)
$env:ANTHROPIC_API_KEY="sk-ant-..."

# macOS / Linux
export ANTHROPIC_API_KEY="sk-ant-..."
```

### 5) 웹 서비스 실행

```bash
uvicorn rag_app:app --reload
```

### 6) 테스트

```bash
curl -X POST http://localhost:8000/check \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"http://paypal-verify-account.tk/login\"}"
```

응답 예시:

```json
{
  "url": "http://paypal-verify-account.tk/login",
  "verdict": "phishing",
  "confidence": 0.92,
  "reason": "검색된 유사 사례 대부분이 피싱으로 라벨링되어 있고, 브랜드명(paypal)과 의심 키워드(verify, login)가 도메인/경로에 포함되어 있어 피싱 가능성이 높습니다.",
  "extracted_features": { ... },
  "similar_cases": [
    {"url": "...", "label": 1, "similarity": 0.87},
    ...
  ]
}
```

## 동작 원리 요약

1. **특징 추출**: 입력 URL을 `preprocess.py`의 `extract_features()`로 분석 (엔트로피, 의심 키워드, IP 도메인 여부 등)
2. **설명 텍스트 변환**: 특징 딕셔너리를 사람이 읽을 수 있는 문장으로 변환
3. **검색(Retrieval)**: 이 문장을 임베딩해 FAISS 인덱스에서 코사인 유사도가 높은 과거 URL(피싱/정상 라벨 포함) 상위 K개를 검색
4. **생성(Generation)**: 검색된 사례들을 근거로 Claude에게 "이 URL이 피싱인지 정상인지, 왜 그런지"를 JSON 형식으로 요청
5. 판정 결과 + 근거 + 검색된 유사 사례를 함께 JSON으로 반환 → 웹 프론트엔드에서 그대로 표시 가능

## 커스터마이징 팁

- **검색 개수(K) 조정**: 환경변수 `RAG_TOP_K` (기본값 5)
- **인덱스 폴더 위치**: 환경변수 `RAG_INDEX_DIR` (기본값 `vector_store`)
- **더 빠른 응답이 필요하면**: `ask_claude_for_verdict()` 호출을 생략하고, 검색된 유사 사례의 라벨 다수결(majority vote)만으로 1차 판정 후, 애매한 경우에만 Claude를 호출하는 방식으로 바꿀 수 있습니다.
- **데이터가 업데이트될 때**: `build_vector_store.py`를 다시 실행해 인덱스를 재생성하면 됩니다 (서비스는 재시작 필요).
