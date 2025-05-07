const cron = require("node-cron");
const Transaction = require("./models/Transaction");
const PocketMoney = require("./models/PocketMoney");
const WeeklySummary = require("./models/weeklySummarySchema");
const { default: axios } = require("axios");

function assignTopCategory(spends) {
  let top = 'other';
  let max = 0;
  for (let cat in spends) {
    if (spends[cat] > max) {
      max = spends[cat];
      top = cat;
    }
  }
  return top;
}


async function generateWeeklySummaries() {
  const weekEnd = new Date();
  const weekStart = weekEnd.getDate() - 7;

  try {
    const childIdsFromTransactions = await Transaction.distinct("childId", {
      date: { $gte: weekStart, $lt: weekEnd }
    });

    const childIdsFromPocketMoney = await PocketMoney.distinct("childId", {
      date: { $gte: weekStart, $lt: weekEnd }
    });

    const allChildIds = [...new Set([...childIdsFromTransactions, ...childIdsFromPocketMoney])];

    for (const childId of allChildIds) {
      const transactions = await Transaction.find({
        childId,
        date: { $gte: weekStart, $lt: weekEnd }
      });

      const pocketMoneys = await PocketMoney.find({
        childId,
        date: { $gte: weekStart, $lt: weekEnd }
      });

      const totalIncomeFromTransactions = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      const totalIncomeFromPocketMoney = pocketMoneys.reduce((sum, p) => sum + p.amount, 0);
      const totalIncome = totalIncomeFromTransactions + totalIncomeFromPocketMoney;

      const savings = totalIncome - totalExpense;

      const noOfTransactions = transactions.length;
      const avgTransactionAmount = noOfTransactions > 0
        ? (transactions.reduce((sum, t) => sum + t.amount, 0) / noOfTransactions)
        : 0;

      const spends = {
        food: 0,
        education: 0,
        entertainment: 0,
        luxury: 0,
        donate: 0,
        other: 0,
      };

      for (const t of transactions) {
        if (t.type === 'expense') {
          if (spends.hasOwnProperty(t.category)) {
            spends[t.category] += t.amount;
          } else {
            spends.other += t.amount;
          }
        }
      }

      const topCategory = assignTopCategory(spends);

      const summary = new WeeklySummary({
        childId,
        weekStart,
        totalIncome,
        totalExpense,
        savings,
        noOfTransactions,
        avgTransactionAmount,
        donatedAmount: spends.donate,
        foodSpend: spends.food,
        educationSpend: spends.education,
        entertainmentSpend: spends.entertainment,
        luxurySpend: spends.luxury,
        otherSpend: spends.other,
        tag: 'Balanced',
        topCategory,
        creditScore: 50
      });

      const response = await axios.post("http://localhost:5000/flask/predict", {
        totalIncome,
        totalExpense,
        savings,
        noOfTransactions,
        avgTransactionAmount,
        donatedAmount: spends.donate,
        foodSpend: spends.food,
        educationSpend: spends.education,
        entertainmentSpend: spends.entertainment,
        luxurySpend: spends.luxury,
        otherSpend: spends.other,
        topCategory
      });

      summary.tag = response.data.predicted_tag;
      summary.creditScore = response.data.predicted_credit_score;

      await summary.save();

      return summary;
    }

    
    console.log("✅ Weekly summaries generated successfully.");
  } catch (err) {
    console.error("❌ Error generating weekly summaries:", err);
  }
}

function startWeeklySummaryCron() {
  // Every Monday at 00:05 AM
  cron.schedule("5 0 * * 1", async () => {
    console.log("🔄 [CRON] Running weekly summary generation...");
    await generateWeeklySummaries();
  });
}

module.exports = startWeeklySummaryCron;
module.exports.generateWeeklySummaries = generateWeeklySummaries;
