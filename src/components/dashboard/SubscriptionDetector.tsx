import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CreditCard, AlertTriangle, CheckCircle, Coffee, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { Expense } from '../../types';

export default function SubscriptionDetector({ expenses }: { expenses: Expense[] }) {
  // Logic to find recurring expenses (same description and roughly same amount)
  const recurring = useMemo(() => {
    const counts: Record<string, { count: number, total: number, lastAmount: number }> = {};
    expenses.forEach(e => {
      const key = e.description.toLowerCase();
      if (!counts[key]) {
        counts[key] = { count: 0, total: 0, lastAmount: e.amount };
      }
      counts[key].count += 1;
      counts[key].total += e.amount;
    });

    return Object.entries(counts)
      .filter(([_, stats]) => stats.count >= 2)
      .map(([name, stats]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: stats.count,
        total: stats.total,
        lastAmount: stats.lastAmount
      }))
      .sort((a, b) => b.total - a.total);
  }, [expenses]);

  const recurringTotal = recurring.reduce((acc, curr) => acc + curr.lastAmount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-8">
        <div>
           <h2 className="font-display text-4xl font-bold mb-2">Leak Detection</h2>
           <p className="text-brand-ivory/30 text-sm">Identifying recurring patterns and capital erosion.</p>
        </div>

        {/* Small Recurring Expenses */}
        <div className="glass-card rounded-3xl p-8">
           <div className="flex justify-between items-center mb-6">
             <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40">Recurring Patterns</h3>
             <span className="text-[10px] font-bold text-brand-accent uppercase bg-brand-accent/10 px-2 py-0.5 rounded">Real-time</span>
           </div>
           <div className="space-y-6">
              {recurring.length > 0 ? (
                recurring.slice(0, 4).map(item => (
                  <LeakItem 
                    key={item.name} 
                    icon={item.total > 1000 ? <CreditCard className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />} 
                    name={item.name} 
                    count={item.count} 
                    total={item.total} 
                  />
                ))
              ) : (
                <div className="text-xs text-brand-ivory/20 italic py-4">No recurring patterns detected yet.</div>
              )}
           </div>
        </div>

        {/* Potential Subscriptions */}
        <div className="glass-card rounded-3xl p-8">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-6">Potential Subscriptions</h3>
           <div className="space-y-6">
              {recurring.filter(r => r.total > 100).length > 0 ? (
                recurring.filter(r => r.total > 100).slice(0, 3).map(sub => (
                  <SubscriptionItem key={sub.name} name={sub.name} price={sub.lastAmount} logo={sub.name[0]} />
                ))
              ) : (
                <div className="text-xs text-brand-ivory/20 italic py-4">Add more entries to identify subscriptions.</div>
              )}
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Potential Saving Gauge Card */}
        <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center text-center">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-10 w-full text-left">Monthly Fixed Commitments</h3>
           <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90">
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-accent/10" />
                 <motion.circle 
                    cx="96" cy="96" r="80" stroke="#C6A96B" strokeWidth="8" fill="transparent" 
                    strokeLinecap="round" strokeDasharray="502" initial={{ strokeDashoffset: 502 }} animate={{ strokeDashoffset: recurring.length > 0 ? 150 : 502 }} transition={{ duration: 2 }}
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <CreditCard className="w-8 h-8 text-brand-accent mb-2" />
                 <div className="text-3xl font-display font-bold">₹{recurringTotal.toLocaleString()}</div>
                 <div className="text-[10px] font-bold opacity-30">/ MONTH</div>
              </div>
           </div>
           <p className="text-sm text-brand-ivory/60 max-w-[200px] leading-relaxed">
              Veltrix tracks <span className="text-brand-accent font-bold">₹{recurringTotal}</span> in recurring payments detected from your stream.
           </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-brand-accent/5 border border-brand-accent/10 flex gap-6 items-start">
           <div className="p-3 bg-brand-accent/20 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-brand-accent" />
           </div>
           <div>
              <h4 className="font-bold mb-2">Efficiency Alert</h4>
              <p className="text-sm text-brand-ivory/60 leading-relaxed">
                 {recurring.length > 0 
                   ? `You have ${recurring.length} recurring expenses. Reviewing these could save you up to 15% in capital leak.`
                   : "Analyzing your spending velocity to detect leaks. Continue logging to activate alerts."}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}

function LeakItem({ icon, name, count, total }: { icon: any, name: string, count: number, total: number }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-brand-charcoal flex items-center justify-center text-brand-accent">{icon}</div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="text-right">
        <div className="text-xs font-bold">{count} times</div>
        <div className="text-[10px] text-brand-ivory/40">₹{total} total</div>
      </div>
    </div>
  );
}

function SubscriptionItem({ name, price, logo }: { name: string, price: number, logo: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-brand-charcoal flex items-center justify-center text-xs font-bold text-brand-accent">{logo}</div>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold">₹{price} <span className="text-[10px] opacity-30">/month</span></div>
      </div>
    </div>
  );
}
