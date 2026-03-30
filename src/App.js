import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import './App.css';
import { commonMedicines, fetchMedicineInfo } from './script';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setActiveSuggestion(0);
    
    if (value.trim().length > 0) {
      const filtered = commonMedicines.filter(med => 
        med.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (e) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestion((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      setQuery(suggestions[activeSuggestion]);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (med) => {
    setQuery(med);
    setSuggestions([]);
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setSuggestions([]);
    setLoading(true);
    setResult('');
    setError('');
    
    try {
      const info = await fetchMedicineInfo(query);
      setResult(info);
    } catch (err) {
      setError("Unable to connect to the medical database. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Ambient Background Orbs */}
      <div className="ambient-orb orb-1"></div>
      <div className="ambient-orb orb-2"></div>
      <div className="ambient-orb orb-3"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="logo-icon floating-icon">⚕️</span> 
          <span className="brand-text">PharmaSense</span>
        </div>
        <div className="nav-links">
          <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="hover-underline">LinkedIn</a>
          <a href="https://portfolio-of-nitish.vercel.app/" target="_blank" rel="noreferrer" className="hover-underline">Portfolio</a>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="hover-underline">Instagram</a>
        </div>
      </nav>

      {/* Main Interface */}
      <main className="main-content">
        <div className="hero-section">
          <div className="badge-pill">✨ AI-Powered Medical Database</div>
          <h1 className="gradient-text">Intelligent Medicine Directory</h1>
          <p className="subtitle">Instant pharmaceutical details, mechanisms, and safety protocols at your fingertips.</p>
          
          <div className="search-wrapper" ref={searchContainerRef}>
            <form className="search-box" onSubmit={handleSearch}>
              <div className="input-container">
                <input 
                  type="text" 
                  placeholder="Ask about Amoxicillin, Paracetamol..." 
                  value={query}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
                
                {suggestions.length > 0 && (
                  <ul className="suggestions-list slide-down">
                    {suggestions.map((med, index) => (
                      <li 
                        key={index} 
                        className={index === activeSuggestion ? "suggestion-active" : ""}
                        onClick={() => handleSuggestionClick(med)}
                      >
                        {med}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="search-btn glow-effect" disabled={loading}>
                {loading ? <span className="spinner"></span> : 'Analyze'}
              </button>
            </form>
          </div>
        </div>

        {/* States & Results */}
        {error && <div className="error-banner pop-in">⚠️ {error}</div>}
        
        {loading && (
          <div className="loading-skeleton pop-in">
            <div className="scanning-line"></div>
            <div className="skeleton-title pulse-anim"></div>
            <div className="skeleton-line pulse-anim"></div>
            <div className="skeleton-line pulse-anim"></div>
            <div className="skeleton-line w-70 pulse-anim"></div>
          </div>
        )}
        
        {result && !loading && (
          <div className="result-card slide-up">
            <div className="result-header">
              <h2>Overview: <span className="highlight-text">{query.toUpperCase()}</span></h2>
              <span className="status-badge pulse-border">Verified AI Analysis</span>
            </div>
            <div className="result-content">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
            <div className="medical-disclaimer">
              <span className="warning-icon">⚠️</span>
              <strong>Disclaimer:</strong> Generated by AI for educational purposes. Never replace professional medical advice.
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-glass">
          <p>Developed with precision by <strong>Nitish Sharma</strong></p>
          <div className="footer-divider"></div>
          <p>Reg No. <strong className="gradient-text">24BDS0330</strong></p>
        </div>
      </footer>
    </div>
  );
}

export default App;
