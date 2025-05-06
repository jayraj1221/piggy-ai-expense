const {
    handleAssignPocketMoney,
    handleSpendPocketMoney,
    handleGetTransactionHistory,
    handleGetPocketMoneyHistory,
    handleGetMonthlySpent
} = require('../services/transaction.service');

exports.assignPocketMoney = async (req, res) => {
    try {
        const result = await handleAssignPocketMoney(req);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Assign error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.spendPocketMoney = async (req, res) => {
    try {
        const result = await handleSpendPocketMoney(req);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Spend error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getTransactionHistory = async (req, res) => {
    try {
        const result = await handleGetTransactionHistory(req);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Get transaction history error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

exports.getPocketMoneyHistory = async (req, res) => {
    try {
        const result = await handleGetPocketMoneyHistory(req);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Get pocket money history error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}


exports.getMonthlySpent = async (req, res) => {
    try {
        const result = await handleGetMonthlySpent(req);
        res.status(result.status).json(result.data);
    } catch (err) {
        console.error('Get monthly spent error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}
