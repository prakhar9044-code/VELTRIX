import { motion } from 'motion/react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal">
      <div className="relative flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-16 h-16 border-t-2 border-brand-accent rounded-full mb-8"
        />
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col items-center"
        >
          <span className="font-display text-4xl font-bold tracking-tighter text-brand-ivory">
            VELTRIX
          </span>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: 0.8, duration: 1 }}
            className="h-[1px] bg-brand-accent mt-2" 
          />
          <span className="text-brand-ivory/40 text-[10px] uppercase tracking-[0.2em] mt-4">
            Intelligence Platform
          </span>
        </motion.div>
      </div>
    </div>
  );
}
