import { useEffect, useState } from "react";
import "./History.css";

function Home({ onAnalyze }) {
  const [url, setUrl] = useState("");
  const [recentHistory, setRecentHistory] = useState([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(
      "phishingAnalysisHistory"
    );

    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory);
        setRecentHistory(history.slice(0, 3));
      } catch (error) {
        console.error(
          "최근 분석 기록을 불러오지 못했습니다:",
          error
        );
      }
    }
  }, []);

  // 이하 기존 코드...

  const handleDelete = (id) => {
    const updatedHistory = history.filter(
      (item) => item.id !== id
    );

    setHistory(updatedHistory);

    localStorage.setItem(
      "phishingAnalysisHistory",
      JSON.stringify(updatedHistory)
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
          <div className="history-empty-icon">◷</div>

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
            const isPhishing =
              item.result?.risk_level === "high";

            return (
              <article
                className="history-card"
                key={item.id}
              >
                <div className="history-card-main">
                  <div className="history-card-top">
                    <span
                      className={`history-status ${
                        isPhishing ? "danger" : "normal"
                      }`}
                    >
                      {isPhishing
                        ? "피싱 의심"
                        : "정상"}
                    </span>

                    <span className="history-date">
                      {formatDate(item.analyzedAt)}
                    </span>
                  </div>

                  <h3>{item.url}</h3>

                  <p>
                    {item.result?.ai_analysis?.summary ||
                      "분석 결과를 확인할 수 있습니다."}
                  </p>
                </div>

                <div className="history-card-actions">
                  <button
                    className="history-view-button"
                    onClick={() => onViewResult(item)}
                  >
                    결과 보기
                    <span>→</span>
                  </button>

                  <button
                    className="history-delete-button"
                    onClick={() =>
                      handleDelete(item.id)
                    }
                  >
                    삭제
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