const mongoose = require('mongoose'); 
const { Schema } = mongoose; 

const activitySchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true 
    },
    activity: {
      type: String,
      required: true,
    },
    reward : {
        type: Number,
        default: 0
    }
  },
  { timestamps: true } 
);




const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
