import { motion, AnimatePresence } from 'motion/react';
import { X, Bell, Zap, AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'update' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function NotificationsModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const notifications: Notification[] = [
    { id: '1', type: 'alert', title: 'Unusual Activity', message: 'You spent ₹2,500 on "Gaming" today. This is unusual for a weekday.', time: '2h ago', read: false },
    { id: '2', type: 'update', title: 'New Feature: Goals', message: 'You can now set financial ambitions and track your path to wealth.', time: '5h ago', read: false },
    { id: '3', type: 'success', title: 'Budget Maintained', message: 'Congratulations! You stayed under your Dining budget this week.', time: '1d ago', read: true },
    { id: '4', type: 'info', title: 'Security Scan', message: 'Your account was scanned for leaks. All clear.', time: '2d ago', read: true },
  ];

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
             <h2 className="font-display font-bold uppercase tracking-tight">Notifications</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-slate rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-2">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`p-4 rounded-2xl mb-1 flex gap-4 transition-all hover:bg-brand-slate/50 cursor-pointer group ${!notif.read ? 'bg-brand-accent/5' : ''}`}
            >
              <div className={`p-2 rounded-xl shrink-0 h-fit ${
                notif.type === 'alert' ? 'bg-red-500/20 text-red-400' :
                notif.type === 'update' ? 'bg-blue-500/20 text-blue-400' :
                notif.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
                'bg-brand-accent/10 text-brand-accent'
              }`}>
                {notif.type === 'alert' && <AlertTriangle className="w-4 h-4" />}
                {notif.type === 'update' && <Zap className="w-4 h-4" />}
                {notif.type === 'success' && <CheckCircle className="w-4 h-4" />}
                {notif.type === 'info' && <Info className="w-4 h-4" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold ${!notif.read ? 'text-brand-ivory' : 'text-brand-ivory/60'}`}>{notif.title}</span>
                  <span className="text-[10px] text-brand-ivory/20 font-bold uppercase">{notif.time}</span>
                </div>
                <p className="text-xs text-brand-ivory/40 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">{notif.message}</p>
              </div>
              {!notif.read && <div className="w-2 h-2 rounded-full bg-brand-accent mt-2 shrink-0" />}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-brand-ivory/5 bg-brand-charcoal/50 text-center">
           <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline">Mark all as read</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
