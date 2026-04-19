const mongoose = require('mongoose');

const routeHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    routeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route'
    },
    cities: {
      type: [String],
      required: true
    },
    algorithm: {
      type: String,
      enum: ['nearestNeighbour', 'bruteForce', 'heldKarp'],
      required: true
    },
    totalDistance: {
      type: Number,
      required: true
    },
    computedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RouteHistory', routeHistorySchema);
