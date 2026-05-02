import { motion } from 'motion/react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-charcoal overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <div className="w-24 h-24 rounded-[2.5rem] bg-brand-accent flex items-center justify-center shadow-[0_0_50px_rgba(198,169,107,0.3)]">
           <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 text-brand-charcoal">
              <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
           </svg>
        </div>
        <motion.div 
          className="absolute -inset-4 rounded-[2.5rem] border border-brand-accent/20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-10 text-center"
      >
        <h1 className="font-display text-2xl font-bold uppercase tracking-[0.3em] text-brand-ivory/80">Veltrix</h1>
        <p className="text-[10px] uppercase font-bold tracking-widest text-brand-ivory/20 mt-2">AI Consciousness for Capital</p>
      </motion.div>

      <div className="absolute bottom-12 w-48 h-[2px] bg-brand-ivory/5 overflow-hidden rounded-full">
         <motion.div 
            className="h-full bg-brand-accent"
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
         />
      </div>
    </div>
  );
}
