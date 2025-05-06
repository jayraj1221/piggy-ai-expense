const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.registerParent = async ({ name, email, password }) => {
    
  const existingUser = await User.findOne({ email });
  if (existingUser) throw { statusCode: 400, message: 'User already exists' };

  const parent = new User({ name, email, password, role: 'parent' });
  await parent.save();

  const token = generateToken(parent);

  return {
    message: 'Parent registered successfully',
    user: {
      id: parent._id,
      name: parent.name,
      email: parent.email,
      role: parent.role,
    },
    token,
  };
};

exports.registerChild = async ({ name, email, password }, parent) => {
  
  if (!parent || parent.role !== 'parent') {
    throw { statusCode: 400, message: 'Invalid parent ID' };
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) throw { statusCode: 400, message: 'Email already in use' };

  const child = new User({ name, email, password, role: 'child', parentId : parent._id });
  await child.save();

  const token = generateToken(child);

  return {
    message: 'Child registered successfully',
    user: {
      id: child._id,
      name: child.name,
      email: child.email,
      role: child.role,
      parentId: child.parentId,
    },
    token,
  };
};

exports.loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw { statusCode: 400, message: 'User not found' };

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw { statusCode: 401, message: 'Invalid credentials' };

  const token = generateToken(user);

  return {
    message: 'Login successful',
    user,
    token,
  };
};

exports.getUser = async ({ userId }) => {
  const user = await User.findById(userId).select('-password');
  if (!user) throw { statusCode: 404, message: 'User not found' };

  return user;
};


exports.assignPocketMoney = async ({ childId, amount }) => {

  const child = await User.findById(childId);
  if (!child) throw { statusCode: 404, message: 'Child not found' };

  child.pocketMoney += amount;
  await child.save();

  return {
    message: 'Pocket money assigned successfully',
    child
  };
};


exports.getChildren = async (parent) => {
  if (!parent || parent.role !== 'parent') {
    throw { statusCode: 400, message: 'Invalid parent ID' };
  }

  const children = await User.find({ parentId: parent._id }).select('-password');
  if (!children) throw { statusCode: 404, message: 'No children found' };

  return children;
};