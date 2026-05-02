import { Expense } from '../../types';
import { motion } from 'motion/react';
import { History, Search } from 'lucide-react';
import { useState, useMemo } from 'react';

export default function ExpenseHistory({ expenses }: { expenses: Expense[] }) {
  const [search, setSearch] = useState('');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [expenses, search]);

  return (
    <div className="flex flex-col h-full space-y-6 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-ivory to-brand-ivory/40">Archive</h2>
          <p className="text-brand-ivory/30 text-sm">Chronological stream of your capital velocity.</p>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ivory/20 group-focus-within:text-brand-accent transition-colors" />
          <input 
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-brand-slate/50 border border-brand-ivory/5 rounded-2xl py-3 pl-12 pr-6 outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all text-sm w-full md:w-64"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3">
        {filteredExpenses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 opacity-20 italic">
            <History className="w-12 h-12 mb-4" />
            <p>No transactions match your search.</p>
          </div>
        ) : (
          filteredExpenses.map((expense, i) => (
            <motion.div 
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.5) }}
              className="p-5 rounded-2xl border border-brand-ivory/5 bg-brand-slate/20 flex items-center justify-between group hover:border-brand-accent/30 hover:bg-brand-slate/30 transition-all cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-slate flex items-center justify-center text-brand-ivory/40 group-hover:text-brand-accent transition-colors">
                  <span className="text-lg">{expense.description[0]}</span>
                </div>
                <div>
                  <div className="font-semibold text-brand-ivory/90 group-hover:text-brand-ivory transition-colors">{expense.description}</div>
                  <div className="text-[10px] text-brand-ivory/40 flex items-center gap-2 font-bold uppercase tracking-widest mt-1">
                    <span className="text-brand-accent/60">{expense.category}</span>
                    <span className="opacity-40">•</span>
                    <span>{new Date(expense.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-display font-bold text-brand-ivory">
                  ₹{expense.amount.toLocaleString()}
                </div>
                <div className="text-[8px] font-bold text-brand-ivory/20 uppercase tracking-tighter">Settled</div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
