import { motion } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { ChevronRight, CreditCard, PieChart, Sparkles, Zap, Shield, HelpCircle, CheckCircle } from 'lucide-react';

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
              Early Access • v1.0
            </span>
            <h1 className="font-display text-7xl md:text-9xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-brand-ivory to-brand-ivory/50">
              Wealth is <br /> Intelligent.
            </h1>
            <p className="text-xl text-brand-ivory/60 mb-12 max-w-2xl mx-auto leading-relaxed">
              Veltrix is the high-end expense intelligence platform that treats your daily spending like a venture profile. 
              Minimal effort. Maximum clarity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={handleLogin}
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-ivory text-brand-charcoal font-bold text-lg hover:shadow-[0_0_40px_rgba(245,245,243,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                Secure Access
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="text-xs text-brand-ivory/20 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bank-grade encryption
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Detail: How it works */}
      <section className="py-32 px-6 bg-brand-slate/10 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-8 tracking-tight">The 3-Second <br /> Log Loop.</h2>
            <div className="space-y-12">
              <Step number="01" title="Capture" desc="Message Veltrix like you text a friend. 'Uber 150', 'Grocery 2k', 'Zomato 400'." />
              <Step number="02" title="Analyze" desc="Our Liquid-category AI parses the intent, amount, and behavioral context instantly." />
              <Step number="03" title="Evolve" desc="Receive weekly behavioral coaching that actually identifies money leaks." />
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute inset-0 bg-brand-accent/20 blur-[100px] rounded-full" />
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="relative glass-card p-10 rounded-[3rem] border-brand-accent/20"
            >
              <div className="space-y-6">
                 <div className="h-4 w-2/3 bg-brand-ivory/10 rounded-full" />
                 <div className="h-4 w-1/2 bg-brand-ivory/10 rounded-full" />
                 <div className="h-20 w-full bg-brand-accent/10 rounded-2xl flex items-center justify-center border border-brand-accent/20">
                    <Sparkles className="w-8 h-8 text-brand-accent" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 rounded-2xl bg-brand-slate/50 border border-white/5" />
                    <div className="h-24 rounded-2xl bg-brand-slate/50 border border-white/5" />
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing / Access Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-display text-5xl font-bold mb-16 tracking-tight">Uncompromising Privacy. <br /> Straightforward Pricing.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div className="p-10 rounded-[2.5rem] glass-card text-left">
                    <div className="text-brand-accent font-bold uppercase tracking-widest text-xs mb-4">Veltrix Core</div>
                    <div className="text-4xl font-bold mb-6">Free</div>
                    <ul className="space-y-4 text-brand-ivory/60 mb-10">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> Unlimited Chat Logs</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> Basic Monthly Insights</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-accent" /> PWA Mobile App</li>
                    </ul>
                    <button onClick={handleLogin} className="w-full py-4 rounded-xl border border-brand-ivory/10 hover:bg-brand-ivory hover:text-brand-charcoal transition-all font-bold">Start Free</button>
                </div>
                <div className="p-10 rounded-[2.5rem] bg-brand-accent text-brand-charcoal text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><Sparkles className="w-20 h-20" /></div>
                    <div className="text-brand-charcoal/60 font-bold uppercase tracking-widest text-xs mb-4">Veltrix Platinum</div>
                    <div className="text-4xl font-bold mb-6">Invites Only</div>
                    <ul className="space-y-4 text-brand-charcoal/80 mb-10">
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal" /> Multi-user Budgets</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal" /> Advanced Coaching Agent</li>
                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-charcoal" /> Bank API Connectivity</li>
                    </ul>
                    <button className="w-full py-4 rounded-xl bg-brand-charcoal text-brand-ivory font-bold opacity-30 cursor-not-allowed">Join Waitlist</button>
                </div>
            </div>
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

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6 group">
      <div className="text-3xl font-display font-bold text-brand-accent/20 group-hover:text-brand-accent transition-colors">{number}</div>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-brand-ivory/40 text-sm leading-relaxed">{desc}</p>
      </div>
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
