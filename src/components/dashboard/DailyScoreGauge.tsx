import { motion } from 'motion/react';

export default function DailyScoreGauge({ score }: { score: number }) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score > 80 ? '#10B981' : score > 50 ? '#C5A059' : '#EF4444';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            stroke="currentColor"
            strokeWidth="12"
            fill="transparent"
            className="text-brand-slate/50"
          />
          <motion.circle
            cx="96"
            cy="96"
            r={radius}
            stroke={color}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-5xl font-display font-bold"
          >
            {score}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-brand-ivory/40 font-bold">V-Score</span>
        </div>
      </div>
      <div className="mt-4 text-center">
         <p className="text-sm text-brand-ivory/60 font-medium">
            {score > 80 ? "Peak Discipline" : score > 50 ? "Healthy Balance" : "High Volatility"}
         </p>
      </div>
    </div>
  );
}
