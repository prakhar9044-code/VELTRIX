import { Expense } from '../types';

export function calculateDailyScore(expenses: Expense[]) {
  const now = new Date();
  const today = now.toDateString();
  const todayExpenses = expenses.filter(e => new Date(e.timestamp).toDateString() === today);
  const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);

  // Average daily spend over the last 14 days
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const historicExpenses = expenses.filter(e => new Date(e.timestamp) >= twoWeeksAgo && new Date(e.timestamp).toDateString() !== today);
  
  const dailyAverages: Record<string, number> = {};
  historicExpenses.forEach(e => {
    const day = new Date(e.timestamp).toDateString();
    dailyAverages[day] = (dailyAverages[day] || 0) + e.amount;
  });

  const avgSpend = Object.values(dailyAverages).length > 0
    ? Object.values(dailyAverages).reduce((a, b) => a + b, 0) / Object.values(dailyAverages).length
    : 1000; // Default baseline if no history

  let score = 100;
  if (todayTotal > avgSpend) {
    // Penalty for exceeding baseline
    score = Math.max(20, 100 - ((todayTotal - avgSpend) / (avgSpend * 0.5)) * 40);
  } else if (todayTotal === 0) {
    score = 100;
  } else {
    // Bonus for staying under baseline
    score = Math.min(100, 85 + ((avgSpend - todayTotal) / avgSpend) * 15);
  }

  return {
    score: Math.round(score),
    trend: todayTotal > avgSpend ? 'down' : 'up',
    message: score > 85 ? "Excellent Capital Control" : score > 60 ? "Stable Velocity" : "High Outflow Alert",
    todayTotal,
    avgSpend
  };
}

export function generatePredictions(expenses: Expense[]) {
  if (expenses.length < 5) return null;

  const weekTotal = expenses.slice(0, 10).reduce((sum, e) => sum + e.amount, 0);
  const velocity = weekTotal / 10; // average per transaction recorded
  
  const forecast = weekTotal * 1.4; // rough monthly extrapolation
  
  return {
    forecast,
    risk: forecast > 15000 ? 'high' : 'low',
    insight: forecast > 15000 
      ? `Velocity alert: Monthly trajectory exceeds your ₹15k baseline.`
      : "Spending velocity is healthy. Expected monthly burn under ₹15k."
  };
}

export function getRegretAlerts(expenses: Expense[]) {
  const alerts: any[] = [];
  
  // Rule 1: High frequency in one category in short time
  const recent = expenses.slice(0, 10);
  const categories: Record<string, number> = {};
  recent.forEach(e => {
    categories[e.category] = (categories[e.category] || 0) + 1;
  });

  Object.entries(categories).forEach(([cat, count]) => {
    if (count >= 3) {
      alerts.push({
        type: 'frequency',
        title: 'Impulse Detected',
        message: `You've logged ${cat} ${count} times recently. High frequency alerts active.`,
        severity: 'medium'
      });
    }
  });

  // Rule 2: Large unusual expense
  const average = expenses.length > 0 ? expenses.reduce((s, e) => s + e.amount, 0) / expenses.length : 0;
  if (expenses.length > 0 && expenses[0].amount > average * 3) {
    alerts.push({
      type: 'value',
      title: 'Wealth Erosion',
      message: `${expenses[0].description} is 3x higher than your average ticket size.`,
      severity: 'high'
    });
  }

  return alerts;
}
