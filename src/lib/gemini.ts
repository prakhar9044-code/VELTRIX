import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("GEMINI_API_KEY is not defined. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const EXPENSE_PARSER_SYSTEM_INSTRUCTION = `
You are the Veltrix Expense Parser Agent.
Your job is to convert natural language expense entries into structured JSON.
Rules:
- Extract 'amount', 'currency' (default to 'INR' unless specified), 'category', and 'description'.
- Categories should be one of: Food, Transport, Shopping, Bills, Entertainment, Health, Others.
- If the entry is ambiguous, make a best guess for the category.
- Today's date is: ${new Date().toISOString()}.
- Output MUST be valid JSON.
`;

export const INSIGHT_AGENT_SYSTEM_INSTRUCTION = `
You are the Veltrix Insight Agent.
Analyze the user's spending habits and provide meaningful financial insights.
Be concise, premium in tone, and helpful.
Identify patterns like "overspending on weekends" or "frequent small coffee purchases".
`;

export async function parseExpense(text: string) {
  if (!apiKey) throw new Error("AI service unavailable");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: text,
      config: {
        systemInstruction: EXPENSE_PARSER_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
            category: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["amount", "category", "description"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    // Fallback simple parser
    const match = text.match(/(\d+)/);
    if (match) {
      return {
        amount: parseFloat(match[0]),
        currency: "INR",
        category: "Others",
        description: text,
        tags: []
      };
    }
    throw error;
  }
}

export default ai;
