const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goalSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true 
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['In Progress', 'Completed', 'Expired'],
    default: 'In Progress'
  },
  deadline: {
    type: Date,
    default: null
  }
}, { 
  timestamps: true 
});

const Goal = mongoose.model('Gaol', goalSchema);

module.exports = Goal;