const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/auth.controller');
const goalController = require('../controllers/goal.controller');
const activityController = require('../controllers/activity.controller');

router.post('/register/parent', authController.registerParent);
router.post('/register/child', protect, authController.registerChild);
router.post('/login', authController.loginUser);
router.post('/assign-pocket-money', authController.assignPocketMoney);
router.post('/get-user', authController.getUser);
router.get('/get-children', protect, authController.getChildren);
router.get('/user', protect, authController.getUserDetails);
router.put('/update-tag-credit', authController.updateTagCredit);


router.post('/set-goal', protect, goalController.setGoal);
router.get('/get-goals', protect, goalController.getGoals);
router.put('/update-goal', protect, goalController.updateGoal);
router.get('/get-current-goal', protect, goalController.getCurrentGoal);


router.post('/add-activity', protect, activityController.addActivity);
router.get('/get-activities', protect, activityController.getActivities);

module.exports = router;
