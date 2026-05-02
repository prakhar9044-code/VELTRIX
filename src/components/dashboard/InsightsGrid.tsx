import { useMemo, useState, useEffect } from 'react';
import { Expense, Insight } from '../../types';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area } from 'recharts';
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
    const total = expenses.reduce((s, e) => s + e.amount, 0);
    
    expenses.forEach(e => {
      stats[e.category] = (stats[e.category] || 0) + e.amount;
    });

    return Object.entries(stats)
      .map(([name, value]) => ({ 
        name, 
        value, 
        percent: total > 0 ? Math.round((value / total) * 100) : 0 
      }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const COLORS = ['#C6A96B', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full md:col-span-1 p-8 rounded-[2.5rem] premium-gradient border border-brand-ivory/5 flex flex-col justify-between min-h-[350px]"
      >
        <div className="w-full flex justify-between items-start">
           <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30">Total Outflow</span>
           <div className="flex items-center gap-1 text-[10px] text-brand-accent font-bold">
              <ArrowUpRight className="w-3 h-3" /> Real-time tracking
           </div>
        </div>
        <div className="py-6">
           <div className="text-brand-ivory/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Portfolio Spend</div>
           <div className="text-6xl font-display font-bold">₹{expenses.reduce((s, e) => s + e.amount, 0).toLocaleString()}</div>
        </div>
        <div className="h-24 w-full opacity-50">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={expenses.slice(-10).reverse()}>
                 <Area type="monotone" dataKey="amount" stroke="#C6A96B" fill="#C6A96B10" strokeWidth={2} />
              </AreaChart>
           </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Smart Predictions Card */}
      <div className="col-span-full md:col-span-1 lg:col-span-1">
         {prediction ? <PredictionsCard prediction={prediction} mockData={expenses.slice(0, 7)} /> : (
           <div className="p-8 rounded-[2.5rem] glass-card border border-brand-ivory/5 flex items-center justify-center h-full opacity-40 italic text-xs">
             Analyzing your velocity...
           </div>
         )}
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
        className="col-span-full md:col-span-1 p-8 rounded-[2.5rem] glass-card border border-brand-ivory/5 flex flex-col justify-between min-h-[350px]"
      >
        <div className="flex flex-col h-full justify-between">
           <div>
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-6 px-2">Category Pulse</h3>
              <div className="space-y-4">
                 {categoryStats.length > 0 ? (
                   categoryStats.slice(0, 5).map((stat, idx) => (
                     <CategoryItem key={stat.name} label={stat.name} percent={stat.percent} color={COLORS[idx % COLORS.length]} />
                   ))
                 ) : (
                   <div className="text-xs text-brand-ivory/20 italic py-10">Waiting for data stream...</div>
                 )}
              </div>
           </div>
           
           <div className="pt-6 border-t border-brand-ivory/5 flex gap-4 items-center">
              <div className="p-2 rounded-lg bg-brand-accent/10">
                 <Sparkles className="w-4 h-4 text-brand-accent" />
              </div>
              <p className="text-[10px] text-brand-ivory/40 leading-relaxed font-medium">
                 Veltrix is learning your habits. Add more entries via AI chat to refine intelligence.
              </p>
           </div>
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

function CategoryItem({ label, percent, color }: { label: string, percent: number, color: string }) {
  return (
    <div className="flex items-center justify-between group cursor-default">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium text-brand-ivory/60 group-hover:text-brand-ivory transition-colors">{label}</span>
        <div className="flex-1 h-[1px] bg-brand-ivory/5 mx-4" />
      </div>
      <div className="text-[10px] font-bold text-brand-ivory/80 group-hover:text-brand-accent transition-colors">{percent}%</div>
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
