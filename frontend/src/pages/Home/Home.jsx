import "./Home.css";

function Home() {
  return (
    <section className="home">
      <div className="home-header">
        <p className="eyebrow">AI-POWERED WEB SECURITY</p>

        <h2>
          Is this website
          <br />
          <span>safe?</span>
        </h2>

        <p className="home-description">
          Analyze a URL with multiple security signals and AI-powered analysis.
        </p>
      </div>

      <div className="url-card">
        <div className="url-card-label">URL ANALYSIS</div>

        <div className="url-input-row">
          <input
            type="text"
            placeholder="https://example.com"
          />

          <button className="analyze-button">
            Analyze
            <span>→</span>
          </button>
        </div>

        <p className="input-help">
          Enter the URL you want to analyze for potential phishing threats.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="feature-number">01</span>
          <h3>URL Analysis</h3>
          <p>
            URL structure, length, character patterns and entropy analysis.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-number">02</span>
          <h3>AI Detection</h3>
          <p>
            AI Agent combines multiple analysis results to identify suspicious
            behavior.
          </p>
        </div>

        <div className="feature-card">
          <span className="feature-number">03</span>
          <h3>Web Analysis</h3>
          <p>
            HTML, text and visual elements can be analyzed for additional
            signals.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Home;