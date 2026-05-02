import { motion } from 'motion/react';
import { Target, Trophy, Plus, ArrowUpRight, TrendingUp, X } from 'lucide-react';
import { Goal } from '../../types';
import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { toast } from 'sonner';

export default function GoalsView({ user, goals }: { user: any, goals: Goal[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: 100000, deadline: 'Dec 2026', icon: '💰' });

  const icons = ['💰', '💻', '🏔️', '🛡️', '🚗', '🏠', '✈️'];

  const handleCreate = async () => {
    if (!newGoal.name) {
      toast.error("Please enter a goal name");
      return;
    }
    try {
      await addDoc(collection(db, `users/${user.uid}/goals`), {
        userId: user.uid,
        ...newGoal,
        current: 0,
        status: 'active'
      });
      setIsAdding(false);
      toast.success("Ambition defined");
    } catch (e) {
      toast.error("Failed to save ambition");
    }
  };

  return (
    <div className="space-y-10 pb-32">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="font-display text-4xl font-bold mb-2">Ambitions</h2>
          <p className="text-brand-ivory/30 text-sm">Quantifying your future through disciplined capital growth.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="w-full sm:w-auto p-4 rounded-2xl bg-brand-accent text-brand-charcoal font-bold flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
          Define Ambition
        </button>
      </div>

      {isAdding && (
        <div className="glass-card p-8 rounded-3xl border border-brand-accent/30 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-xl uppercase tracking-tighter">New Ambition</h3>
            <button onClick={() => setIsAdding(false)}><X className="w-5 h-5 opacity-40" /></button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Ambition Name</label>
              <input 
                type="text"
                placeholder="e.g. New MacBook"
                value={newGoal.name}
                onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                className="w-full bg-brand-slate border border-brand-ivory/10 rounded-xl p-3 outline-none focus:border-brand-accent/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Target Amount</label>
              <input 
                type="number"
                value={newGoal.target}
                onChange={e => setNewGoal({...newGoal, target: parseInt(e.target.value)})}
                className="w-full bg-brand-slate border border-brand-ivory/10 rounded-xl p-3 outline-none focus:border-brand-accent/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Deadline</label>
              <input 
                type="text"
                placeholder="Dec 2026"
                value={newGoal.deadline}
                onChange={e => setNewGoal({...newGoal, deadline: e.target.value})}
                className="w-full bg-brand-slate border border-brand-ivory/10 rounded-xl p-3 outline-none focus:border-brand-accent/50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase opacity-30 block mb-2">Icon</label>
              <div className="flex gap-2">
                {icons.map(icon => (
                  <button 
                    key={icon}
                    onClick={() => setNewGoal({...newGoal, icon})}
                    className={`p-2 rounded-lg text-xl border transition-all ${newGoal.icon === icon ? 'border-brand-accent bg-brand-accent/10' : 'border-transparent hover:bg-brand-slate'}`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={handleCreate} className="w-full py-4 bg-brand-ivory text-brand-charcoal font-bold rounded-xl hover:bg-brand-accent transition-colors">Save Ambition</button>
        </div>
      )}

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

        <button 
          onClick={() => setIsAdding(true)}
          className="p-8 rounded-[2.5rem] border border-dashed border-brand-ivory/10 flex flex-col items-center justify-center gap-4 group hover:border-brand-accent/30 transition-all opacity-40 hover:opacity-100 min-h-[300px]"
        >
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
                  strokeLinecap="round" strokeDasharray="351" initial={{ strokeDashoffset: 351 }} animate={{ strokeDashoffset: goals.length > 0 ? 120 : 351 }} transition={{ duration: 2 }}
               />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
               <Trophy className="w-8 h-8 text-brand-accent" />
            </div>
         </div>
         <div className="flex-1 text-center md:text-left">
            <h4 className="text-2xl font-display font-bold mb-2">Wealth Projection</h4>
            <p className="text-brand-ivory/60 text-sm max-w-xl">Veltrix tracks your ambitions against your current velocity. Continue accumulating to see projections here.</p>
         </div>
      </div>
    </div>
  );
}
