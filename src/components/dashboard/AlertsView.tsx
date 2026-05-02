import { motion } from 'motion/react';
import { Bell, AlertTriangle, Zap, CheckCircle, ShieldAlert } from 'lucide-react';
import { useMemo, useEffect, useState } from 'react';
import { Expense } from '../../types';
import { getAlerts, Alert } from '../../services/api';

export default function AlertsView({ expenses }: { expenses: Expense[] }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    getAlerts(expenses).then(setAlerts);
  }, [expenses]);

  return (
    <div className="space-y-10 pb-20">
      <div>
        <h2 className="font-display text-4xl font-bold mb-2">Veltrix Alerts</h2>
        <p className="text-brand-ivory/30 text-sm">Real-time consciousness for your financial stream.</p>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-3xl border flex gap-6 items-start transition-all ${
                alert.severity === 'high' ? 'bg-red-500/5 border-red-500/20' :
                alert.severity === 'medium' ? 'bg-orange-500/5 border-orange-500/20' :
                'bg-brand-slate/30 border-brand-ivory/5'
              }`}
            >
              <div className={`p-3 rounded-2xl shrink-0 ${
                alert.severity === 'high' ? 'bg-red-500/20 text-red-400' :
                alert.severity === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                'bg-brand-accent/10 text-brand-accent'
              }`}>
                {alert.severity === 'high' && <ShieldAlert className="w-6 h-6" />}
                {alert.severity === 'medium' && <AlertTriangle className="w-6 h-6" />}
                {alert.severity === 'low' && <Zap className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-lg">{alert.title}</h4>
                  <span className="text-[10px] font-bold text-brand-ivory/20 uppercase tracking-widest">Real-time</span>
                </div>
                <p className="text-sm text-brand-ivory/60 leading-relaxed max-w-2xl">{alert.message}</p>
                <div className="mt-4 flex gap-3">
                  <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-brand-charcoal border border-brand-ivory/5 hover:border-brand-accent/30 transition-all">Dismiss</button>
                  <button className="text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg bg-brand-accent text-brand-charcoal hover:shadow-[0_0_15px_rgba(198,169,107,0.3)] transition-all">Action</button>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-brand-ivory/5 rounded-[2.5rem]">
            <Bell className="w-12 h-12 text-brand-ivory/10 mx-auto mb-4" />
            <h3 className="text-brand-ivory/30 font-medium italic">No active priority alerts. Your stream is stable.</h3>
          </div>
        )}
      </div>
    </div>
  );
}
