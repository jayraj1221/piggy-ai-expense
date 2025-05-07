const goalService = require('../services/goal.service');

exports.setGoal = async (req, res) => {
    try {
        const result = await goalService.setGoal( req.body, req.user);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error setting goal:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
    }
    }

exports.getGoals = async (req, res) => {
    try {
        const result = await goalService.getGoals(req.user);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching goals:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
    }
}

exports.updateGoal = async (req, res) => {
    try {
        const { goalId, money } = req.body;
        console.log('Updating goal:', goalId, 'with money:', money);
        const result = await goalService.updateGoal(goalId, money, req.user);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error updating goal:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
    }
}

exports.getCurrentGoal = async (req, res) => {
    try {
        const result = await goalService.getCurrentGoal(req.user);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching current goals:', error);
        res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
    }
}