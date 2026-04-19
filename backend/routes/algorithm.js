const express = require('express');
const Route = require('../models/Route');
const RouteHistory = require('../models/RouteHistory');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nearestNeighbour = require('../algorithms/nearestNeighbour');
const bruteForce = require('../algorithms/bruteForce');
const heldKarp = require('../algorithms/heldKarp');

const router = express.Router();

// COMPUTE ROUTE
router.post('/compute', auth, async (req, res) => {
  try {
    const { cities, distanceMatrix, algorithm } = req.body;

    // Validation
    if (!cities || !distanceMatrix || !algorithm) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (cities.length < 2) {
      return res.status(400).json({ message: 'Minimum 2 cities required' });
    }

    if (algorithm !== 'nearestNeighbour' && algorithm !== 'bruteForce' && algorithm !== 'heldKarp') {
      return res.status(400).json({ message: 'Invalid algorithm' });
    }

    let result;
    try {
      if (algorithm === 'nearestNeighbour') {
        result = nearestNeighbour(distanceMatrix);
      } else if (algorithm === 'bruteForce') {
        result = bruteForce(distanceMatrix);
      } else if (algorithm === 'heldKarp') {
        result = heldKarp(distanceMatrix);
      }
    } catch (algoError) {
      return res.status(400).json({ message: algoError.message });
    }

    // Save to history
    const history = new RouteHistory({
      userId: req.user.id,
      cities,
      algorithm,
      totalDistance: result.totalDistance
    });
    await history.save();

    // Update user's total computations
    await User.findByIdAndUpdate(
      req.user.id,
      { $inc: { totalComputations: 1 }, lastActive: new Date() }
    );

    res.json({
      message: 'Route computed successfully',
      result: {
        path: result.path,
        pathCities: result.path.map(i => cities[i]),
        totalDistance: result.totalDistance,
        executionTime: result.executionTime,
        pathsExplored: result.pathsExplored,
        algorithm: algorithm
      }
    });
  } catch (error) {
    console.error('Compute error:', error);
    res.status(500).json({ message: 'Server error computing route' });
  }
});

// SAVE ROUTE
router.post('/save', auth, async (req, res) => {
  try {
    const { routeName, cities, distanceMatrix, algorithm, optimalPath, totalDistance, executionTime, pathsExplored } = req.body;

    if (!routeName || !cities || !distanceMatrix || !algorithm) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const route = new Route({
      userId: req.user.id,
      routeName,
      cities,
      distanceMatrix,
      algorithm,
      optimalPath,
      totalDistance,
      executionTime,
      pathsExplored
    });

    await route.save();

    res.status(201).json({
      message: 'Route saved successfully',
      route: {
        id: route._id,
        routeName: route.routeName,
        totalDistance: route.totalDistance
      }
    });
  } catch (error) {
    console.error('Save route error:', error);
    res.status(500).json({ message: 'Server error saving route' });
  }
});

// GET SAVED ROUTES
router.get('/saved', auth, async (req, res) => {
  try {
    const routes = await Route.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({
      message: 'Saved routes fetched',
      routes: routes.map(r => ({
        id: r._id,
        routeName: r.routeName,
        cities: r.cities,
        algorithm: r.algorithm,
        totalDistance: r.totalDistance,
        executionTime: r.executionTime,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error fetching routes' });
  }
});

// DELETE SAVED ROUTE
router.delete('/saved/:id', auth, async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found' });
    }

    if (route.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this route' });
    }

    await Route.findByIdAndDelete(req.params.id);

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Server error deleting route' });
  }
});

// GET HISTORY
router.get('/history', auth, async (req, res) => {
  try {
    const history = await RouteHistory.find({ userId: req.user.id }).sort({ computedAt: -1 }).limit(50);
    res.json({
      message: 'History fetched',
      history: history.map(h => ({
        id: h._id,
        cities: h.cities,
        algorithm: h.algorithm,
        totalDistance: h.totalDistance,
        computedAt: h.computedAt
      }))
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Server error fetching history' });
  }
});

// GET STATISTICS
router.get('/stats', auth, async (req, res) => {
  try {
    const history = await RouteHistory.find({ userId: req.user.id });
    const savedRoutes = await Route.find({ userId: req.user.id });

    const stats = {
      totalComputations: history.length,
      totalSavedRoutes: savedRoutes.length,
      averageDistance: history.length > 0 ? (history.reduce((sum, h) => sum + h.totalDistance, 0) / history.length).toFixed(2) : 0,
      bestDistance: history.length > 0 ? Math.min(...history.map(h => h.totalDistance)) : 0,
      algorithmsUsed: {
        nearestNeighbour: history.filter(h => h.algorithm === 'nearestNeighbour').length,
        bruteForce: history.filter(h => h.algorithm === 'bruteForce').length,
        heldKarp: history.filter(h => h.algorithm === 'heldKarp').length
      }
    };

    res.json({
      message: 'Statistics fetched',
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error fetching statistics' });
  }
});

module.exports = router;
