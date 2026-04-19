import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/algorithm/stats');
      setStats(response.data.stats);
    } catch (err) {
      console.error('Failed to fetch stats');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading statistics...</div>;

  return (
    <div className="stats-container">
      <div className="container">
        {/* Header */}
        <div className="stats-header">
          <h1>📊 Your Statistics</h1>
          <p>Analytics and insights about your route optimizations</p>
        </div>

        {stats && (
          <>
            {/* Main Statistics Grid */}
            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-icon">📍</div>
                <div className="stat-label">Total Computations</div>
                <div className="stat-value">{stats.totalComputations}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">💾</div>
                <div className="stat-label">Saved Routes</div>
                <div className="stat-value">{stats.totalSavedRoutes}</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">📏</div>
                <div className="stat-label">Average Distance</div>
                <div className="stat-value">{stats.averageDistance?.toFixed(2)} km</div>
              </div>
              <div className="stat-box">
                <div className="stat-icon">🏆</div>
                <div className="stat-label">Best Distance</div>
                <div className="stat-value">{stats.bestDistance?.toFixed(2)} km</div>
              </div>
            </div>

            {/* Algorithm Usage Section */}
            <div className="chart-section">
              <h2 style={{ marginBottom: '24px', color: 'var(--text-primary)' }}>⚙️ Algorithm Usage</h2>
              <div className="algo-bars">
                {/* Nearest Neighbour */}
                <div className="algo-bar">
                  <div className="algo-header">
                    <span className="algo-name">Nearest Neighbour</span>
                    <span className="algo-count">{stats.algorithmsUsed?.nearestNeighbour || 0}</span>
                  </div>
                  <div className="bar">
                    <div className="fill fill-blue" style={{ 
                      width: `${Math.min(((stats.algorithmsUsed?.nearestNeighbour || 0) / (stats.totalComputations || 1)) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, var(--accent-blue) 0%, var(--accent-blue-lighter) 100%)'
                    }}></div>
                  </div>
                </div>

                {/* Brute Force */}
                <div className="algo-bar">
                  <div className="algo-header">
                    <span className="algo-name">Brute Force</span>
                    <span className="algo-count">{stats.algorithmsUsed?.bruteForce || 0}</span>
                  </div>
                  <div className="bar">
                    <div className="fill fill-orange" style={{ 
                      width: `${Math.min(((stats.algorithmsUsed?.bruteForce || 0) / (stats.totalComputations || 1)) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, var(--accent-orange) 0%, var(--accent-orange-lighter) 100%)'
                    }}></div>
                  </div>
                </div>

                {/* Held-Karp DP */}
                <div className="algo-bar">
                  <div className="algo-header">
                    <span className="algo-name">Held-Karp DP</span>
                    <span className="algo-count">{stats.algorithmsUsed?.heldKarp || 0}</span>
                  </div>
                  <div className="bar">
                    <div className="fill fill-green" style={{ 
                      width: `${Math.min(((stats.algorithmsUsed?.heldKarp || 0) / (stats.totalComputations || 1)) * 100, 100)}%`,
                      background: 'linear-gradient(90deg, var(--success) 0%, var(--success-light) 100%)'
                    }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="insights-grid" style={{ marginTop: '40px' }}>
              <div className="card" style={{ 
                borderLeft: '4px solid var(--accent-blue)',
                padding: '24px',
                background: 'linear-gradient(135deg, var(--accent-blue) 0%, transparent 100%)',
                backgroundAttachment: 'fixed',
                opacity: 0.95
              }}>
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>💡 Insight</h3>
                <p style={{ color: 'var(--text-secondary)' }}>
                  You've optimized <strong>{stats.totalComputations}</strong> routes with an average distance of{' '}
                  <strong>{stats.averageDistance?.toFixed(2)} km</strong>
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Stats;

