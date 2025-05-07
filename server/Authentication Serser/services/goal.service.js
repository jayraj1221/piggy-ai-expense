const Goal = require('../models/Goal');
const User = require('../models/User');

exports.setGoal = async ( goal, user) => {
    try {
        console.log('Setting goal for user:', user._id, 'Goal:', goal);
        const newGoal = new Goal({
            title: goal.title,
            targetAmount: goal.targetAmount,
            currentAmount: goal.currentAmount,
            deadline: goal.deadline,
            userId: user._id,
        });
        await newGoal.save();
        return { message: 'Goal set successfully', goal: newGoal };
    } catch (error) {
        console.error('Error setting goal:', error);
        throw { statusCode: 500, message: 'Error setting goal' };
    }
}

exports.getGoals = async (user) => {
    try {
        const goals = await Goal.find({ userId: user._id, status: 'Completed' });
        return { message: 'Goals fetched successfully', goals };
    } catch (error) {
        console.error('Error fetching goals:', error);
        throw { statusCode: 500, message: 'Error fetching goals' };
    }
}


exports.updateGoal = async (goalId, money, user) => {
    try {

        const goal = await Goal.findOneAndUpdate(
            { _id: goalId, userId: user._id },
            { $inc: { currentAmount: money } },
            { new: true }
        );
        
        if (!goal) {
            throw { statusCode: 404, message: 'Goal not found' };
        }

        if(goal.currentAmount >= goal.targetAmount) {
            goal.status = 'Completed';
            await goal.save();
        }

        user.pocketMoney -= money;
        await user.save();

        return { message: 'Goal updated successfully', goal };
    } catch (error) {
        console.error('Error updating goal:', error);
        throw { statusCode: 500, message: 'Error updating goal' };
    }
}

exports.getCurrentGoal = async (user) => {
    try {
        const goals = await Goal.find({ userId: user._id, status: 'In Progress' });

        for (const goal of goals) {
            if (new Date(goal.deadline).getTime() < Date.now()) {
                goal.status = 'Expired';
                await goal.save(); 
            }
        }

        const currentGoals = goals.filter(goal => goal.status === 'In Progress');

        if (currentGoals.length === 0) {
            return { message: 'No current goals found', goals: [] };
        }

        return { message: 'Current goals fetched successfully', goals: currentGoals };
    } catch (error) {
        console.error('Error fetching goals:', error);
        throw { statusCode: 500, message: 'Error fetching goals' };
    }
};


