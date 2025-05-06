const cron = require("node-cron");
const Transaction = require("./models/Transaction");
const PocketMoney = require("./models/PocketMoney");
const WeeklySummary = require("./models/weeklySummarySchema");

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

function assignTag(savingsRate, expenseRatio, donatedRatio) {
  if (savingsRate >= 0.5 && donatedRatio >= 0.05) return "Top Saver";
  if (savingsRate >= 0.3) return "Average Saver";
  if (expenseRatio <= 0.8) return "Balanced";
  if (expenseRatio > 1) return "Overspender";
  return "Big Spender";
}

function generateCreditScore(tag) {
  switch (tag) {
    case "Top Saver": return Math.floor(Math.random() * 16) + 85;
    case "Average Saver": return Math.floor(Math.random() * 21) + 70;
    case "Balanced": return Math.floor(Math.random() * 26) + 60;
    case "Big Spender": return Math.floor(Math.random() * 31) + 45;
    case "Overspender": return Math.floor(Math.random() * 31) + 30;
  }
}

async function generateWeeklySummaries() {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - 7);
  startOfWeek.setHours(0, 0, 0, 0);

  const transactions = await Transaction.find({
    date: { $gte: startOfWeek, $lte: now },
  });

  const pocketMoneys = await PocketMoney.find({
    date: { $gte: startOfWeek, $lte: now },
  });

  const childIds = new Set([
    ...transactions.map(t => t.childId.toString()),
    ...pocketMoneys.map(p => p.childId.toString()),
  ]);

  for (const childId of childIds) {
    const txs = transactions.filter(t => t.childId.toString() === childId);
    const income = pocketMoneys
      .filter(p => p.childId.toString() === childId)
      .reduce((sum, p) => sum + p.amount, 0);

    const expenses = txs.filter(t => t.type === "expense");
    const foodSpend = expenses.filter(t => t.category === 'food').reduce((sum, e) => sum + e.amount, 0);
    const educationSpend = expenses.filter(t => t.category === 'education').reduce((sum, e) => sum + e.amount, 0);
    const entertainmentSpend = expenses.filter(t => t.category === 'entertainment').reduce((sum, e) => sum + e.amount, 0);
    const luxurySpend = expenses.filter(t => t.category === 'luxury').reduce((sum, e) => sum + e.amount, 0);
    const otherSpend = expenses.filter(t => t.category === 'other').reduce((sum, e) => sum + e.amount, 0);
    const donatedAmount = txs.filter(t => t.description?.toLowerCase().includes("donate")).reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = foodSpend + educationSpend + entertainmentSpend + luxurySpend + otherSpend + donatedAmount;
    const savings = income - totalExpense;
    const noOfTransactions = txs.length;
    const avgTransactionAmount = noOfTransactions ? totalExpense / noOfTransactions : 0;
    const topCategory = assignTopCategory({
      food: foodSpend,
      education: educationSpend,
      entertainment: entertainmentSpend,
      luxury: luxurySpend,
      donation: donatedAmount,
      other: otherSpend,
    });

    const savingsRate = income ? savings / income : 0;
    const expenseRatio = income ? totalExpense / income : 0;
    const donatedRatio = income ? donatedAmount / income : 0;
    const tag = assignTag(savingsRate, expenseRatio, donatedRatio);
    const creditScore = generateCreditScore(tag);

    // Use upsert to avoid duplicate summaries
    await WeeklySummary.findOneAndUpdate(
      { childId, weekStart: startOfWeek },
      {
        childId,
        weekStart: startOfWeek,
        totalIncome: income,
        totalExpense,
        savings,
        noOfTransactions,
        avgTransactionAmount,
        donatedAmount,
        foodSpend,
        educationSpend,
        entertainmentSpend,
        luxurySpend,
        otherSpend,
        tag,
        topCategory,
        creditScore,
      },
      { upsert: true, new: true }
    );

    console.log(`✅ Weekly summary updated/created for childId: ${childId}`);
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
