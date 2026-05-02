import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Insight } from '../../types';

export default function NotificationsModal({ isOpen, onClose, insights }: { isOpen: boolean, onClose: () => void, insights: Insight[] }) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-end p-4 md:p-8 bg-brand-charcoal/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ opacity: 0, x: 20, scale: 0.95 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        className="w-full max-w-sm glass-card rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-brand-ivory/5 flex items-center justify-between bg-brand-charcoal/50">
          <div className="flex items-center gap-3">
             <Bell className="w-5 h-5 text-brand-accent" />
             <h2 className="font-display font-bold uppercase tracking-tight">Intelligence Feed</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-slate rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {insights.length > 0 ? insights.map((notif) => (
            <div 
              key={notif.id}
              className={`p-4 rounded-2xl mb-1 flex gap-4 transition-all hover:bg-brand-slate/50 cursor-pointer group ${!notif.read ? 'bg-brand-accent/5' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 h-fit ${
                notif.type === 'leak_detection' ? 'bg-red-500/20 text-red-400' :
                notif.type === 'pattern_alert' ? 'bg-orange-500/20 text-orange-400' :
                notif.type === 'weekly_summary' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-brand-accent/10 text-brand-accent'
              }`}>
                {notif.type === 'leak_detection' && <AlertTriangle className="w-4 h-4" />}
                {notif.type === 'pattern_alert' && <Zap className="w-4 h-4" />}
                {notif.type === 'weekly_summary' && <CheckCircle className="w-4 h-4" />}
                {notif.type === 'coaching_nudge' && <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold ${!notif.read ? 'text-brand-ivory' : 'text-brand-ivory/60'}`}>{notif.title}</span>
                  <span className="text-[10px] text-brand-ivory/20 font-bold uppercase">{new Date(notif.timestamp).toLocaleDateString()}</span>
                </div>
                <p className="text-xs text-brand-ivory/40 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{notif.content}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 shrink-0" />}
            </div>
          )) : (
            <div className="py-20 text-center opacity-30 italic text-sm px-6">
              Your intelligence feed is clear. Insights appear as you log activity.
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
