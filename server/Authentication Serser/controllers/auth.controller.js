const authService = require('../services/auth.service');

exports.registerParent = async (req, res) => {
  try {
    console.log('Registering parent with data:', req.body);
    const result = await authService.registerParent(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error registering parent:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.registerChild = async (req, res) => {
  try {
    const result = await authService.registerChild(req.body, req.user);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error registering child:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Login error:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await authService.getUser(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};


exports.assignPocketMoney = async (req, res) => {
  try {
    const result = await authService.assignPocketMoney(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error('Error assigning pocket money:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.getChildren = async (req, res) => {
  try {
    const result = await authService.getChildren(req.user);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching children:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
}

exports.getUserDetails = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
};

exports.updateTagCredit = async (req, res) => {
  try {
    const result = await authService.updateTagCredit(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error updating tag credit:', error);
    res.status(error.statusCode || 500).json({ message: error.message || 'Server error' });
  }
}
