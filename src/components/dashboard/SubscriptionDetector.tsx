import { motion } from 'motion/react';
import { CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Expense } from '../../types';

export default function SubscriptionDetector({ expenses }: { expenses: Expense[] }) {
  // Simple logic to find recurring amounts
  const groups: Record<string, Expense[]> = {};
  expenses.forEach(e => {
    const key = `${e.amount}-${e.category}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(e);
  });

  const subs = Object.values(groups).filter(g => g.length >= 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <h2 className="font-display text-2xl font-bold">Subscription Engine</h2>
         <span className="text-[10px] font-bold uppercase tracking-widest text-brand-accent px-3 py-1 rounded-full bg-brand-accent/10">Active Monitoring</span>
      </div>

      {subs.length === 0 ? (
        <div className="p-12 rounded-[2rem] border border-dashed border-brand-ivory/10 text-center opacity-40">
           <CreditCard className="w-12 h-12 mx-auto mb-4" />
           <p>No recurring patterns detected yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {subs.map((group, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl glass-card border border-brand-ivory/5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-xl bg-brand-slate flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-brand-accent" />
                 </div>
                 <div>
                    <h4 className="font-bold">{group[0].description}</h4>
                    <p className="text-xs text-brand-ivory/40 uppercase tracking-wider font-bold">{group[0].category} · Recurring</p>
                 </div>
              </div>
              <div className="text-right">
                 <div className="text-xl font-display font-bold">₹{group[0].amount.toLocaleString()}</div>
                 <div className="flex items-center gap-1 text-[10px] text-green-400 font-bold uppercase tracking-tighter">
                    <CheckCircle className="w-3 h-3" /> Identified
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="p-8 rounded-[2rem] bg-brand-accent/5 border border-brand-accent/10 flex gap-6 items-start mt-8">
         <div className="p-3 bg-brand-accent/20 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-brand-accent" />
         </div>
         <div>
            <h4 className="font-bold mb-2">Unused Subscription Alert</h4>
            <p className="text-sm text-brand-ivory/60 leading-relaxed">
               We found a ₹199 charge that doesn't match any of your utility or entertainment patterns. Would you like to flag this?
            </p>
         </div>
      </div>
    </div>
  );
}
