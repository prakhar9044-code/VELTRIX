import { Expense, Insight } from '../types';
import { calculateDailyScore, generatePredictions, getRegretAlerts } from '../lib/analytics';

export interface DailyScore {
  score: number;
  trend: 'up' | 'down';
  message: string;
}

export interface Prediction {
  forecast: number;
  risk: 'low' | 'high';
  insight: string;
}

export interface Alert {
  type: string;
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
}

export async function getDailyScore(expenses: Expense[]): Promise<DailyScore> {
  const result = calculateDailyScore(expenses);
  return {
    score: result.score,
    trend: result.trend as 'up' | 'down',
    message: result.message
  };
}

export async function getPredictions(expenses: Expense[]): Promise<Prediction> {
  const result = generatePredictions(expenses);
  if (!result) return { forecast: 0, risk: 'low', insight: "Gathering more data to forecast..." };
  return result as Prediction;
}

export async function getAlerts(expenses: Expense[]): Promise<Alert[]> {
  return getRegretAlerts(expenses);
}
