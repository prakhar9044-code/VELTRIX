import { motion } from 'motion/react';
import { Target, Trophy, Plus, ArrowUpRight, TrendingUp } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  icon: string;
}

export default function GoalsView() {
  const goals: Goal[] = [
    { id: '1', name: 'New MacBook Pro', target: 250000, current: 85000, deadline: 'Dec 2026', icon: '💻' },
    { id: '2', name: 'Alps Expedition', target: 500000, current: 120000, deadline: 'June 2027', icon: '🏔️' },
    { id: '3', name: 'Emergency Fund', target: 1000000, current: 450000, deadline: 'Ongoing', icon: '🛡️' },
  ];

  return (
    <div className="space-y-10 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-4xl font-bold mb-2">Ambitions</h2>
          <p className="text-brand-ivory/30 text-sm">Quantifying your future through disciplined capital growth.</p>
        </div>
        <button className="p-4 rounded-2xl bg-brand-accent text-brand-charcoal font-bold flex items-center gap-2 hover:scale-105 transition-all">
          <Plus className="w-5 h-5" />
          Define Ambition
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, i) => (
          <motion.div
            key={goal.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] glass-card border border-brand-ivory/5 group hover:border-brand-accent/20 transition-all flex flex-col"
          >
            <div className="text-4xl mb-6">{goal.icon}</div>
            <h3 className="text-xl font-bold mb-1 tracking-tight">{goal.name}</h3>
            <div className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30 mb-8">Target: ₹{goal.target.toLocaleString()}</div>
            
            <div className="mt-auto space-y-4">
               <div className="flex justify-between items-end mb-2">
                 <div className="text-3xl font-display font-bold">₹{goal.current.toLocaleString()}</div>
                 <div className="text-brand-accent font-bold text-xs">{Math.round((goal.current / goal.target) * 100)}%</div>
               </div>
               <div className="h-1.5 w-full bg-brand-charcoal rounded-full overflow-hidden">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${(goal.current / goal.target) * 100}%` }}
                   transition={{ duration: 1.5, delay: 0.5 }}
                   className="h-full bg-brand-accent rounded-full"
                 />
               </div>
               <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-brand-ivory/20">
                 <span>{goal.deadline}</span>
                 <span>₹{(goal.target - goal.current).toLocaleString()} remaining</span>
               </div>
            </div>
          </motion.div>
        ))}

        <button className="p-8 rounded-[2.5rem] border border-dashed border-brand-ivory/10 flex flex-col items-center justify-center gap-4 group hover:border-brand-accent/30 transition-all opacity-40 hover:opacity-100 min-h-[300px]">
           <div className="w-12 h-12 rounded-2xl bg-brand-slate flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
           </div>
           <span className="text-xs font-bold uppercase tracking-widest">Add New Goal</span>
        </button>
      </div>

      <div className="p-10 rounded-[2.5rem] bg-brand-slate border border-brand-ivory/5 flex flex-col md:flex-row gap-10 items-center">
         <div className="relative shrink-0">
            <svg className="w-32 h-32 -rotate-90">
               <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-brand-accent/10" />
               <motion.circle 
                  cx="64" cy="64" r="56" stroke="#C6A96B" strokeWidth="8" fill="transparent" 
                  strokeLinecap="round" strokeDasharray="351" initial={{ strokeDashoffset: 351 }} animate={{ strokeDashoffset: 120 }} transition={{ duration: 2 }}
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <Trophy className="w-8 h-8 text-brand-accent" />
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-display font-bold mb-2">Wealth Projection</h4>
            <p className="text-brand-ivory/60 text-sm max-w-xl">At your current accumulation rate, you will reach your "MacBook Pro" goal 2 months ahead of schedule. Your financial velocity is <span className="text-brand-accent font-bold">Optimal</span>.</p>
         </div>
         <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-brand-accent font-bold">
               <TrendingUp className="w-4 h-4" /> +12%
            </div>
            <span className="text-[10px] font-bold text-brand-ivory/20 uppercase tracking-widest">Velocity</span>
         </div>
      </div>
    </div>
  );
}
