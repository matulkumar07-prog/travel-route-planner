import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = ({ adminToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        `http://localhost:5000/api/admin/users?page=${page}&limit=10`,
        { headers }
      );
      setUsers(response.data.users);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        `http://localhost:5000/api/admin/users/${userId}`,
        { headers }
      );
      setUserDetails(response.data);
      setSelectedUser(userId);
    } catch (err) {
      console.error('Error fetching user details:', err);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const endpoint = `http://localhost:5000/api/admin/users/${userId}/${action}`;
      
      await axios.put(endpoint, {}, { headers });
      
      // Refresh users list
      fetchUsers(currentPage);
      setSelectedUser(null);
      setUserDetails(null);
    } catch (err) {
      console.error(`Error performing ${action}:`, err);
      alert(`Failed to ${action} user`);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="admin-section">
      <h2>👥 User Management</h2>
      
      <div className="content-grid">
        <div className="users-list-container">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className={`status-${user.status}`}>
                    <td><strong>{user.username}</strong></td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge badge-${user.status}`}>
                        {user.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-sm btn-info"
                        onClick={() => fetchUserDetails(user._id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ← Previous
            </button>
            <span>Page {pagination.page} of {pagination.pages}</span>
            <button
              disabled={currentPage === pagination.pages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        </div>

        {selectedUser && userDetails && (
          <div className="user-details-panel">
            <h3>User Details</h3>
            <div className="details-card">
              <div className="detail-row">
                <span className="label">Username:</span>
                <span className="value">{userDetails.user.username}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{userDetails.user.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`badge badge-${userDetails.user.status}`}>
                  {userDetails.user.status.toUpperCase()}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Computations:</span>
                <span className="value">{userDetails.stats.computations}</span>
              </div>
              <div className="detail-row">
                <span className="label">Saved Routes:</span>
                <span className="value">{userDetails.stats.savedRoutes}</span>
              </div>
              <div className="detail-row">
                <span className="label">Joined:</span>
                <span className="value">
                  {new Date(userDetails.user.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="action-buttons">
                {userDetails.user.status === 'active' && (
                  <>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => handleUserAction(selectedUser, 'deactivate')}
                    >
                      Deactivate
                    </button>
                    <button
                      className="btn-error btn-sm"
                      onClick={() => handleUserAction(selectedUser, 'ban')}
                    >
                      Ban
                    </button>
                  </>
                )}
                {(userDetails.user.status === 'inactive' || userDetails.user.status === 'banned') && (
                  <button
                    className="btn-success btn-sm"
                    onClick={() => handleUserAction(selectedUser, 'reactivate')}
                  >
                    Reactivate
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
