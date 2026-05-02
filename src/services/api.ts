import { Expense, Insight } from '../types';

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
  const res = await fetch('/api/analytics/score', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenses })
  });
  return res.json();
}

export async function getPredictions(expenses: Expense[]): Promise<Prediction> {
  const res = await fetch('/api/analytics/predictions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenses })
  });
  return res.json();
}

export async function getAlerts(expenses: Expense[]): Promise<Alert[]> {
  const res = await fetch('/api/analytics/alerts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ expenses })
  });
  const data = await res.json();
  return data.alerts;
}
