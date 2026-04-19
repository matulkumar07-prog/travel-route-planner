const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      default: 'admin',
      enum: ['admin', 'superadmin']
    },
    permissions: {
      manageUsers: { type: Boolean, default: true },
      manageRoutes: { type: Boolean, default: true },
      viewLogs: { type: Boolean, default: true },
      editSettings: { type: Boolean, default: false }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
      type: Date
    },
    loginAttempts: {
      type: Number,
      default: 0
    },
    lockedUntil: {
      type: Date
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
