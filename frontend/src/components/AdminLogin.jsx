import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = ({ onAdminLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/admin/login', {
        email,
        password
      });

      const { token, admin } = response.data;
      
      // Store admin token and data
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminData', JSON.stringify(admin));
      
      onAdminLogin(admin, token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h1>Admin Portal</h1>
          <p>Secure Access Only</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Verifying...' : 'Login to Admin Panel'}
          </button>
        </form>

        <div className="auth-footer">
          <p><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>← Back to Home</a></p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
