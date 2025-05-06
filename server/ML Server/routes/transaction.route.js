const express = require('express');
const router = express.Router();

const {
  assignPocketMoney,
  spendPocketMoney,
  getTransactionHistory,
  getPocketMoneyHistory,
  getMonthlySpent
} = require('../controllers/transaction.controller');


router.post('/assign', assignPocketMoney);
router.post('/spend', spendPocketMoney);
router.post('/getTransactionHistory', getTransactionHistory);
router.post('/getPocketMoneyHistory', getPocketMoneyHistory);
router.get('/getMonthlySpent', getMonthlySpent);

module.exports = router;
