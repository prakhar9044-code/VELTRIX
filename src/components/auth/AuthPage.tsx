import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Github } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { toast } from 'sonner';

export default function AuthPage({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSocialLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Welcome to Veltrix");
    } catch (err) {
      toast.error("Authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-brand-charcoal flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
           <div className="w-12 h-12 rounded-xl bg-brand-accent flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-6 h-6 text-brand-charcoal" />
           </div>
           <h1 className="font-display text-2xl font-bold uppercase tracking-tight">Veltrix</h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-[2.5rem] p-10"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
            >
              <button 
                onClick={onBack}
                className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/20 hover:text-brand-accent mb-6 transition-colors flex items-center gap-2"
              >
                 ← Go Back
              </button>
              <h2 className="text-xl font-bold mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-sm text-brand-ivory/40 mb-8">
                {mode === 'login' ? 'Continue your journey with Veltrix.' : 'Start your journey with Veltrix.'}
              </p>

              <div className="space-y-4">
                 <button 
                  onClick={handleSocialLogin}
                  className="w-full py-3 rounded-xl border border-brand-ivory/10 flex items-center justify-center gap-3 hover:bg-brand-ivory/5 transition-all font-medium text-sm"
                 >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4 grayscale" alt="Google" />
                    Continue with Google
                 </button>
                 <button className="w-full py-3 rounded-xl border border-brand-ivory/10 flex items-center justify-center gap-3 hover:bg-brand-ivory/5 transition-all font-medium text-sm">
                    <Github className="w-4 h-4" />
                    Continue with GitHub
                 </button>
              </div>

              <div className="relative my-8">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-brand-ivory/5"></div></div>
                 <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-brand-slate px-4 text-brand-ivory/20 font-bold">or email</span></div>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30 mb-2 px-1">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="hello@veltrix.com"
                      className="w-full bg-brand-charcoal/50 border border-brand-ivory/5 rounded-xl px-4 py-3 outline-none focus:border-brand-accent/50 transition-colors"
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-ivory/30 mb-2 px-1">Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-brand-charcoal/50 border border-brand-ivory/5 rounded-xl px-4 py-3 outline-none focus:border-brand-accent/50 transition-colors"
                    />
                 </div>

                 {mode === 'signup' && (
                    <div className="flex items-center gap-3 px-1">
                       <input type="checkbox" id="terms" className="accent-brand-accent rounded" />
                       <label htmlFor="terms" className="text-[10px] text-brand-ivory/40">I agree to the <span className="text-brand-accent hover:underline cursor-pointer">Terms & Conditions</span></label>
                    </div>
                 )}

                 <button className="w-full py-4 rounded-xl bg-brand-accent text-brand-charcoal font-bold text-sm hover:shadow-[0_0_20px_rgba(198,169,107,0.2)] transition-all">
                    {mode === 'login' ? 'Login' : 'Sign Up'}
                 </button>
              </form>

              <div className="mt-8 text-center">
                 <button 
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-xs text-brand-ivory/40 hover:text-brand-accent transition-colors"
                 >
                    {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                 </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
