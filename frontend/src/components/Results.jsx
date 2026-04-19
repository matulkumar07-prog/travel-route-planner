import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Results = () => {
  const [result, setResult] = useState(null);
  const [routeName, setRouteName] = useState('');
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const lastResult = sessionStorage.getItem('lastResult');
    if (lastResult) {
      setResult(JSON.parse(lastResult));
    } else {
      navigate('/compute');
    }
  }, [navigate]);

  const handleSaveRoute = async () => {
    if (!routeName.trim()) {
      alert('Please enter a route name');
      return;
    }

    setSaving(true);
    try {
      await axios.post('http://localhost:5000/api/algorithm/save', {
        routeName,
        cities: result.pathCities,
        distanceMatrix: [],
        algorithm: result.algorithm,
        optimalPath: result.path,
        totalDistance: result.totalDistance,
        executionTime: result.executionTime,
        pathsExplored: result.pathsExplored
      });

      alert('Route saved successfully!');
      setRouteName('');
      navigate('/saved-routes');
    } catch (err) {
      alert('Failed to save route: ' + err.response?.data?.message);
    } finally {
      setSaving(false);
    }
  };

  if (!result) {
    return <div className="loading">Loading results...</div>;
  }

  return (
    <div className="results-container">
      <div className="container">
        {/* Success Header */}
        <div className="results-header">
          <h1>🎉 Route Optimized Successfully!</h1>
          <p>Your optimal route has been computed with the {result.algorithm} algorithm</p>
        </div>

        {/* Route Sequence */}
        <div className="route-sequence">
          <h2>📍 Your Optimal Route</h2>
          <div className="route-path">
            {result.pathCities.map((city, index) => (
              <React.Fragment key={index}>
                <div className="route-city">{city}</div>
                {index < result.pathCities.length - 1 && <div className="route-arrow">→</div>}
              </React.Fragment>
            ))}
            <div className="route-arrow">→</div>
            <div className="route-city">{result.pathCities[0]}</div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="results-metrics">
          <div className="metric-card">
            <div className="metric-label">📏 Total Distance</div>
            <div className="metric-value">{result.totalDistance.toFixed(2)} km</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">⚙️ Algorithm</div>
            <div className="metric-value" style={{ fontSize: '18px' }}>{result.algorithm}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">⏱️ Execution Time</div>
            <div className="metric-value">{result.executionTime?.toFixed(3)} ms</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">🔍 Paths Explored</div>
            <div className="metric-value">{result.pathsExplored || '∞'}</div>
          </div>
        </div>

        {/* Save Route Section */}
        <div className="card" style={{ marginBottom: '32px', borderLeft: '4px solid var(--accent-blue)' }}>
          <h2 style={{ marginBottom: '16px', color: 'var(--accent-blue)' }}>💾 Save This Route</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Enter route name..."
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleSaveRoute} disabled={saving}>
              {saving ? 'Saving...' : 'Save Route'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="results-actions">
          <button className="btn btn-primary" onClick={() => navigate('/comparison')}>
            ⚖️ Compare Algorithms
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/compute')}>
            🚀 Compute New Route
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/saved-routes')}>
            💾 View Saved Routes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;

