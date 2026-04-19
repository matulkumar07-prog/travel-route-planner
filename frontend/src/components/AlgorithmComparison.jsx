import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AlgorithmComparison = () => {
  const [cities, setCities] = useState(['City 1']);
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAddCity = () => {
    setCities([...cities, `City ${cities.length + 1}`]);
  };

  const handleRemoveCity = (index) => {
    if (cities.length > 2) {
      const newCities = cities.filter((_, i) => i !== index);
      setCities(newCities);
    }
  };

  const handleCityNameChange = (index, value) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const handleMatrixChange = (row, col, value) => {
    const newMatrix = [...distanceMatrix];
    if (!newMatrix[row]) newMatrix[row] = [];
    newMatrix[row][col] = parseFloat(value) || 0;
    setDistanceMatrix(newMatrix);
  };

  const handleCompareAll = async () => {
    setError('');
    setResults(null);

    if (cities.length < 2) {
      setError('Please add at least 2 cities');
      return;
    }

    if (distanceMatrix.length !== cities.length) {
      setError('Please fill in all distances');
      return;
    }

    setLoading(true);

    try {
      const algorithms = ['nearestNeighbour', 'bruteForce', 'heldKarp'];
      const comparisonResults = {};

      for (let algo of algorithms) {
        try {
          const response = await axios.post('http://localhost:5000/api/algorithm/compute', {
            cities,
            distanceMatrix,
            algorithm: algo
          });
          comparisonResults[algo] = response.data.result;
        } catch (err) {
          comparisonResults[algo] = { error: err.response?.data?.message || 'Failed to compute' };
        }
      }

      setResults(comparisonResults);
    } catch (err) {
      setError('Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="comparison-container">
      <div className="container">
        {/* Input Section */}
        {!results && (
          <>
            <div className="form-card">
              <h1>⚖️ Compare All Algorithms</h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                Run all 3 algorithms simultaneously and compare results side by side
              </p>

              {error && (
                <div className="error-message">
                  ⚠️ {error}
                </div>
              )}

              <div className="form-section">
                <h2 style={{ marginBottom: '16px' }}>📍 Cities</h2>
                <div className="cities-list">
                  {cities.map((city, index) => (
                    <div key={index} className="city-input">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => handleCityNameChange(index, e.target.value)}
                        placeholder={`City ${index + 1}`}
                      />
                      {cities.length > 2 && (
                        <button className="btn-remove" onClick={() => handleRemoveCity(index)}>✕</button>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn btn-secondary" onClick={handleAddCity}>
                  ➕ Add City
                </button>
              </div>

              <div className="form-section">
                <h2 style={{ marginBottom: '16px' }}>📏 Distance Matrix</h2>
                <div className="distance-matrix">
                  <table>
                    <thead>
                      <tr>
                        <th></th>
                        {cities.map((city, i) => (
                          <th key={i} title={city}>{city.substring(0, 8)}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {cities.map((city, row) => (
                        <tr key={row}>
                          <th title={city}>{city.substring(0, 8)}</th>
                          {cities.map((_, col) => (
                            <td key={col}>
                              <input
                                type="number"
                                value={distanceMatrix[row]?.[col] || ''}
                                onChange={(e) => handleMatrixChange(row, col, e.target.value)}
                                placeholder="0"
                                disabled={row === col}
                                min="0"
                                step="0.1"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button 
                className="btn btn-primary" 
                onClick={handleCompareAll} 
                disabled={loading}
                style={{ marginTop: '32px' }}
              >
                {loading ? '⏳ Comparing...' : '⚡ Compare All Algorithms'}
              </button>
            </div>
          </>
        )}

        {/* Results Section */}
        {results && (
          <>
            <div className="comparison-header">
              <h1>📊 Algorithm Comparison Results</h1>
              <p>Side-by-side analysis of all three algorithms</p>
            </div>

            {/* Comparison Table */}
            <div className="card" style={{ overflowX: 'auto', marginBottom: '32px' }}>
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th>Algorithm</th>
                    <th>Total Distance</th>
                    <th>Execution Time</th>
                    <th>Paths Explored</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderLeftColor: 'var(--accent-blue)' }}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-blue)' }}>🏃 Nearest Neighbour</td>
                    <td className={results.nearestNeighbour.error ? 'error' : ''} style={{ color: 'var(--success)' }}>
                      {results.nearestNeighbour.error ? '❌ Error' : `${results.nearestNeighbour.totalDistance?.toFixed(2)} km`}
                    </td>
                    <td>{results.nearestNeighbour.error ? '-' : `${results.nearestNeighbour.executionTime?.toFixed(3)} ms`}</td>
                    <td>{results.nearestNeighbour.error ? '-' : results.nearestNeighbour.pathsExplored || '∞'}</td>
                  </tr>
                  <tr style={{ borderLeftColor: 'var(--accent-orange)' }}>
                    <td style={{ fontWeight: '600', color: 'var(--accent-orange)' }}>💪 Brute Force</td>
                    <td className={results.bruteForce.error ? 'error' : ''} style={{ color: 'var(--success)' }}>
                      {results.bruteForce.error ? '❌ Error' : `${results.bruteForce.totalDistance?.toFixed(2)} km`}
                    </td>
                    <td>{results.bruteForce.error ? '-' : `${results.bruteForce.executionTime?.toFixed(3)} ms`}</td>
                    <td>{results.bruteForce.error ? '-' : results.bruteForce.pathsExplored}</td>
                  </tr>
                  <tr style={{ borderLeftColor: 'var(--success)' }}>
                    <td style={{ fontWeight: '600', color: 'var(--success)' }}>🧠 Held-Karp DP</td>
                    <td className={results.heldKarp.error ? 'error' : ''} style={{ color: 'var(--success)' }}>
                      {results.heldKarp.error ? '❌ Error' : `${results.heldKarp.totalDistance?.toFixed(2)} km`}
                    </td>
                    <td>{results.heldKarp.error ? '-' : `${results.heldKarp.executionTime?.toFixed(3)} ms`}</td>
                    <td>{results.heldKarp.error ? '-' : results.heldKarp.pathsExplored}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Analysis Cards */}
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-icon">⚡</div>
                <h3>Fastest Algorithm</h3>
                <p className="analysis-value">
                  {(() => {
                    const times = {
                      nn: results.nearestNeighbour.error ? Infinity : results.nearestNeighbour.executionTime,
                      bf: results.bruteForce.error ? Infinity : results.bruteForce.executionTime,
                      dp: results.heldKarp.error ? Infinity : results.heldKarp.executionTime
                    };
                    const fastest = Object.entries(times).reduce((a, b) => a[1] < b[1] ? a : b);
                    return fastest[0] === 'nn' ? '🏃 Nearest Neighbour' : fastest[0] === 'bf' ? '💪 Brute Force' : '🧠 Held-Karp DP';
                  })()}
                </p>
              </div>

              <div className="analysis-card">
                <div className="analysis-icon">💰</div>
                <h3>Shortest Distance</h3>
                <p className="analysis-value">
                  {(() => {
                    const distances = {
                      nn: results.nearestNeighbour.error ? Infinity : results.nearestNeighbour.totalDistance,
                      bf: results.bruteForce.error ? Infinity : results.bruteForce.totalDistance,
                      dp: results.heldKarp.error ? Infinity : results.heldKarp.totalDistance
                    };
                    const cheapest = Object.entries(distances).reduce((a, b) => a[1] < b[1] ? a : b);
                    return cheapest[0] === 'nn' ? '🏃 Nearest Neighbour' : cheapest[0] === 'bf' ? '💪 Brute Force' : '🧠 Held-Karp DP';
                  })()}
                </p>
              </div>

              <div className="analysis-card">
                <div className="analysis-icon">🏆</div>
                <h3>Recommended</h3>
                <p className="analysis-value">
                  {results.heldKarp.error ? '🏃 Nearest Neighbour' : '🧠 Held-Karp DP'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="comparison-actions">
              <button className="btn btn-secondary" onClick={() => window.location.reload()}>
                🔄 Compare Again
              </button>
              <button className="btn btn-primary" onClick={() => navigate('/compute')}>
                🚀 Compute New Route
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AlgorithmComparison;
