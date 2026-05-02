import { motion } from 'motion/react';
import { Target, TrendingUp, Plus, ArrowRight } from 'lucide-react';
import { Expense } from '../../types';

interface Budget {
  category: string;
  limit: number;
  spent: number;
}

export default function BudgetsView({ expenses }: { expenses: Expense[] }) {
  const budgets: Budget[] = [
    { category: 'Dining', limit: 8000, spent: expenses.filter(e => e.category === 'Dining').reduce((acc, e) => acc + e.amount, 0) },
    { category: 'Transport', limit: 3000, spent: expenses.filter(e => e.category === 'Transport').reduce((acc, e) => acc + e.amount, 0) },
    { category: 'Entertainment', limit: 5000, spent: expenses.filter(e => e.category === 'Entertainment').reduce((acc, e) => acc + e.amount, 0) },
    { category: 'Shopping', limit: 10000, spent: expenses.filter(e => e.category === 'Shopping').reduce((acc, e) => acc + e.amount, 0) },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl font-bold mb-2">Budgeting</h2>
          <p className="text-brand-ivory/30 text-sm">Synchronized limits for conscious allocation.</p>
        </div>
        <button className="p-4 rounded-2xl bg-brand-accent text-brand-charcoal font-bold flex items-center gap-2 hover:scale-105 transition-all">
          <Plus className="w-5 h-5" />
          Set New Limit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {budgets.map((budget, i) => (
          <motion.div
            key={budget.category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] glass-card border border-brand-ivory/5 group hover:border-brand-accent/20 transition-all"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1 tracking-tight">{budget.category}</h3>
                <div className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30">Monthly Allocation</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold">₹{budget.limit.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-brand-accent uppercase tracking-tighter">Target</div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-2 w-full bg-brand-charcoal rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((budget.spent / budget.limit) * 100, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full rounded-full ${budget.spent > budget.limit ? 'bg-red-500' : 'bg-brand-accent shadow-[0_0_15px_rgba(198,169,107,0.5)]'}`}
                />
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-brand-ivory/40 font-medium">₹{budget.spent.toLocaleString()} spent</span>
                <span className={`font-bold ${budget.spent > budget.limit ? 'text-red-400' : 'text-brand-ivory/60'}`}>
                  {budget.spent > budget.limit ? 'Over budget' : `${Math.round((budget.spent / budget.limit) * 100)}% utilized`}
                </span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-brand-ivory/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/20">Adjustment Required?</span>
               <ArrowRight className="w-4 h-4 text-brand-accent" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 rounded-[2.5rem] premium-gradient border border-brand-ivory/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-charcoal flex items-center justify-center shrink-0">
             <TrendingUp className="w-10 h-10 text-brand-accent" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-display font-bold mb-2">Smart Optimization</h4>
            <p className="text-brand-ivory/60 text-sm max-w-xl">Veltrix has detected you can increase your "Wellness" budget by 15% by reducing "Dining" frequency without impacting your lifestyle.</p>
          </div>
          <button className="px-8 py-4 rounded-xl border border-brand-ivory/20 hover:bg-brand-ivory hover:text-brand-charcoal transition-all font-bold">Apply Suggestions</button>
        </div>
      </div>
    </div>
  );
}
