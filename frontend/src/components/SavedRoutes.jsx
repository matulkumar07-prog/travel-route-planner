import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SavedRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSavedRoutes();
  }, []);

  const fetchSavedRoutes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/algorithm/saved');
      setRoutes(response.data.routes);
    } catch (err) {
      setError('Failed to fetch saved routes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await axios.delete(`http://localhost:5000/api/algorithm/saved/${id}`);
        setRoutes(routes.filter(r => r.id !== id));
      } catch (err) {
        alert('Failed to delete route');
      }
    }
  };

  if (loading) return <div className="loading">Loading routes...</div>;

  return (
    <div className="saved-routes-container">
      <div className="container">
        {/* Header */}
        <div className="saved-routes-header">
          <h1>💾 Saved Routes</h1>
          <p>Manage and review all your optimized travel routes</p>
        </div>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Empty State */}
        {routes.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', borderLeft: '4px solid var(--info)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h2 style={{ color: 'var(--text-secondary)' }}>No saved routes yet</h2>
            <p style={{ color: 'var(--text-tertiary)', marginBottom: '24px' }}>
              Start by computing your first optimized route
            </p>
            <a href="/compute" className="btn btn-primary">🚀 Compute New Route</a>
          </div>
        ) : (
          <div className="routes-grid">
            {routes.map((route) => (
              <div key={route.id} className="route-card">
                <div className="route-card-header">
                  <h3 className="route-name">{route.routeName}</h3>
                  <span className="route-date">{new Date(route.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="route-details">
                  <div className="detail-row">
                    <span className="detail-label">📍 Cities</span>
                    <span className="detail-value">{route.cities.length} cities</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🎯 Algorithm</span>
                    <span className="detail-value">{route.algorithm}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📏 Distance</span>
                    <span className="detail-value" style={{ color: 'var(--success)' }}>
                      {route.totalDistance?.toFixed(2)} km
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">⏱️ Time</span>
                    <span className="detail-value">{route.executionTime?.toFixed(3)} ms</span>
                  </div>
                </div>

                <div className="route-card-footer">
                  <button className="btn btn-secondary" style={{ fontSize: '14px' }}>
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-error" 
                    onClick={() => handleDelete(route.id)}
                    style={{ fontSize: '14px' }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedRoutes;
