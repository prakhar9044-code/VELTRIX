import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API ROUTES ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy" });
  });

  // Daily Money Score Logic
  app.post("/api/analytics/score", (req, res) => {
    const { expenses } = req.body;
    if (!expenses || !Array.isArray(expenses)) return res.status(400).json({ error: "Invalid data" });

    const today = new Date().toDateString();
    const todayExpenses = expenses.filter(e => new Date(e.timestamp).toDateString() === today);
    const todayTotal = todayExpenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Average spend over last 7 days (simplified heuristic)
    const totalSpend = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avgSpend = totalSpend / (expenses.length > 0 ? 10 : 1); // Mocked spread
    
    let score = 100;
    if (todayTotal > avgSpend) {
        score = Math.max(20, 100 - ((todayTotal - avgSpend) / 10));
    } else {
        score = Math.min(100, 80 + (avgSpend - todayTotal) / 5);
    }

    res.json({ 
        score: Math.round(score),
        trend: todayTotal > avgSpend ? 'down' : 'up',
        message: score > 80 ? "Excellent control" : score > 50 ? "Moderate spend" : "Caution advised"
    });
  });

  // Regret / Impulse Alert Logic
  app.post("/api/analytics/alerts", (req, res) => {
    const { expenses } = req.body;
    const alerts = [];
    
    // Pattern 1: Rapid succession in same category
    const categories = {};
    expenses.slice(0, 10).forEach(e => {
        const key = e.category;
        categories[key] = (categories[key] || 0) + 1;
    });

    for (const [cat, count] of Object.entries(categories)) {
        if ((count as number) >= 3) {
            alerts.push({
                type: 'regret',
                title: 'Frequency Alert',
                message: `You've logged ${cat} expenses ${count} times recently. Impulse buy?`,
                severity: 'medium'
            });
        }
    }

    res.json({ alerts });
  });

  // Smart Predictions (Trend Analysis)
  app.post("/api/analytics/predictions", (req, res) => {
    const { expenses } = req.body;
    const weeklyTarget = 5000;
    const currentTotal = expenses.reduce((sum, e) => sum + e.amount, 0);
    
    // Forecast based on velocity
    const forecast = currentTotal * 1.2; 
    
    res.json({
        forecast,
        risk: forecast > weeklyTarget ? 'high' : 'low',
        insight: forecast > weeklyTarget 
            ? `At this rate, you'll exceed your budget by ₹${Math.round(forecast - weeklyTarget)}.`
            : "You are well within your safety zone for the week."
    });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Veltrix Engine running on http://localhost:${PORT}`);
  });
}

startServer();
