import "./Result.css";

function Result({ url }) {
  return (
    <section className="result-page">
      <div className="result-header">
        <p className="eyebrow">보안 분석 결과</p>

        <h2>분석 결과</h2>

        <p className="result-description">
          다양한 보안 신호와 AI 분석 결과를 종합하여
          해당 웹사이트의 위험도를 판단했습니다.
        </p>
      </div>

      {/* 분석 대상 */}
      <div className="result-target">
        <div>
          <p className="result-target-label">분석 대상 URL</p>
          <p className="result-target-url">
            {url}
          </p>
        </div>

        <span className="result-completed">분석 완료</span>
      </div>

      {/* 위험도 */}
      <div className="risk-card">
        <div className="risk-score">
          <span className="score-number">87</span>
          <span className="score-total">/ 100</span>
        </div>

        <div className="risk-info">
          <span className="risk-label">높은 위험도</span>

          <h3>피싱 사이트일 가능성이 있습니다</h3>

          <p>
            URL, 도메인 및 웹페이지 구조에서 여러 의심스러운
            특성이 발견되었습니다.
          </p>
        </div>
      </div>

      {/* 탐지 결과 */}
      <div className="result-section">
        <div className="section-heading">
          <p>탐지 결과</p>
          <span>6개 항목 분석</span>
        </div>

        <div className="detection-list">
          <div className="detection-row suspicious">
            <div>
              <h4>URL 길이</h4>
              <p>비정상적으로 긴 URL 구조가 감지되었습니다.</p>
            </div>
            <span>의심됨</span>
          </div>

          <div className="detection-row suspicious">
            <div>
              <h4>문자 패턴</h4>
              <p>의심스러운 문자 조합이 감지되었습니다.</p>
            </div>
            <span>의심됨</span>
          </div>

          <div className="detection-row normal">
            <div>
              <h4>엔트로피</h4>
              <p>문자 분포가 일반적인 범위에 있습니다.</p>
            </div>
            <span>정상</span>
          </div>

          <div className="detection-row suspicious">
            <div>
              <h4>n-gram</h4>
              <p>위험 가능성이 높은 문자열 패턴이 감지되었습니다.</p>
            </div>
            <span>의심됨</span>
          </div>

          <div className="detection-row suspicious">
            <div>
              <h4>HTML 구조</h4>
              <p>의심스러운 폼 및 DOM 요소가 감지되었습니다.</p>
            </div>
            <span>의심됨</span>
          </div>

          <div className="detection-row normal">
            <div>
              <h4>페이지 이미지</h4>
              <p>뚜렷한 시각적 피싱 요소가 감지되지 않았습니다.</p>
            </div>
            <span>정상</span>
          </div>
        </div>
      </div>

      {/* 웹페이지 분석 */}
      <div className="result-section">
        <div className="section-heading">
          <p>웹페이지 분석</p>
          <span>멀티모달 분석</span>
        </div>

        <div className="web-analysis">
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
              <div className="preview-input"></div>
              <div className="preview-button"></div>
            </div>
          </div>

          <div className="web-findings">
            <div className="finding">
              <span className="finding-icon danger">!</span>

              <div>
                <h4>의심스러운 로그인 폼</h4>
                <p>
                  분석된 페이지에서 계정 정보를 입력받는
                  로그인 폼이 발견되었습니다.
                </p>
              </div>
            </div>

            <div className="finding">
              <span className="finding-icon danger">!</span>

              <div>
                <h4>비정상적인 페이지 구조</h4>
                <p>
                  사용자 정보 수집과 관련된 것으로 판단되는
                  DOM 구조가 발견되었습니다.
                </p>
              </div>
            </div>

            <div className="finding">
              <span className="finding-icon normal">✓</span>

              <div>
                <h4>시각적 분석</h4>
                <p>
                  뚜렷한 시각적 피싱 패턴은 발견되지 않았습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI 분석 */}
      <div className="result-section">
        <div className="section-heading">
          <p>AI 분석</p>
          <span>AI AGENT</span>
        </div>

        <div className="ai-analysis-card">
          <div className="ai-badge">AI</div>

          <div>
            <h3>이 웹사이트가 의심스러운 이유</h3>

            <p className="ai-summary">
              분석 Agent는 피싱 가능성을 높이는 여러 특징을
              확인했습니다. URL에서 의심스러운 패턴이 발견되었으며,
              웹페이지에는 사용자 정보를 수집할 가능성이 있는
              로그인 폼과 비정상적인 HTML 구조가 존재합니다.
            </p>

            <div className="ai-reasons">
              <div>
                <span>01</span>
                <p>의심스러운 URL 문자 패턴</p>
              </div>

              <div>
                <span>02</span>
                <p>위험 가능성이 높은 n-gram 패턴</p>
              </div>

              <div>
                <span>03</span>
                <p>의심스러운 HTML 구조 및 로그인 폼</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 보안 도우미 */}
      <div className="result-section">
        <div className="section-heading">
          <p>보안 도우미</p>
          <span>RAG</span>
        </div>

        <div className="assistant-card">
          <div className="assistant-header">
            <div className="assistant-icon">✦</div>

            <div>
              <h3>분석 결과에 대해 질문해보세요</h3>
              <p>
                탐지 결과와 보안 대응 방법에 대해 질문할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="suggested-questions">
            <button>이 URL은 피싱 데이터에 등록되어 있나요?</button>
            <button>어떤 부분 때문에 의심스러운가요?</button>
            <button>이 사이트에 접속했다면 어떻게 해야 하나요?</button>
          </div>

          <div className="assistant-input">
            <input placeholder="보안 관련 질문을 입력하세요..." />
            <button>→</button>
          </div>
        </div>
      </div>

      {/* 리포트 */}
      <div className="report-card">
        <div>
          <p className="report-label">분석 리포트</p>

          <h3>AI 분석 리포트 생성</h3>

          <p>
            분석 결과와 근거, 권장 대응 방법을 포함한
            상세 리포트를 생성합니다.
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