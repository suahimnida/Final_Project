function Header() {
  return (
    <header className="header">
      <div className="header-logo">
        <div className="logo-mark">P</div>

        <div>
          <h1>PHISHING ANALYZER</h1>
          <span>AI Security Analysis</span>
        </div>
      </div>

      <div className="header-status">
        <span className="status-dot"></span>
        System Online
      </div>
    </header>
  );
}

export default Header;