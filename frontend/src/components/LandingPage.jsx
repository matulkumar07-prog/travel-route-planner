import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-navbar">
        <div className="landing-container">
          <div className="landing-logo">🗺️ TravelGraph</div>
          <div className="landing-nav-buttons">
            <button className="btn-secondary" onClick={() => navigate('/login')}>Login</button>
            <button className="btn-primary" onClick={() => navigate('/register')}>Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-animated-bg"></div>
        <div className="landing-container">
          <div className="hero-content">
            <div className="hero-badge">✨ Intelligent Route Optimization</div>
            <h1>Find the Fastest Route, Every Time</h1>
            <p>Use cutting-edge algorithms to optimize your travel routes. Solve the Traveling Salesman Problem with 3 powerful algorithms - find the perfect balance between speed and accuracy.</p>
            <div className="hero-buttons">
              <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>🚀 Get Started Free</button>
              <button className="btn-secondary btn-lg" onClick={() => navigate('/login')}>📊 Sign In</button>
            </div>
            <div className="hero-stats">
              <div className="stat"><span className="stat-value">1000+</span><span className="stat-label">Routes Computed</span></div>
              <div className="stat"><span className="stat-value">95%</span><span className="stat-label">Accuracy</span></div>
              <div className="stat"><span className="stat-value">3x</span><span className="stat-label">Faster</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="animated-route"></div>
            <div className="route-dots"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="landing-container">
          <h2>Powerful Features</h2>
          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon">⚡</div>
              <h3>Fast Computation</h3>
              <p>Get optimal routes in seconds using three different algorithms optimized for performance.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🎯</div>
              <h3>Accurate Results</h3>
              <p>Choose between speed and accuracy with Nearest Neighbour, Brute Force, or Held-Karp DP.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📊</div>
              <h3>Analytics</h3>
              <p>Track your routes, view statistics, and compare algorithm performance over time.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">💾</div>
              <h3>Save Routes</h3>
              <p>Save your best routes and revisit them anytime with full history tracking.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">🔒</div>
              <h3>Secure</h3>
              <p>Enterprise-grade security with JWT authentication and encrypted data storage.</p>
            </div>
            <div className="feature-box">
              <div className="feature-icon">📱</div>
              <h3>Responsive</h3>
              <p>Access your routes from any device with our fully responsive web application.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Algorithms Section */}
      <section className="algorithms">
        <div className="landing-container">
          <h2>Three Powerful Algorithms</h2>
          <div className="algorithms-grid">
            <div className="algo-card">
              <h3>Nearest Neighbour</h3>
              <div className="algo-complexity">O(n²)</div>
              <p><strong>Speed:</strong> ⚡⚡⚡ Fast</p>
              <p><strong>Accuracy:</strong> 📊 70-80%</p>
              <p>Perfect for real-time applications. Uses a greedy approach to find quick solutions.</p>
              <div className="badge-secondary">Best for delivery apps</div>
            </div>
            <div className="algo-card">
              <h3>Brute Force</h3>
              <div className="algo-complexity">O(n!)</div>
              <p><strong>Speed:</strong> 🐌 Slow</p>
              <p><strong>Accuracy:</strong> ✅ 100%</p>
              <p>Guaranteed optimal solution. Works well for small problem sizes (max 8 cities).</p>
              <div className="badge-success">Exact solution</div>
            </div>
            <div className="algo-card">
              <h3>Held-Karp DP</h3>
              <div className="algo-complexity">O(n²·2ⁿ)</div>
              <p><strong>Speed:</strong> 💨 Medium</p>
              <p><strong>Accuracy:</strong> ✅ 100%</p>
              <p>Dynamic programming approach for larger problems (max 20 cities) with optimal results.</p>
              <div className="badge-info">Best balance</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="landing-container">
          <h2>Ready to Optimize Your Routes?</h2>
          <p>Join thousands of users optimizing their delivery routes with TravelGraph.</p>
          <button className="btn-primary btn-lg" onClick={() => navigate('/register')}>Start Free Trial</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-container">
          <p>&copy; 2026 TravelGraph. All rights reserved.</p>
          <p>An AWT (Advanced Web Technologies) College Project by Marwadi University</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
