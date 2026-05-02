import { motion } from 'motion/react';
import { Bell, AlertTriangle, Zap, CheckCircle, ShieldAlert } from 'lucide-react';

interface VeltrixAlert {
  id: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  desc: string;
  timestamp: string;
}

export default function AlertsView() {
  const alerts: VeltrixAlert[] = [
    {
      id: '1',
      type: 'danger',
      title: 'Impulse Breach Detected',
      desc: 'You just spent ₹3,499 on "Electronics" which is 40% higher than your average purchase in this category.',
      timestamp: '2 mins ago'
    },
    {
      id: '2',
      type: 'warning',
      title: 'Subscription Price Hike',
      desc: 'Your Netflix subscription has increased from ₹499 to ₹649. Would you like to review your plan?',
      timestamp: '1 hour ago'
    },
    {
      id: '3',
      type: 'info',
      title: 'Potential Capital Leak',
      desc: 'We noticed 3 small transactions of ₹150 for "Coffee" in the last 48 hours. Consider consolidating.',
      timestamp: 'Yesterday'
    },
    {
      id: '4',
      type: 'success',
      title: 'Savings Milestone',
      desc: 'You stayed under your Dining budget for 7 consecutive days. ₹1,200 has been moved to your "Leisure" goal.',
      timestamp: '2 days ago'
    }
  ];

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="font-display text-4xl font-bold mb-2">Veltrix Alerts</h2>
        <p className="text-brand-ivory/30 text-sm">Real-time consciousness for your financial stream.</p>
      </div>

      <div className="space-y-4">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-3xl border flex gap-6 items-start transition-all ${
              alert.type === 'danger' ? 'bg-red-500/5 border-red-500/20' :
              alert.type === 'warning' ? 'bg-orange-500/5 border-orange-500/20' :
              alert.type === 'success' ? 'bg-emerald-500/5 border-emerald-500/20' :
              'bg-brand-slate/30 border-brand-ivory/5'
            }`}
          >
            <div className={`p-3 rounded-2xl shrink-0 ${
              alert.type === 'danger' ? 'bg-red-500/20 text-red-400' :
              alert.type === 'warning' ? 'bg-orange-500/20 text-orange-400' :
              alert.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' :
              'bg-brand-accent/10 text-brand-accent'
            }`}>
              {alert.type === 'danger' && <ShieldAlert className="w-6 h-6" />}
              {alert.type === 'warning' && <AlertTriangle className="w-6 h-6" />}
              {alert.type === 'success' && <CheckCircle className="w-6 h-6" />}
              {alert.type === 'info' && <Zap className="w-6 h-6" />}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-lg">{alert.title}</h4>
                <span className="text-[10px] font-bold text-brand-ivory/20 uppercase tracking-widest">{alert.timestamp}</span>
              </div>
              <p className="text-sm text-brand-ivory/60 leading-relaxed max-w-2xl">{alert.desc}</p>
              <div className="mt-4 flex gap-3">
                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-brand-charcoal border border-brand-ivory/5 hover:border-brand-accent/30 transition-all">Dismiss</button>
                <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-brand-accent text-brand-charcoal hover:shadow-[0_0_15px_rgba(198,169,107,0.3)] transition-all">Action</button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
