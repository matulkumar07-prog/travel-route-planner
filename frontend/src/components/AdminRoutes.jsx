import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminRoutes = ({ adminToken }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchRoutes(currentPage);
  }, [currentPage]);

  const fetchRoutes = async (page) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        `http://localhost:5000/api/admin/routes?page=${page}&limit=10`,
        { headers }
      );
      setRoutes(response.data.routes);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setLoading(false);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      await axios.delete(
        `http://localhost:5000/api/admin/routes/${routeId}`,
        { headers }
      );
      
      setDeleteConfirm(null);
      fetchRoutes(currentPage);
    } catch (err) {
      console.error('Error deleting route:', err);
      alert('Failed to delete route');
    }
  };

  if (loading) return <div className="loading">Loading routes...</div>;

  return (
    <div className="admin-section">
      <h2>🗺️ Route Management</h2>
      
      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Route Name</th>
              <th>User</th>
              <th>Algorithm</th>
              <th>Cities</th>
              <th>Distance</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((route) => (
              <tr key={route._id}>
                <td><strong>{route.routeName}</strong></td>
                <td>{route.userId.username}</td>
                <td>
                  <span className="algorithm-badge">
                    {route.algorithm === 'nearestNeighbour' && '🏃 Nearest Neighbour'}
                    {route.algorithm === 'bruteForce' && '💪 Brute Force'}
                    {route.algorithm === 'heldKarp' && '🧠 Held-Karp'}
                  </span>
                </td>
                <td>{route.cities.length}</td>
                <td>{route.totalDistance.toFixed(2)} km</td>
                <td>{new Date(route.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn-sm btn-error"
                    onClick={() => setDeleteConfirm(route._id)}
                  >
                    Delete
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

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Route?</h3>
            <p>Are you sure you want to delete this route? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-error"
                onClick={() => handleDeleteRoute(deleteConfirm)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoutes;
