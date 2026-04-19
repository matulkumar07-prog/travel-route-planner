import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminDashboard.css';
import AdminUsers from './AdminUsers';
import AdminRoutes from './AdminRoutes';
import AdminLogs from './AdminLogs';
import AdminSettings from './AdminSettings';

const AdminDashboard = ({ admin, adminToken, onAdminLogout }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get('http://localhost:5000/api/admin/stats/system', { headers });
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      await axios.post('http://localhost:5000/api/admin/logout', {}, { headers });
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    onAdminLogout();
    navigate('/admin-login');
  };

  if (loading) return <div className="admin-loading">Loading admin panel...</div>;

  return (
    <div className="admin-dashboard">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>🔐 Admin</h2>
        </div>
        <nav className="admin-nav">
          <button
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`nav-item ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
          <button
            className={`nav-item ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            🗺️ Routes
          </button>
          <button
            className={`nav-item ${activeTab === 'logs' ? 'active' : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            📝 Logs
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
        <div className="admin-footer-nav">
          <button onClick={handleLogout} className="btn-logout">
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="admin-main">
        <div className="admin-header">
          <h1>Admin Control Panel</h1>
          <div className="admin-info">
            <span>Welcome, {admin?.username}</span>
            <span className="badge">{admin?.role?.toUpperCase()}</span>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="admin-content">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <h3>Total Users</h3>
                <p className="stat-number">{stats?.users?.total || 0}</p>
                <p className="stat-subtitle">Active: {stats?.users?.active || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🗺️</div>
                <h3>Saved Routes</h3>
                <p className="stat-number">{stats?.routes?.total || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <h3>Total Computations</h3>
                <p className="stat-number">{stats?.routes?.totalComputations || 0}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚫</div>
                <h3>Banned Users</h3>
                <p className="stat-number">{stats?.users?.banned || 0}</p>
              </div>
            </div>

            <div className="analytics-section">
              <h2>Algorithm Usage Distribution</h2>
              <div className="algorithm-grid">
                {stats?.algorithmUsage?.map((algo, idx) => (
                  <div key={idx} className="algo-card">
                    <h3>
                      {algo._id === 'nearestNeighbour' && '🏃'} 
                      {algo._id === 'bruteForce' && '💪'} 
                      {algo._id === 'heldKarp' && '🧠'}
                      {' '}
                      {algo._id === 'nearestNeighbour' ? 'Nearest Neighbour' : 
                       algo._id === 'bruteForce' ? 'Brute Force' : 'Held-Karp DP'}
                    </h3>
                    <p className="algo-stat">{algo.count} uses</p>
                    <p className="algo-avg">Avg: {algo.avgDistance?.toFixed(2)} km</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="user-status-section">
              <h2>User Status Distribution</h2>
              <div className="status-grid">
                <div className="status-card">
                  <span className="status-badge active">✓</span>
                  <h4>Active Users</h4>
                  <p>{stats?.users?.active || 0}</p>
                </div>
                <div className="status-card">
                  <span className="status-badge inactive">—</span>
                  <h4>Inactive Users</h4>
                  <p>{stats?.users?.inactive || 0}</p>
                </div>
                <div className="status-card">
                  <span className="status-badge banned">✕</span>
                  <h4>Banned Users</h4>
                  <p>{stats?.users?.banned || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <AdminUsers adminToken={adminToken} />
        )}

        {activeTab === 'routes' && (
          <AdminRoutes adminToken={adminToken} />
        )}

        {activeTab === 'logs' && (
          <AdminLogs adminToken={adminToken} />
        )}

        {activeTab === 'settings' && (
          <AdminSettings adminToken={adminToken} />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
