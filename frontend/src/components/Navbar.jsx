import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand" onClick={() => navigate('/dashboard')}>
          🗺️ TravelGraph
        </div>

        <div className="nav-menu">
          <button className="nav-link" onClick={() => navigate('/dashboard')}>Dashboard</button>
          <button className="nav-link" onClick={() => navigate('/compute')}>Compute</button>
          <button className="nav-link" onClick={() => navigate('/comparison')}>⚖️ Compare</button>
          <button className="nav-link" onClick={() => navigate('/saved-routes')}>Saved</button>
          <button className="nav-link" onClick={() => navigate('/history')}>History</button>
          <button className="nav-link" onClick={() => navigate('/stats')}>Stats</button>
        </div>

        <div className="nav-user">
          <span className="user-avatar">{user?.avatar}</span>
          <span className="user-name">{user?.username}</span>
          <button className="btn-logout" onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
