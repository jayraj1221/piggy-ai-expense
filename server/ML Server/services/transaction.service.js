const { response } = require('express');
const axios = require('axios');
const PocketMoney = require('../models/PocketMoney');
const Transaction = require('../models/Transaction');


exports.handleAssignPocketMoney = async (req) => {
  try {
    const { childId, amount, parentId } = req.body;

    if (amount <= 0) {
      return { status: 400, data: { message: 'Amount must be greater than 0' } };
    }

    const pocketMoney = new PocketMoney({
      childId,
      amount,
      givenBy: parentId
    });

    await pocketMoney.save();
    
    const response = await axios.post('http://localhost:5000/auth/assign-pocket-money', {
      childId,
      amount
    });

    return {
      status: 201,
      data: {
        message: 'Pocket money assigned successfully',
        pocketMoney,
        child: response.data
      }
    };
    
  } catch (error) {
    console.error('Error assigning pocket money:', error);
    return { status: 500, data: { message: 'Server error' } };
  }
};


exports.handleSpendPocketMoney = async (req) => {
  const { childId, amount, type, category, description } = req.body;

  if (amount <= 0) {
    return { status: 400, data: { message: 'Amount must be greater than 0' } };
  }

  const transaction = new Transaction({
    childId,
    amount,
    type: type || 'expense',
    category,
    description
  });

  await transaction.save();
  
  const response = await axios.post('http://localhost:5000/auth/assign-pocket-money', {
    childId,
    amount : -1 * amount,
  });

  return {
    status: 201,
    data: {
      message: 'Transaction successful',
      transaction,
      child: response.data
    }
  };
};


exports.handleGetTransactionHistory = async (req) => {
  const { userId } = req.body;

  try {
    const transactions = await Transaction.find({ childId: userId });
    return { status: 200, data: transactions };
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return { status: 500, data: { message: 'Server error' } };
  }
}

exports.handleGetPocketMoneyHistory = async (req) => {
  const { userId } = req.body;

  try {
    const pocketMoneyHistory = await PocketMoney.find({ childId: userId });
    return { status: 200, data: pocketMoneyHistory };
  } catch (error) {
    console.error('Error fetching pocket money history:', error);
    return { status: 500, data: { message: 'Server error' } };
  }
}

// controllers/transactions.js

exports.handleGetMonthlySpent = async (req) => {
  const { userId } = req.query;

  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const transactions = await Transaction.find({
      childId: userId,
      createdAt: { $gte: firstDay, $lte: lastDay }
    });

    const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

    return { status: 200, data: { totalSpent } };
  } catch (error) {
    console.error('Error fetching monthly spent:', error);
    return { status: 500, data: { message: 'Server error' } };
  }
};

