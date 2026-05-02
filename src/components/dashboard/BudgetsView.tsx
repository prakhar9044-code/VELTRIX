import { motion } from 'motion/react';
import { Target, TrendingUp, Plus, ArrowRight, X } from 'lucide-react';
import { Expense, Budget } from '../../types';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';

export default function BudgetsView({ user, expenses, budgets }: { user: any, expenses: Expense[], budgets: Budget[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBudget, setNewBudget] = useState({ category: 'Food', limit: 5000 });

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Others'];

  const handleCreate = async () => {
    try {
      await addDoc(collection(db, `users/${user.uid}/budgets`), {
        userId: user.uid,
        ...newBudget,
        spent: 0,
        period: 'monthly'
      });
      setIsAdding(false);
      toast.success("Budget set successfully");
    } catch (e) {
      toast.error("Failed to set budget");
    }
  };

  const activeBudgets = budgets.map(b => ({
    ...b,
    spent: expenses.filter(e => e.category === b.category).reduce((acc, e) => acc + e.amount, 0)
  }));

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl font-bold mb-2">Budgeting</h2>
          <p className="text-brand-ivory/30 text-sm">Synchronized limits for conscious allocation.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="p-4 rounded-2xl bg-brand-accent text-brand-charcoal font-bold flex items-center gap-2 hover:scale-105 transition-all"
        >
          <Plus className="w-5 h-5" />
          Set New Limit
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-8 rounded-3xl border border-brand-accent/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl uppercase tracking-tighter">Define Allocation</h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 opacity-40" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Category</label>
              <select 
                value={newBudget.category}
                onChange={e => setNewBudget({...newBudget, category: e.target.value})}
                className="w-full bg-brand-slate border border-brand-ivory/10 rounded-xl p-3 outline-none focus:border-brand-accent/50"
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Limit (Monthly)</label>
              <input 
                type="number"
                value={newBudget.limit}
                onChange={e => setNewBudget({...newBudget, limit: parseInt(e.target.value)})}
                className="w-full bg-brand-slate border border-brand-ivory/10 rounded-xl p-3 outline-none focus:border-brand-accent/50"
              />
            </div>
          </div>
          <button onClick={handleCreate} className="w-full py-4 bg-brand-ivory text-brand-charcoal font-bold rounded-xl hover:bg-brand-accent transition-colors">Create Budget</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeBudgets.length > 0 ? activeBudgets.map((budget, i) => (
          <motion.div
            key={budget.id}
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
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center glass-card rounded-[2.5rem] border-2 border-dashed border-brand-ivory/5">
             <Target className="w-12 h-12 text-brand-ivory/10 mx-auto mb-4" />
             <p className="text-brand-ivory/40 font-medium font-display italic">No active limits. Define your first target above.</p>
          </div>
        )}
      </div>

      <div className="p-10 rounded-[2.5rem] premium-gradient border border-brand-ivory/5">
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-20 h-20 rounded-3xl bg-brand-charcoal flex items-center justify-center shrink-0">
             <TrendingUp className="w-10 h-10 text-brand-accent" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-display font-bold mb-2">Smart Optimization</h4>
            <p className="text-brand-ivory/60 text-sm max-w-xl">Veltrix is analyzing your spend stream. Once data matures, smart suggestions for limit adjustments will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
