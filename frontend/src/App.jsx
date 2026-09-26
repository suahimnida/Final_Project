import { useState } from "react";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Analysis from "./pages/Analysis/Analysis";
import Result from "./pages/Result/Result";
import History from "./pages/History/History";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [targetUrl, setTargetUrl] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalyze = (url) => {
    setTargetUrl(url);
    setCurrentPage("analysis");
  };

 
const handleAnalysisComplete = (result) => {
  setAnalysisResult(result);
  setCurrentPage("result");
};

  return (
    <div className="app">
      <Header />

      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-section">
            <p className="sidebar-label">메인</p>

            <button
              className={`sidebar-item ${
                currentPage === "home" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("home")}
            >
              <span>⌂</span>
              대시보드
            </button>

            <button
              className={`sidebar-item ${
                currentPage === "analysis" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("analysis")}
            >
              <span>⌕</span>
              URL 분석
            </button>

            <button
              className={`sidebar-item ${
                currentPage === "history" ? "active" : ""
              }`}
              onClick={() => setCurrentPage("history")}
            >
              <span>◷</span>
              분석 기록
            </button>
          </div>

          <div className="sidebar-section">
            <p className="sidebar-label">프로젝트</p>

            <button className="sidebar-item">
              <span>◈</span>
              탐지 방법
            </button>

            <button className="sidebar-item">
              <span>◫</span>
              데이터셋
            </button>

            <button className="sidebar-item">
              <span>◎</span>
              ML 모델
            </button>
          </div>
        </aside>

        <main className="main-content">
          {currentPage === "home" && (
            <Home onAnalyze={handleAnalyze} />
          )}

          {currentPage === "analysis" && (
            <Analysis
              url={targetUrl}
              onComplete={handleAnalysisComplete}
            />
          )}

          {currentPage === "result" && (
            <Result
              url={targetUrl}
             result={analysisResult}
            />
          )}

          {currentPage === "history" && <History />}
        </main>
      </div>
    </div>
  );
}

export default App;