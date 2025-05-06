const mongoose = require('mongoose');

const weeklySummarySchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  weekStart: { type: Date, required: true },
  totalIncome: { type: Number, required: true },
  totalExpense: { type: Number, required: true },
  savings: { type: Number, required: true },
  noOfTransactions: { type: Number, required: true },
  avgTransactionAmount: { type: Number, required: true },
  foodSpend: { type: Number, default: 0 },
  educationSpend: { type: Number, default: 0 },
  entertainmentSpend: { type: Number, default: 0 },
  luxurySpend: { type: Number, default: 0 },
  otherSpend: { type: Number, default: 0 },
  tag: { type: String, enum: ['Saver', 'Spender', 'Balanced'], required: true },
  creditScore: { type: Number, min: 0, max: 100, required: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("WeeklySummary", weeklySummarySchema);