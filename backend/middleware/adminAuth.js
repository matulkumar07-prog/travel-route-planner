const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const adminAuth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Remove "Bearer " from token
    const actualToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verify token
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    
    // Find admin and check if active
    const admin = await Admin.findById(decoded.id);
    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: 'Admin account is not active' });
    }

    req.admin = decoded;
    req.adminData = admin;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Middleware to check specific permissions
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.adminData.permissions[permission] && req.adminData.role !== 'superadmin') {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};

module.exports = { adminAuth, checkPermission };
