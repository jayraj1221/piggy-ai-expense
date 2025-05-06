const mongoose = require('mongoose');

const pocketMoneySchema = new mongoose.Schema({
  childId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  amount: Number,
  givenBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PocketMoney", pocketMoneySchema);
