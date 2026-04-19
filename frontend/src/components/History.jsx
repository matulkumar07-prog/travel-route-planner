import React, { useState, useEffect } from 'react';
import axios from 'axios';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/algorithm/history');
      setHistory(response.data.history);
    } catch (err) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading history...</div>;

  return (
    <div className="history-container">
      <div className="container">
        {/* Header */}
        <div className="history-header">
          <h1>📈 Computation History</h1>
          <p>Timeline of all your route optimization computations</p>
        </div>

        {/* Timeline */}
        {history.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', borderLeft: '4px solid var(--info)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏰</div>
            <h2 style={{ color: 'var(--text-secondary)' }}>No history yet</h2>
            <p style={{ color: 'var(--text-tertiary)' }}>
              Your computation history will appear here
            </p>
          </div>
        ) : (
          <div className="history-timeline">
            {history.map((item, index) => (
              <div key={item.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-circle">{index + 1}</div>
                </div>
                
                <div className="timeline-content">
                  <div className="timeline-date">
                    {new Date(item.computedAt).toLocaleDateString('en-US', { 
                      weekday: 'short', 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  
                  <div className="timeline-title">
                    🎯 {item.algorithm} Algorithm
                  </div>
                  
                  <div className="timeline-desc">
                    <strong>{item.cities.length} cities</strong> optimized in{' '}
                    <strong>{item.totalDistance?.toFixed(2)} km</strong>
                  </div>
                  
                  <div className="timeline-tags">
                    <span className="tag tag-blue">
                      📍 {item.cities.length} cities
                    </span>
                    <span className="tag tag-orange">
                      📏 {item.totalDistance?.toFixed(2)} km
                    </span>
                    <span className="tag tag-green">
                      ⏱️ {item.executionTime?.toFixed(2)} ms
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
