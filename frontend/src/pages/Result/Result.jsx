import { useEffect } from "react";
import "./Result.css";

const mockResult = {
  url: "https://example.com",
  status: "partial",

  risk_score: 87,
  risk_level: "high",

  completed_steps: [
    "url",
    "url_stats",
    "domain",
    "html",
  ],

  detections: {
    url_length: "suspicious",
    character_pattern: "suspicious",
    entropy: "normal",
    ngram: "suspicious",
    html: "suspicious",
    image: "not_analyzed",
  },

  web_analysis: {
    title: "의심스러운 로그인 페이지",
    text: "페이지 콘텐츠에서 의심스러운 요소가 확인되었습니다.",
    image: "normal",
  },

  ai_analysis: {
    summary:
      "URL 구조와 HTML 분석에서 여러 의심스러운 특성이 발견되었습니다.",
    reasons: [
      "URL 길이가 비정상적으로 깁니다.",
      "의심스러운 문자 패턴이 발견되었습니다.",
      "HTML 구조에서 의심스러운 요소가 발견되었습니다.",
    ],
  },

  rag: {
    matched: true,
    source: "KISA 피싱사이트 데이터",
    evidence:
      "해당 URL과 유사한 피싱 사례가 확인되었습니다.",
  },
};

const detectionLabels = {
  url_length: {
    title: "URL 길이",
    description: "URL 길이가 일반적인 범위를 벗어나는지 확인",
  },
  character_pattern: {
    title: "문자 패턴",
    description: "의심스러운 문자 조합 및 특수문자 패턴 분석",
  },
  entropy: {
    title: "엔트로피",
    description: "URL 문자열의 무작위성 분석",
  },
  ngram: {
    title: "n-gram",
    description: "의심스러운 문자열 조합 빈도 분석",
  },
  html: {
    title: "HTML 구조",
    description: "DOM 구조 및 의심스러운 요소 분석",
  },
  image: {
    title: "페이지 이미지",
    description: "페이지 이미지의 피싱 관련 시각적 특징 분석",
  },
};

const detectionStatusLabels = {
  suspicious: "의심됨",
  normal: "정상",
  not_analyzed: "분석되지 않음",
};

