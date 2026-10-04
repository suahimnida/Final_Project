import { useEffect, useState } from "react";
import "./History.css";

const API_BASE_URL = "http://localhost:8000";
const CLIENT_ID_KEY = "phishingClientId";

function History({ onViewResult }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const clientId =
        localStorage.getItem(CLIENT_ID_KEY);

      if (!clientId) {
        setError("클라이언트 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/analyses?scope=mine`,
          {
            headers: {
              "X-Client-Id": clientId,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `분석 기록 조회 실패: ${response.status}`
          );
        }

        const data = await response.json();

        // 백엔드 응답: { items: [...] }
        setHistory(
          Array.isArray(data.items)
            ? data.items
            : []
        );
      } catch (error) {
        console.error(
          "분석 기록을 불러오지 못했습니다:",
          error
        );

        setError(
          "분석 기록을 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }

    return new Date(dateString).toLocaleString(
      "ko-KR",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getRiskStatus = (verdict) => {
    if (verdict === "phishing") {
      return {
        label: "피싱 의심",
        className: "danger",
      };
    }

    if (verdict === "suspicious") {
      return {
        label: "주의 필요",
        className: "warning",
      };
    }

    return {
      label: "정상",
      className: "normal",
    };
  };

  const handleViewResult = async (analysisId) => {
    const clientId =
      localStorage.getItem(CLIENT_ID_KEY);

    if (!clientId) {
      setError("클라이언트 ID가 없습니다.");
      return;
    }

    try {
      setSelectedId(analysisId);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/api/v1/analyses/${analysisId}`,
        {
          headers: {
            "X-Client-Id": clientId,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            "분석 결과를 찾을 수 없습니다."
          );
        }

        throw new Error(
          `분석 결과 조회 실패: ${response.status}`
        );
      }

      const result = await response.json();

      // 상세 분석 결과를 App으로 전달
      onViewResult(result);
    } catch (error) {
      console.error(
        "분석 결과를 불러오지 못했습니다:",
        error
      );

      setError(
        error.message ||
          "분석 결과를 불러오지 못했습니다."
      );
    } finally {
      setSelectedId(null);
    }
  };

  if (loading) {
    return (
      <section className="history-page">
        <div className="history-header">
          <div>
            <p className="history-eyebrow">
              ANALYSIS HISTORY
            </p>

            <h2>분석 기록</h2>

            <p className="history-description">
              이전에 분석한 웹사이트의 결과를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="history-empty">
          <h3>분석 기록을 불러오는 중입니다.</h3>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="history-page">
        <div className="history-header">
          <div>
            <p className="history-eyebrow">
              ANALYSIS HISTORY
            </p>

            <h2>분석 기록</h2>

            <p className="history-description">
              이전에 분석한 웹사이트의 결과를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="history-empty">
          <h3>{error}</h3>

          <p>
            백엔드 서버가 실행 중인지 확인해주세요.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="history-page">
      <div className="history-header">
        <div>
          <p className="history-eyebrow">
            ANALYSIS HISTORY
          </p>

          <h2>분석 기록</h2>

          <p className="history-description">
            이전에 분석한 웹사이트의 결과를 확인할 수 있습니다.
          </p>
        </div>

        <div className="history-count">
          <span>{history.length}</span>
          <small>건</small>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="history-empty">
          <div className="history-empty-icon">
            ◷
          </div>

          <h3>분석 기록이 없습니다.</h3>

          <p>
            웹사이트를 분석하면
            <br />
            이곳에 분석 기록이 저장됩니다.
          </p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item) => {
            const riskStatus = getRiskStatus(
              item.verdict
            );

            const isLoading =
              selectedId === item.id;

            return (
              <article
                className="history-card"
                key={item.id}
              >
                <div className="history-card-main">
                  <div className="history-card-top">
                    <span
                      className={`history-status ${riskStatus.className}`}
                    >
                      {riskStatus.label}
                    </span>

                    <span className="history-date">
                      {formatDate(item.created_at)}
                    </span>
                  </div>

                  <h3>{item.url}</h3>

                  <p>
                    분석 결과를 확인하려면
                    결과 보기를 눌러주세요.
                  </p>
                </div>

                <div className="history-card-actions">
                  <button
                    className="history-view-button"
                    onClick={() =>
                      handleViewResult(item.id)
                    }
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "불러오는 중..."
                      : "결과 보기"}
                    {!isLoading && <span>→</span>}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default History;