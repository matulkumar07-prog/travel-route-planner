import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminSettings = ({ adminToken }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        'http://localhost:5000/api/admin/settings',
        { headers }
      );
      setAdmin(response.data.admin);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError('Failed to load settings');
      setLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      await axios.put(
        'http://localhost:5000/api/admin/settings/change-password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers }
      );

      setMessage('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (loading) return <div className="loading">Loading settings...</div>;

  return (
    <div className="admin-section">
      <h2>⚙️ Admin Settings</h2>

      <div className="settings-container">
        <div className="settings-card">
          <h3>Account Information</h3>
          <div className="setting-item">
            <label>Username:</label>
            <p className="setting-value">{admin?.username}</p>
          </div>
          <div className="setting-item">
            <label>Email:</label>
            <p className="setting-value">{admin?.email}</p>
          </div>
          <div className="setting-item">
            <label>Role:</label>
            <p className="setting-value">
              <span className="badge badge-info">{admin?.role?.toUpperCase()}</span>
            </p>
          </div>
          <div className="setting-item">
            <label>Last Login:</label>
            <p className="setting-value">
              {admin?.lastLogin 
                ? new Date(admin.lastLogin).toLocaleString()
                : 'Never logged in'}
            </p>
          </div>
        </div>

        <div className="settings-card">
          <h3>Permissions</h3>
          <div className="permissions-grid">
            <div className="permission-item">
              <span className="permission-name">Manage Users</span>
              <span className={`permission-status ${admin?.permissions?.manageUsers ? 'enabled' : 'disabled'}`}>
                {admin?.permissions?.manageUsers ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="permission-item">
              <span className="permission-name">Manage Routes</span>
              <span className={`permission-status ${admin?.permissions?.manageRoutes ? 'enabled' : 'disabled'}`}>
                {admin?.permissions?.manageRoutes ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="permission-item">
              <span className="permission-name">View Logs</span>
              <span className={`permission-status ${admin?.permissions?.viewLogs ? 'enabled' : 'disabled'}`}>
                {admin?.permissions?.viewLogs ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
            <div className="permission-item">
              <span className="permission-name">Edit Settings</span>
              <span className={`permission-status ${admin?.permissions?.editSettings ? 'enabled' : 'disabled'}`}>
                {admin?.permissions?.editSettings ? '✓ Enabled' : '✗ Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="settings-card">
          <h3>Change Password</h3>
          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleChangePassword} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password (min 6 characters)"
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                required
              />
            </div>

            <button type="submit" className="btn-primary">
              Update Password
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h3>System Information</h3>
          <div className="setting-item">
            <label>Application Version:</label>
            <p className="setting-value">1.0.0</p>
          </div>
          <div className="setting-item">
            <label>API Status:</label>
            <p className="setting-value">
              <span className="badge badge-success">✓ Active</span>
            </p>
          </div>
          <div className="setting-item">
            <label>Database Status:</label>
            <p className="setting-value">
              <span className="badge badge-success">✓ Connected</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