function Result({ url, result }) {
  const data = result || {
    ...mockResult,
    url: url || mockResult.url,
  };

  useEffect(() => {
  const historyItem = {
    id: Date.now(),
    url: data.url,
    analyzedAt: new Date().toISOString(),
    result: data,
  };

  const savedHistory = localStorage.getItem(
    "phishingAnalysisHistory"
  );

  let history = [];

  if (savedHistory) {
    try {
      history = JSON.parse(savedHistory);
    } catch (error) {
      console.error("분석 기록을 불러오지 못했습니다:", error);
    }
  }

  // 같은 URL을 바로 다시 저장하는 것을 방지
  const alreadyExists = history.some(
    (item) =>
      item.url === historyItem.url &&
      item.result?.risk_score === historyItem.result?.risk_score
  );

  if (!alreadyExists) {
    const updatedHistory = [historyItem, ...history];

    localStorage.setItem(
      "phishingAnalysisHistory",
      JSON.stringify(updatedHistory)
    );
  }
}, [data.url, data.risk_score]);

  const riskLevelText = {
    high: "높은 위험도",
    medium: "주의 필요",
    low: "낮은 위험도",
  };

  const completedCount = data.completed_steps?.length || 0;

  return (
    <section className="result-page">
      {/* Header */}
      <div className="result-header">
        <p className="eyebrow">보안 분석 결과</p>

        <h2>분석 결과</h2>

        <p className="result-description">
          입력한 웹사이트의 보안 분석 결과입니다.
        </p>
      </div>

      {/* Target */}
      <div className="result-target">
        <div>
          <p className="result-target-label">
            분석 대상 URL
          </p>

          <p className="result-target-url">{data.url}</p>
        </div>

        <span className="result-completed">
          {data.status === "partial"
            ? `부분 분석 · ${completedCount}개 완료`
            : "분석 완료"}
        </span>
      </div>

      {/* Risk */}
      <div className="risk-card">
        <div className="risk-score">
          <div>
            <span className="score-number">
              {data.risk_score}
            </span>

            <span className="score-total"> / 100</span>
          </div>
        </div>

        <div className="risk-info">
          <p className="risk-label">
            {riskLevelText[data.risk_level] || "분석 결과"}
          </p>

          <h3>
            {data.risk_level === "high"
              ? "피싱 사이트일 가능성이 있습니다."
              : data.risk_level === "medium"
              ? "일부 위험 요소가 확인되었습니다."
              : "현재까지 확인된 위험 요소가 적습니다."}
          </h3>

          <p>
            AI Agent가 URL 및 웹페이지 분석 결과를
            종합하여 위험도를 판단합니다.
          </p>
        </div>
      </div>

      {/* Detection */}
      <div className="result-section">
        <div className="section-heading">
          <div>
            <p>탐지 결과</p>
          </div>

          <span>
            {completedCount} / {Object.keys(data.detections).length} 분석 완료
          </span>
        </div>

        <div className="detection-list">
          {Object.entries(data.detections).map(
            ([key, status]) => {
              const info = detectionLabels[key];

              return (
                <div
                  className={`detection-row ${
                    status === "suspicious"
                      ? "suspicious"
                      : status === "normal"
                      ? "normal"
                      : ""
                  }`}
                  key={key}
                >
                  <div>
                    <h4>{info?.title || key}</h4>

                    <p>
                      {info?.description ||
                        "분석 결과"}
                    </p>
                  </div>

                  <span>
                    {detectionStatusLabels[status] ||
                      status}
                  </span>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Web Analysis */}
      <div className="result-section">
        <div className="section-heading">
          <div>
            <p>웹페이지 분석</p>
          </div>

          <span>멀티모달 분석</span>
        </div>

        <div className="web-analysis">
          {/* Preview */}
          <div className="page-preview">
            <div className="preview-bar">
              <span></span>
              <span></span>
              <span></span>
            </div>

            <div className="preview-content">
              <div className="preview-logo"></div>

              <div className="preview-line large"></div>
              <div className="preview-line"></div>

              <div className="preview-input"></div>

              <div className="preview-button"></div>
            </div>
          </div>

          {/* Findings */}
          <div className="web-findings">
            <div className="finding">
              <div className="finding-icon danger">
                !
              </div>

              <div>
                <h4>의심스러운 페이지 구조</h4>

                <p>
                  {data.web_analysis?.text ||
                    "페이지 구조 분석 결과가 없습니다."}
                </p>
              </div>
            </div>

            <div className="finding">
              <div className="finding-icon normal">
                ✓
              </div>

              <div>
                <h4>페이지 이미지 분석</h4>

                <p>
                  {data.web_analysis?.image
                    ? "이미지 분석이 완료되었습니다."
                    : "이미지 분석이 아직 완료되지 않았습니다."}
                </p>
              </div>
            </div>

            <div className="finding">
              <div className="finding-icon normal">
                ✓
              </div>

              <div>
                <h4>페이지 제목</h4>

                <p>
                  {data.web_analysis?.title ||
                    "페이지 제목을 확인할 수 없습니다."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="result-section">
        <div className="section-heading">
          <div>
            <p>AI 분석</p>
          </div>

          <span>AI Agent</span>
        </div>

        <div className="ai-analysis-card">
          <div className="ai-badge">AI</div>

          <div>
            <h3>분석 결과 설명</h3>

            <p className="ai-summary">
              {data.ai_analysis?.summary ||
                "AI 분석이 아직 완료되지 않았습니다."}
            </p>

            {data.ai_analysis?.reasons?.length > 0 && (
              <div className="ai-reasons">
                {data.ai_analysis.reasons.map(
                  (reason, index) => (
                    <div key={index}>
                      <span>✓</span>
                      <p>{reason}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Assistant */}
      <div className="result-section">
        <div className="section-heading">
          <div>
            <p>보안 도우미</p>
          </div>

          <span>RAG</span>
        </div>

        <div className="assistant-card">
          <div className="assistant-header">
            <div className="assistant-icon">AI</div>

            <div>
              <h3>보안 분석 도우미</h3>

              <p>
                분석 결과와 관련된 보안 정보를
                확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="suggested-questions">
            <button>
              왜 위험하다고 판단했나요?
            </button>

            <button>
              이 사이트는 피싱 데이터에 있나요?
            </button>

            <button>
              어떻게 대응해야 하나요?
            </button>
          </div>

          <div className="assistant-input">
            <input
              type="text"
              placeholder="보안 분석에 대해 질문해보세요."
            />

            <button>→</button>
          </div>
        </div>
      </div>

      {/* Report */}
      <div className="report-card">
        <div>
          <p className="report-label">
            자동 리포트
          </p>

          <h3>AI 분석 리포트 생성</h3>

          <p>
            현재 분석 결과를 바탕으로 보안 분석
            리포트를 생성합니다.
          </p>
        </div>

        <button className="report-button">
          리포트 생성
          <span>→</span>
        </button>
      </div>
    </section>
  );
}

export default Result;