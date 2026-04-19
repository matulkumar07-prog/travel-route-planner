import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminLogs = ({ adminToken }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [filterAlgo, setFilterAlgo] = useState('all');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page) => {
    try {
      const headers = { Authorization: `Bearer ${adminToken}` };
      const response = await axios.get(
        `http://localhost:5000/api/admin/logs/computations?page=${page}&limit=15`,
        { headers }
      );
      setLogs(response.data.logs);
      setPagination(response.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setLoading(false);
    }
  };

  const filteredLogs = filterAlgo === 'all' 
    ? logs 
    : logs.filter(log => log.algorithm === filterAlgo);

  if (loading) return <div className="loading">Loading activity logs...</div>;

  return (
    <div className="admin-section">
      <h2>📝 Activity Logs</h2>
      
      <div className="filter-section">
        <label>Filter by Algorithm:</label>
        <select value={filterAlgo} onChange={(e) => setFilterAlgo(e.target.value)}>
          <option value="all">All Algorithms</option>
          <option value="nearestNeighbour">🏃 Nearest Neighbour</option>
          <option value="bruteForce">💪 Brute Force</option>
          <option value="heldKarp">🧠 Held-Karp DP</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Algorithm</th>
              <th>Cities</th>
              <th>Distance</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id}>
                <td>
                  <strong>{log.userId?.username || 'Unknown'}</strong>
                  <br />
                  <small>{log.userId?.email}</small>
                </td>
                <td>
                  <span className="algorithm-badge">
                    {log.algorithm === 'nearestNeighbour' && '🏃 Nearest Neighbour'}
                    {log.algorithm === 'bruteForce' && '💪 Brute Force'}
                    {log.algorithm === 'heldKarp' && '🧠 Held-Karp'}
                  </span>
                </td>
                <td>{log.cities.length}</td>
                <td>{log.totalDistance.toFixed(2)} km</td>
                <td>
                  {new Date(log.computedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredLogs.length === 0 && (
        <div className="no-data">No logs found for the selected filter.</div>
      )}

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
  );
};

export default AdminLogs;
