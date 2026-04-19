import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AlgorithmForm from './components/AlgorithmForm';
import Results from './components/Results';
import SavedRoutes from './components/SavedRoutes';
import History from './components/History';
import Stats from './components/Stats';
import AlgorithmComparison from './components/AlgorithmComparison';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import Navbar from './components/Navbar';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    const savedAdminToken = localStorage.getItem('adminToken');
    const savedAdminData = localStorage.getItem('adminData');
    
    if (savedToken && savedUser) {
      setUser(JSON.parse(savedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
    }

    if (savedAdminToken && savedAdminData) {
      setAdmin(JSON.parse(savedAdminData));
    }

    setLoading(false);
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const handleAdminLogin = (adminData, adminToken) => {
    setAdmin(adminData);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    localStorage.setItem('adminToken', adminToken);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminToken');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register onRegister={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/compute" element={user ? <AlgorithmForm /> : <Navigate to="/login" />} />
        <Route path="/results" element={user ? <Results /> : <Navigate to="/login" />} />
        <Route path="/saved-routes" element={user ? <SavedRoutes /> : <Navigate to="/login" />} />
        <Route path="/history" element={user ? <History /> : <Navigate to="/login" />} />
        <Route path="/stats" element={user ? <Stats /> : <Navigate to="/login" />} />
        <Route path="/comparison" element={user ? <AlgorithmComparison /> : <Navigate to="/login" />} />
        <Route path="/admin-login" element={!admin ? <AdminLogin onAdminLogin={handleAdminLogin} /> : <Navigate to="/admin" />} />
        <Route 
          path="/admin" 
          element={admin ? (
            <AdminDashboard 
              admin={admin} 
              adminToken={localStorage.getItem('adminToken')} 
              onAdminLogout={handleAdminLogout} 
            />
          ) : (
            <Navigate to="/admin-login" />
          )} 
        />
      </Routes>
    </Router>
  );
}

export default App;
