import ai, { INSIGHT_AGENT_SYSTEM_INSTRUCTION } from '../lib/gemini';
import { collection, addDoc, query, where, getDocs, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Expense } from '../types';

export async function generateWeeklyInsight(userId: string, expenses: Expense[]) {
  if (expenses.length < 3) return null;

  const expenseData = expenses.slice(0, 10).map(e => ({
    description: e.description,
    amount: e.amount,
    category: e.category,
    date: e.date
  }));

  const prompt = `Analyze these recent expenses for user ${userId}: ${JSON.stringify(expenseData)}. Provide a helpful coaching nudge or leak detection alert.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: INSIGHT_AGENT_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text);
    
    // Save to Firestore
    const insightsPath = `users/${userId}/insights`;
    await addDoc(collection(db, insightsPath), {
      userId,
      type: parsed.type || 'coaching_nudge',
      title: parsed.title || 'Personal Insight',
      content: parsed.content || 'Your spending looks consistent this week.',
      timestamp: new Date().toISOString(),
      read: false
    });

    return parsed;
  } catch (error) {
    console.error("Insight Generation Error:", error);
    return null;
  }
}
