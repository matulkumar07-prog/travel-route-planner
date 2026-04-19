import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminBasic = ({ admin, onAdminLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      // Fetch current user stats
      const userStatsResponse = await axios.get('http://localhost:5000/api/algorithm/stats');
      setStats(userStatsResponse.data.stats);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    onAdminLogout();
    navigate('/admin-login');
  };

  if (loading) return <div className="loading">Loading admin panel...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <div>
          <h1>🔐 Admin Control Panel</h1>
          <p className="subtitle">System Statistics & Monitoring</p>
        </div>
        <button onClick={handleLogout} className="btn-error btn-sm">
          🚪 Logout
        </button>
      </div>

      <div className="container">

        {stats && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Your Total Computations</h3>
                <p className="stat-number">{stats.totalComputations}</p>
              </div>
              <div className="stat-card">
                <h3>Your Saved Routes</h3>
                <p className="stat-number">{stats.totalSavedRoutes}</p>
              </div>
              <div className="stat-card">
                <h3>Average Distance</h3>
                <p className="stat-number">{stats.averageDistance} km</p>
              </div>
              <div className="stat-card">
                <h3>Best Distance</h3>
                <p className="stat-number">{stats.bestDistance.toFixed(2)} km</p>
              </div>
            </div>

            <div className="admin-section">
              <h2>Algorithm Usage Breakdown</h2>
              <div className="admin-grid">
                <div className="info-card">
                  <h3>🏃 Nearest Neighbour</h3>
                  <p className="large-text">{stats.algorithmsUsed.nearestNeighbour}</p>
                  <p className="small-text">computations</p>
                </div>
                <div className="info-card">
                  <h3>💪 Brute Force</h3>
                  <p className="large-text">{stats.algorithmsUsed.bruteForce}</p>
                  <p className="small-text">computations</p>
                </div>
                <div className="info-card">
                  <h3>🧠 Held-Karp DP</h3>
                  <p className="large-text">{stats.algorithmsUsed.heldKarp}</p>
                  <p className="small-text">computations</p>
                </div>
              </div>
            </div>

            <div className="admin-section">
              <h2>System Information</h2>
              <div className="info-table">
                <div className="info-row">
                  <span className="label">Application Version:</span>
                  <span className="value">1.0.0</span>
                </div>
                <div className="info-row">
                  <span className="label">API Status:</span>
                  <span className="value badge-success">Active</span>
                </div>
                <div className="info-row">
                  <span className="label">Database:</span>
                  <span className="value">MongoDB</span>
                </div>
                <div className="info-row">
                  <span className="label">Authentication:</span>
                  <span className="value">JWT</span>
                </div>
                <div className="info-row">
                  <span className="label">Active Users:</span>
                  <span className="value">1 (Current)</span>
                </div>
              </div>
            </div>

            <div className="admin-section">
              <h2>Features Available</h2>
              <div className="features-list">
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>Three algorithm implementations (NN, BF, DP)</span>
                </div>
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>Route saving and management</span>
                </div>
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>Computation history tracking</span>
                </div>
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>User authentication with JWT</span>
                </div>
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>Algorithm comparison tool</span>
                </div>
                <div className="feature-item">
                  <span className="check">✓</span>
                  <span>Responsive web interface</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminBasic;
