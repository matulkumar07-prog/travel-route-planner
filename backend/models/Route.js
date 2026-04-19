const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    routeName: {
      type: String,
      required: true
    },
    cities: {
      type: [String],
      required: true
    },
    distanceMatrix: {
      type: [[Number]],
      required: true
    },
    algorithm: {
      type: String,
      enum: ['nearestNeighbour', 'bruteForce', 'heldKarp'],
      required: true
    },
    optimalPath: {
      type: [Number],
      required: true
    },
    totalDistance: {
      type: Number,
      required: true
    },
    executionTime: {
      type: Number,
      required: true
    },
    pathsExplored: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Route', routeSchema);
