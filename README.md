# Phishing Site Analyzer — Frontend

AI 기반 피싱 사이트 분석 서비스의 프론트엔드입니다.

사용자가 URL을 입력하면 분석 과정을 보여주고, 분석 결과와 분석 기록을 확인할 수 있는 웹 인터페이스를 제공합니다.

---

## 1. 프로젝트 개요

### 서비스 목적

사용자가 입력한 URL을 대상으로 URL 구조, 도메인, 웹페이지 콘텐츠 등의 보안 정보를 분석하고, AI Agent가 분석 결과를 종합하여 피싱 가능성과 위험 근거를 제공하는 웹 보안 분석 서비스입니다.

### 프론트엔드 역할

* URL 입력 및 분석 요청
* 분석 공개/비공개 설정
* URL 분석 진행 화면
* 분석 결과 화면
* 분석 기록 조회
* 프로젝트 분석 방법 및 데이터셋/ML 모델 정보 제공
* 백엔드 API와의 데이터 연동

> AI Agent, ML 모델, RAG, 데이터 처리 등의 실제 분석 로직은 백엔드에서 담당합니다.

---

# 2. 기술 스택

* React
* Vite
* JavaScript
* CSS
* REST API

---

# 3. 현재 프론트엔드 구조

```text
frontend/
├── src/
│   ├── components/
│   ├── pages/
│   │   ├── Home/
│   │   ├── Analysis/
│   │   ├── Result/
│   │   ├── History/
│   │   ├── DetectionMethods/
│   │   ├
```
