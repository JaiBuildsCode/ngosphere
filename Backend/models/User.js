const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true, // Prevents duplicate accounts
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'ngo'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
  ,
  refreshTokenHash: {
    type: String,
    default: null
  }
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);