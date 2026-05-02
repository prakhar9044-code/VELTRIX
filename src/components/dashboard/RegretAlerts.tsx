import { Alert } from '../../services/api';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Zap, TrendingDown } from 'lucide-react';

export default function RegretAlerts({ alerts }: { alerts: Alert[] }) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={`p-4 rounded-2xl border flex gap-4 ${
              alert.severity === 'high' ? 'bg-red-400/5 border-red-400/20' : 'bg-brand-accent/5 border-brand-accent/20'
            }`}
          >
            <div className={`p-2 rounded-xl h-fit ${alert.severity === 'high' ? 'bg-red-400/20' : 'bg-brand-accent/20'}`}>
              <AlertCircle className={`w-5 h-5 ${alert.severity === 'high' ? 'text-red-400' : 'text-brand-accent'}`} />
            </div>
            <div>
               <h4 className="font-bold text-sm mb-1">{alert.title}</h4>
               <p className="text-xs text-brand-ivory/60 leading-relaxed">{alert.message}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
