import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, statsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/me'),
          axios.get('http://localhost:5000/api/algorithm/stats')
        ]);
        setUser(userRes.data.user);
        setStats(statsRes.data.stats);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="loading">Loading your dashboard...</div>;
  }

  return (
    <div className="container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
      {/* Welcome Header */}
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>👋 Welcome back, <span style={{ color: 'var(--accent-blue)' }}>{user?.username}</span>!</h1>
          <p>Ready to optimize your routes today?</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-grid">
        <button 
          className="action-card primary"
          onClick={() => navigate('/compute')}
        >
          <div className="action-icon">🚀</div>
          <div className="action-text">
            <h3>New Route</h3>
            <p>Compute optimized routes</p>
          </div>
        </button>
        <button 
          className="action-card secondary"
          onClick={() => navigate('/comparison')}
        >
          <div className="action-icon">⚖️</div>
          <div className="action-text">
            <h3>Compare</h3>
            <p>Compare algorithms</p>
          </div>
        </button>
        <button 
          className="action-card secondary"
          onClick={() => navigate('/saved-routes')}
        >
          <div className="action-icon">💾</div>
          <div className="action-text">
            <h3>Saved Routes</h3>
            <p>View your routes</p>
          </div>
        </button>
        <button 
          className="action-card secondary"
          onClick={() => navigate('/stats')}
        >
          <div className="action-icon">📊</div>
          <div className="action-text">
            <h3>Analytics</h3>
            <p>View statistics</p>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="dashboard-stats">
          <h2 style={{ marginBottom: '28px', fontSize: '28px', fontWeight: '800', color: 'var(--primary-text)' }}>Your Statistics</h2>
          <div className="stats-grid-4">
            <div className="stat-card bright-blue">
              <div className="stat-icon">📍</div>
              <div className="stat-content">
                <p className="stat-label">Total Computations</p>
                <p className="stat-value">{stats.totalComputations || 0}</p>
              </div>
            </div>
            <div className="stat-card bright-orange">
              <div className="stat-icon">💾</div>
              <div className="stat-content">
                <p className="stat-label">Saved Routes</p>
                <p className="stat-value">{stats.totalSavedRoutes || 0}</p>
              </div>
            </div>
            <div className="stat-card bright-green">
              <div className="stat-icon">📏</div>
              <div className="stat-content">
                <p className="stat-label">Avg Distance</p>
                <p className="stat-value">{stats.averageDistance ? stats.averageDistance.toFixed(1) : '0'} km</p>
              </div>
            </div>
            <div className="stat-card bright-cyan">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <p className="stat-label">Best Distance</p>
                <p className="stat-value">{stats.bestDistance ? stats.bestDistance.toFixed(1) : '0'} km</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Section */}
      <div className="info-section">
        <div className="info-card">
          <h2>🎯 Quick Tips</h2>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-number">1</span>
              <div>
                <h4>Use Nearest Neighbour</h4>
                <p>for quick results on large datasets</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">2</span>
              <div>
                <h4>Use Held-Karp</h4>
                <p>for optimal routes (up to 20 cities)</p>
              </div>
            </div>
            <div className="tip-item">
              <span className="tip-number">3</span>
              <div>
                <h4>Compare Results</h4>
                <p>run multiple algorithms and compare</p>
              </div>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h2>📚 Algorithm Details</h2>
          <div className="algo-list">
            <div className="algo-item">
              <div className="algo-name">⚡ Nearest Neighbour</div>
              <div className="algo-desc">Fast greedy approach - O(n²)</div>
            </div>
            <div className="algo-item">
              <div className="algo-name">🔍 Brute Force</div>
              <div className="algo-desc">Exact solution - O(n!) - max 8 cities</div>
            </div>
            <div className="algo-item">
              <div className="algo-name">🧠 Held-Karp DP</div>
              <div className="algo-desc">Optimal solution - O(n²·2ⁿ) - max 20 cities</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
