import { motion } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { ChevronRight, CreditCard, PieChart, Sparkles, Zap } from 'lucide-react';

export default function LandingPage() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-brand-charcoal/80 backdrop-blur-md border-b border-brand-ivory/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-brand-charcoal" />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">VELTRIX</span>
          </div>
          <button 
            onClick={handleLogin}
            className="text-sm font-medium hover:text-brand-accent transition-colors"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-slate text-brand-accent text-xs font-semibold tracking-wider uppercase mb-8">
              The Future of Expense Tracking
            </span>
            <h1 className="font-display text-6xl md:text-8xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-brand-ivory to-brand-ivory/50">
              Stop Guessing Where Your Money Goes.
            </h1>
            <p className="text-xl text-brand-ivory/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Veltrix uses advanced AI to transform simple text entries into deep financial intelligence. 
              Chat-first, intelligence-led, and obsessively refined.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-ivory text-brand-charcoal font-bold text-lg hover:shadow-[0_0_20px_rgba(245,245,243,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                Start Tracking in Seconds
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="flex items-center gap-2 p-4 border-b border-brand-ivory/5 bg-brand-charcoal/50">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <div className="flex-1 text-center text-xs text-brand-ivory/40">Veltrix Intelligence Agent</div>
            </div>
            <div className="p-8 h-[400px] overflow-y-auto space-y-6 no-scrollbar">
              <Message type="user" text="chai 20" delay={1} />
              <Message type="ai" text="Logged ₹20 for Tea (Food). Total food spend today is ₹20." delay={2} />
              <Message type="user" text="uber to office 150" delay={3.5} />
              <Message type="ai" text="Logged ₹150 for Uber (Transport). You've spent more on transport this week than last week." delay={4.5} />
            </div>
            <div className="p-4 bg-brand-charcoal/50 border-t border-brand-ivory/5">
              <div className="bg-brand-slate/50 rounded-xl p-3 text-brand-ivory/30 flex justify-between items-center">
                <span>Try: "zomato dinner 300"</span>
                <div className="w-8 h-8 rounded-lg bg-brand-accent/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-brand-accent" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-brand-accent" />}
            title="Instant Logging"
            description="No complex forms. Just type like you're texting a friend. Our AI handles the rest."
          />
          <FeatureCard 
            icon={<PieChart className="w-6 h-6 text-brand-accent" />}
            title="Behavioral Insights"
            description="Understand patterns you didn't know existed. We tell you 'why' you spend, not just 'how much'."
          />
          <FeatureCard 
            icon={<CreditCard className="w-6 h-6 text-brand-accent" />}
            title="Leak Detection"
            description="Identify recurring micro-expenses and forgotten subscriptions that drain your wallet."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-brand-ivory/5 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="font-display text-2xl font-bold mb-8">VELTRIX</div>
          <div className="flex justify-center gap-8 text-brand-ivory/40 text-sm mb-12">
            <a href="#" className="hover:text-brand-ivory transition-colors">Privacy</a>
            <a href="#" className="hover:text-brand-ivory transition-colors">Terms</a>
            <a href="#" className="hover:text-brand-ivory transition-colors">Twitter</a>
          </div>
          <div className="text-brand-ivory/20 text-xs">
            © 2026 Veltrix Intelligence. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function Message({ type, text, delay }: { type: 'user' | 'ai', text: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: type === 'user' ? 20 : -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl ${
        type === 'user' 
          ? 'bg-brand-accent text-brand-charcoal rounded-tr-none font-medium' 
          : 'bg-brand-slate text-brand-ivory rounded-tl-none border border-brand-ivory/5'
      }`}>
        {text}
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl glass-card text-left group transition-all"
    >
      <div className="mb-6 p-3 rounded-xl bg-brand-charcoal inline-block border border-brand-ivory/5 group-hover:border-brand-accent/50 transition-colors">
        {icon}
      </div>
      <h3 className="font-display text-xl font-bold mb-4">{title}</h3>
      <p className="text-brand-ivory/50 leading-relaxed">{description}</p>
    </motion.div>
  );
}
