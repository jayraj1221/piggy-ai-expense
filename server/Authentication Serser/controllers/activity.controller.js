const activityService = require('../services/activity.service');

exports.getActivities = async (req, res) => {
    try {
        const activities = await activityService.getActivities(req.user);
        res.status(200).json(activities);
    } catch (error) {
        console.error('Error retrieving activities:', error);
        res.status(500).json({ message: 'Error retrieving activities', error });
    }
}

exports.addActivity = async (req, res) => {
    try {
        const { activity } = req.body;
        if (!activity) {
            return res.status(400).json({ message: 'Activity is required' });
        }
        const newActivity = await activityService.addActivity(req.user, activity);
        res.status(201).json(newActivity);
    } catch (error) {
        res.status(500).json({ message: 'Error adding activity', error });
    }
}