import { useMemo } from 'react';
import { Expense, Insight } from '../../types';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { AlertCircle, TrendingDown, Target, Sparkles, AlertTriangle } from 'lucide-react';

export default function InsightsGrid({ user, expenses, insights }: { user: any, expenses: Expense[], insights: Insight[] }) {
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    expenses.forEach(e => {
      stats[e.category] = (stats[e.category] || 0) + e.amount;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  const COLORS = ['#C5A059', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const weeklyTotal = useMemo(() => {
    return expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
      {/* Summary Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="col-span-full lg:col-span-1 p-8 rounded-2xl premium-gradient border border-brand-ivory/5 flex flex-col justify-between"
      >
        <div>
          <div className="text-brand-ivory/40 text-xs font-bold uppercase tracking-widest mb-2">Total Monthly Spend</div>
          <div className="text-5xl font-display font-bold text-brand-ivory">₹{weeklyTotal.toLocaleString()}</div>
        </div>
        <div className="mt-8 flex items-center gap-2 text-green-400 text-sm font-medium">
          <TrendingDown className="w-4 h-4" />
          <span>4.2% less than last month</span>
        </div>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-8 rounded-2xl glass-card flex flex-col items-center justify-center min-h-[300px]"
      >
        <h3 className="text-sm font-bold text-brand-ivory/60 uppercase tracking-widest mb-6 w-full text-left">Category Split</h3>
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
                  contentStyle={{ backgroundColor: '#0F1115', border: '1px solid rgba(245,245,243,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#F5F5F3' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-brand-ivory/20 text-xs italic">No data yet</div>
          )}
        </div>
      </motion.div>

      {/* AI Coaching Nudge (Mocked logic for now, using insights sub-collection) */}
      <InsightCard 
        icon={<Sparkles className="w-5 h-5 text-brand-accent" />}
        title="Behavioral Coach"
        color="brand-accent"
        delay={0.2}
      >
        <p className="text-brand-ivory/70 leading-relaxed text-sm">
          {insights.find(i => i.type === 'coaching_nudge')?.content || 
            "You tend to overspend on transport during weekends. Try local alternatives to save approx ₹200/week."}
        </p>
      </InsightCard>

      {/* Leak Detection */}
      <InsightCard 
        icon={<AlertTriangle className="w-5 h-5 text-red-400" />}
        title="Leak Detection"
        color="red-400"
        delay={0.3}
      >
        <p className="text-brand-ivory/70 leading-relaxed text-sm">
          {insights.find(i => i.type === 'leak_detection')?.content || 
            "Micro-spend alert: ₹420 spent on small 'Tea/Snacks' this week. This adds up to ₹1,680 monthly."}
        </p>
      </InsightCard>

      {/* Pattern Alert */}
      <InsightCard 
        icon={<TrendingDown className="w-5 h-5 text-blue-400" />}
        title="Savings Opportunity"
        color="blue-400"
        delay={0.4}
      >
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="text-2xl font-bold">₹1,200</div>
            <div className="text-[10px] text-brand-ivory/40 uppercase font-bold">Potential monthly saving</div>
          </div>
          <button className="px-3 py-1.5 rounded-lg bg-blue-400/10 text-blue-400 text-xs font-bold hover:bg-blue-400/20 transition-all">
            Optimize
          </button>
        </div>
      </InsightCard>
    </div>
  );
}

function InsightCard({ icon, title, children, color, delay }: { icon: React.ReactNode, title: string, children: React.ReactNode, color: string, delay: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 rounded-2xl glass-card flex flex-col gap-6"
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-opacity-10`} style={{ backgroundColor: color === 'brand-accent' ? 'rgba(197, 160, 89, 0.1)' : color === 'red-400' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)' }}>
          {icon}
        </div>
        <span className="text-sm font-bold uppercase tracking-widest opacity-60">{title}</span>
      </div>
      {children}
    </motion.div>
  );
}
