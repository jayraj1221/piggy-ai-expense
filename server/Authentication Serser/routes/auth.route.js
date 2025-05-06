const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { protect } = require('../middleware/authMiddleware');
const authController = require('../controllers/auth.controller');

router.post('/register/parent', authController.registerParent);
router.post('/register/child', protect, authController.registerChild);
router.post('/login', authController.loginUser);
router.post('/assign-pocket-money', authController.assignPocketMoney);
router.post('/get-user', authController.getUser);
router.get('/get-children', protect, authController.getChildren);
router.get('/user', protect, authController.getUserDetails);

module.exports = router;
