import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AlgorithmForm = () => {
  const [cities, setCities] = useState(['City 1']);
  const [algorithm, setAlgorithm] = useState('nearestNeighbour');
  const [distanceMatrix, setDistanceMatrix] = useState([]);
  const [loading, setLoading] = useState(false);
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

  const handleCompute = async () => {
    setError('');

    // Validate inputs
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
      const response = await axios.post('http://localhost:5000/api/algorithm/compute', {
        cities,
        distanceMatrix,
        algorithm
      });

      // Store result in sessionStorage for Results page
      sessionStorage.setItem('lastResult', JSON.stringify(response.data.result));
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'Computation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="algorithm-form-container">
      <div className="container">
        <div className="form-card">
          <h1>🚀 Compute TSP Route</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
            Enter your cities and distance matrix to find the optimal route
          </p>

          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Cities Section */}
          <div className="form-section">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              📍 Cities
              <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>
                ({cities.length} cities)
              </span>
            </h2>
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
                    <button 
                      className="btn-remove" 
                      onClick={() => handleRemoveCity(index)}
                      title="Remove city"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={handleAddCity}>
              ➕ Add City
            </button>
          </div>

          {/* Distance Matrix Section */}
          <div className="form-section">
            <h2 style={{ marginBottom: '16px' }}>📏 Distance Matrix (km)</h2>
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
            <p style={{ fontSize: '12px', color: 'var(--text-tertiary)', marginTop: '12px' }}>
              💡 Tip: Distance from a city to itself (diagonal) is always 0
            </p>
          </div>

          {/* Algorithm Selection Section */}
          <div className="form-section">
            <h2 style={{ marginBottom: '16px' }}>⚙️ Select Algorithm</h2>
            <div className="algorithm-options">
              <label className="algo-option">
                <input
                  type="radio"
                  value="nearestNeighbour"
                  checked={algorithm === 'nearestNeighbour'}
                  onChange={(e) => setAlgorithm(e.target.value)}
                />
                <div className="algo-option-content">
                  <span className="algo-title">Nearest Neighbour</span>
                  <span className="algo-desc">Fast heuristic • ~70-80% optimal • Unlimited cities</span>
                </div>
              </label>

              <label className="algo-option">
                <input
                  type="radio"
                  value="bruteForce"
                  checked={algorithm === 'bruteForce'}
                  onChange={(e) => setAlgorithm(e.target.value)}
                />
                <div className="algo-option-content">
                  <span className="algo-title">Brute Force</span>
                  <span className="algo-desc">Guaranteed optimal • Maximum 8 cities</span>
                </div>
              </label>

              <label className="algo-option">
                <input
                  type="radio"
                  value="heldKarp"
                  checked={algorithm === 'heldKarp'}
                  onChange={(e) => setAlgorithm(e.target.value)}
                />
                <div className="algo-option-content">
                  <span className="algo-title">Held-Karp DP</span>
                  <span className="algo-desc">Optimal solution • Maximum 20 cities</span>
                </div>
              </label>
            </div>
          </div>

          {/* Compute Button */}
          <button 
            className="btn btn-primary compute-button" 
            onClick={handleCompute} 
            disabled={loading}
            style={{ marginTop: '32px' }}
          >
            {loading ? '⏳ Computing...' : '🚀 Compute Optimal Route'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmForm;
