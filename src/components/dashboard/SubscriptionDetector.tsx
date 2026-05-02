import { motion } from 'motion/react';
import { CreditCard, AlertTriangle, CheckCircle, Coffee, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { Expense } from '../../types';

export default function SubscriptionDetector({ expenses }: { expenses: Expense[] }) {
  const recurringTotal = 1759;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-8">
        <div>
           <h2 className="font-display text-4xl font-bold mb-2">Leak Detection</h2>
           <p className="text-brand-ivory/30 text-sm">Identifying recurring patterns and capital erosion.</p>
        </div>

        {/* Repeated Small Expenses */}
        <div className="glass-card rounded-3xl p-8">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-6">Repeated Small Expenses</h3>
           <div className="space-y-6">
              <LeakItem icon={<UtensilsCrossed className="w-4 h-4" />} name="Chai" count={17} total={340} />
              <LeakItem icon={<Coffee className="w-4 h-4" />} name="Coffee" count={12} total={480} />
              <LeakItem icon={<ShoppingBag className="w-4 h-4" />} name="Snacks" count={9} total={270} />
           </div>
           <button className="mt-8 text-xs font-bold text-brand-accent hover:opacity-80 flex items-center gap-2">
              View all insights →
           </button>
        </div>

        {/* Subscriptions */}
        <div className="glass-card rounded-3xl p-8">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-6">Subscription Pulse</h3>
           <div className="space-y-6">
              <SubscriptionItem name="Netflix" price={649} logo="N" />
              <SubscriptionItem name="Spotify" price={119} logo="S" />
              <SubscriptionItem name="Amazon Prime" price={149} logo="A" />
           </div>
           <button className="mt-8 text-xs font-bold text-brand-accent hover:opacity-80 flex items-center gap-2">
              Manage subscriptions →
           </button>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Potential Saving Gauge Card */}
        <div className="glass-card rounded-3xl p-10 flex flex-col items-center justify-center text-center">
           <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/40 mb-10 w-full text-left">Potential Saving</h3>
           <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full -rotate-90">
                 <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-accent/10" />
                 <motion.circle 
                    cx="96" cy="96" r="80" stroke="#C6A96B" strokeWidth="8" fill="transparent" 
                    strokeLinecap="round" strokeDasharray="502" initial={{ strokeDashoffset: 502 }} animate={{ strokeDashoffset: 150 }} transition={{ duration: 2 }}
                 />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <CreditCard className="w-8 h-8 text-brand-accent mb-2" />
                 <div className="text-3xl font-display font-bold">₹{recurringTotal.toLocaleString()}</div>
                 <div className="text-[10px] font-bold opacity-30">/ MONTH</div>
              </div>
           </div>
           <p className="text-sm text-brand-ivory/60 max-w-[200px] leading-relaxed">
              You could save up to <span className="text-brand-accent font-bold">₹{recurringTotal}</span> by optimizing 3 low-usage subscriptions.
           </p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-brand-accent/5 border border-brand-accent/10 flex gap-6 items-start">
           <div className="p-3 bg-brand-accent/20 rounded-2xl shrink-0">
              <AlertTriangle className="w-6 h-6 text-brand-accent" />
           </div>
           <div>
              <h4 className="font-bold mb-2">Efficiency Alert</h4>
              <p className="text-sm text-brand-ivory/60 leading-relaxed">
                 We've identified a "Netflix" charge that hasn't seen app activity in 14 days. Potential waste detected.
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
