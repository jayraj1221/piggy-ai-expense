const Activity = require('../models/activity');
const User = require('../models/User');
const axios = require('axios');

exports.getActivities = async (user) => {

    try {
        // last five activities of today
        const today = new Date();
        const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
        const activities = await Activity.find({
            userId: user._id,
            createdAt: {
                $gte: startOfToday,
                $lt: endOfToday
            }
        });
        return activities;
    } catch (error) {
        console.log('Error retrieving activities: ' + error.message);
    }
}

exports.addActivity = async (user, activity) => {

    try {
        const response = await axios.post('http://localhost:5000/flask/reward', {
            "activity": activity,
        });

        const newActivity = new Activity({
            userId: user._id,
            activity,
            reward: Math.floor(response.data.predicted_reward),
        });

        await newActivity.save();

        user.pocketMoney += Math.floor(response.data.predicted_reward);
        await user.save();

        return newActivity;
    } catch (error) {
        console.log('Error adding activity: ' + error.message);
    }
}