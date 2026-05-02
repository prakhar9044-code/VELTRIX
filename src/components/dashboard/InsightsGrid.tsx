import { useMemo, useState, useEffect } from 'react';
import { Expense, Insight } from '../../types';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Sparkles, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { getDailyScore, getPredictions, getAlerts, DailyScore, Prediction, Alert } from '../../services/api';
import DailyScoreGauge from './DailyScoreGauge';
import RegretAlerts from './RegretAlerts';
import PredictionsCard from './PredictionsCard';

export default function InsightsGrid({ user, expenses, insights }: { user: any, expenses: Expense[], insights: Insight[] }) {
  const [dailyScore, setDailyScore] = useState<DailyScore | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    if (expenses.length > 0) {
      getDailyScore(expenses).then(setDailyScore);
      getPredictions(expenses).then(setPrediction);
      getAlerts(expenses).then(setAlerts);
    }
  }, [expenses]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    expenses.forEach(e => {
      stats[e.category] = (stats[e.category] || 0) + e.amount;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = ['#C5A059', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
      {/* Daily Money Score Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full md:col-span-1 p-8 rounded-[2.5rem] premium-gradient border border-brand-ivory/5 flex flex-col items-center justify-center min-h-[350px]"
      >
        <div className="w-full mb-4 flex justify-between items-start">
           <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30">Intelligence Index</span>
           <ArrowUpRight className="w-4 h-4 text-brand-accent" />
        </div>
        {dailyScore ? <DailyScoreGauge score={dailyScore.score} /> : <div className="animate-pulse w-32 h-32 rounded-full bg-brand-slate" />}
      </motion.div>

      {/* Smart Predictions Card */}
      <div className="col-span-full md:col-span-1 lg:col-span-1">
         {prediction && <PredictionsCard prediction={prediction} mockData={expenses.slice(0, 7)} />}
      </div>

      {/* Regret / Pulse Alerts */}
      <div className="col-span-full lg:col-span-1 space-y-6">
         <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30 px-2">Veltrix Pulse</h3>
         <RegretAlerts alerts={alerts} />
         {alerts.length === 0 && (
            <div className="p-8 rounded-2xl border border-brand-ivory/5 bg-brand-slate/10 text-center">
               <Sparkles className="w-8 h-8 text-brand-accent/20 mx-auto mb-4" />
               <p className="text-xs text-brand-ivory/30">Everything looks stable. No immediate alerts.</p>
            </div>
         )}
      </div>

      {/* Category Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-[2.5rem] glass-card flex flex-col items-center justify-center min-h-[300px]"
      >
        <h3 className="text-xs font-bold text-brand-ivory/60 uppercase tracking-widest mb-6 w-full text-left">Capital Allocation</h3>
        <div className="w-full h-full min-h-[200px]">
          {categoryStats.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F1115', border: 'none', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F3', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-ivory/20 text-xs italic">Awaiting data...</div>
          )}
        </div>
      </motion.div>

      {/* Dynamic Insights */}
      <div className="col-span-full md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <InsightCard 
          icon={<Sparkles className="w-5 h-5 text-brand-accent" />}
          title="Behavioral Coach"
          color="brand-accent"
          delay={0.2}
        >
          <p className="text-brand-ivory/70 leading-relaxed text-sm">
            {insights.find(i => i.type === 'coaching_nudge')?.content || 
              "Efficiency is up. You've reduced transport overhead by 12% compared to the projected trend."}
          </p>
        </InsightCard>

        <InsightCard 
          icon={<AlertTriangle className="w-5 h-5 text-brand-accent" />}
          title="Leak Prevention"
          color="brand-accent"
          delay={0.3}
        >
          <p className="text-brand-ivory/70 leading-relaxed text-sm">
            {insights.find(i => i.type === 'leak_detection')?.content || 
              "Subscription identified: INR 199/mo detected for recurring service. Is this still providing value?"}
          </p>
        </InsightCard>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, children, color, delay }: { icon: React.ReactNode, title: string, children: React.ReactNode, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 rounded-[2rem] glass-card flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-brand-accent/10">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}
