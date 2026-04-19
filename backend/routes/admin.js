const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const User = require('../models/User');
const Route = require('../models/Route');
const RouteHistory = require('../models/RouteHistory');
const { adminAuth, checkPermission } = require('../middleware/adminAuth');

const router = express.Router();

// ==================== ADMIN AUTH ====================

// ADMIN LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Find admin with password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({ message: 'Admin account is inactive' });
    }

    // Check if admin is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      return res.status(401).json({ message: 'Account locked. Try again later.' });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password);
    if (!isMatch) {
      admin.loginAttempts += 1;
      if (admin.loginAttempts >= 5) {
        admin.lockedUntil = new Date(Date.now() + 30 * 60000); // 30 minutes
      }
      await admin.save();
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Admin login successful',
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// ADMIN LOGOUT (Just for frontend)
router.post('/logout', adminAuth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// ==================== USER MANAGEMENT ====================

// GET ALL USERS
router.get('/users', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    res.json({
      users,
      pagination: {
        total: totalUsers,
        page: parseInt(page),
        pages: Math.ceil(totalUsers / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// GET USER DETAILS
router.get('/users/:userId', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const computations = await RouteHistory.countDocuments({ userId: req.params.userId });
    const savedRoutes = await Route.countDocuments({ userId: req.params.userId });

    res.json({
      user,
      stats: {
        computations,
        savedRoutes
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// DEACTIVATE USER
router.put('/users/:userId/deactivate', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'inactive' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deactivated', user });
  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({ message: 'Error deactivating user' });
  }
});

// BAN USER
router.put('/users/:userId/ban', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'banned', flaggedForFraud: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User banned', user });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Error banning user' });
  }
});

// REACTIVATE USER
router.put('/users/:userId/reactivate', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { status: 'active', flaggedForFraud: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User reactivated', user });
  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({ message: 'Error reactivating user' });
  }
});

// ==================== ROUTES MANAGEMENT ====================

// GET ALL SAVED ROUTES
router.get('/routes', adminAuth, checkPermission('manageRoutes'), async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const routes = await Route.find()
      .populate('userId', 'username email')
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalRoutes = await Route.countDocuments();

    res.json({
      routes,
      pagination: {
        total: totalRoutes,
        page: parseInt(page),
        pages: Math.ceil(totalRoutes / limit)
      }
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Error fetching routes' });
  }
});

// DELETE ROUTE
router.delete('/routes/:routeId', adminAuth, checkPermission('manageRoutes'), async (req, res) => {
  try {
    const route = await Route.findByIdAndDelete(req.params.routeId);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Error deleting route' });
  }
});

// ==================== STATISTICS ====================

// GET SYSTEM STATISTICS
router.get('/stats/system', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const inactiveUsers = await User.countDocuments({ status: 'inactive' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });

    const totalRoutes = await Route.countDocuments();
    const totalComputations = await RouteHistory.countDocuments();

    const algorithmUsage = await RouteHistory.aggregate([
      {
        $group: {
          _id: '$algorithm',
          count: { $sum: 1 },
          avgDistance: { $avg: '$totalDistance' }
        }
      }
    ]);

    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        banned: bannedUsers
      },
      routes: {
        total: totalRoutes,
        totalComputations
      },
      algorithmUsage
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// GET USER STATISTICS
router.get('/stats/users/:userId', adminAuth, checkPermission('manageUsers'), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const computations = await RouteHistory.countDocuments({ userId: req.params.userId });
    const savedRoutes = await Route.countDocuments({ userId: req.params.userId });

    const algorithmUsage = await RouteHistory.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $group: {
          _id: '$algorithm',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      user: {
        username: user.username,
        email: user.email,
        status: user.status
      },
      stats: {
        computations,
        savedRoutes,
        algorithmUsage
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ message: 'Error fetching user statistics' });
  }
});

// ==================== ACTIVITY LOGS ====================

// GET COMPUTATION HISTORY
router.get('/logs/computations', adminAuth, checkPermission('viewLogs'), async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const logs = await RouteHistory.find()
      .populate('userId', 'username email')
      .limit(limit)
      .skip(skip)
      .sort({ computedAt: -1 });

    const totalLogs = await RouteHistory.countDocuments();

    res.json({
      logs,
      pagination: {
        total: totalLogs,
        page: parseInt(page),
        pages: Math.ceil(totalLogs / limit)
      }
    });
  } catch (error) {
    console.error('Get computation logs error:', error);
    res.status(500).json({ message: 'Error fetching logs' });
  }
});

// ==================== SETTINGS ====================

// GET ADMIN SETTINGS
router.get('/settings', adminAuth, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json({
      admin: {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        isActive: admin.isActive,
        lastLogin: admin.lastLogin
      }
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Error fetching settings' });
  }
});

// CHANGE ADMIN PASSWORD
router.put('/settings/change-password', adminAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Please provide current and new password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');
    const isMatch = await admin.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    admin.password = newPassword;
    await admin.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Error changing password' });
  }
});

module.exports = router;
