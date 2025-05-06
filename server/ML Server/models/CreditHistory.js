const creditHistorySchema = new mongoose.Schema({
    childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    month: String, // "May 2025"
    totalPocketMoney: Number,
    totalExpenses: Number,
    savings: Number,
    numTransactions: Number,
    tag: String, // e.g., "Good Saver"
    creditScore: Number,
    calculatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("CreditHistory", creditHistorySchema);
