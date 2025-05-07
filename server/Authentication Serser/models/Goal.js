// server/ML Server/models/Goal.js

const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  title: {
    type: String,
    required: true,
  },
  targetAmount: {
    type: Number,
    required: true,
  },
  savedAmount: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ['in progress', 'completed', 'cancelled'],
    default: 'in progress',
  },
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
