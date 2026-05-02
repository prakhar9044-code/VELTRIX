import { motion } from 'motion/react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { ChevronRight, CreditCard, PieChart, Sparkles, Zap, Shield, HelpCircle, CheckCircle } from 'lucide-react';

export default function LandingPage({ onShowAuth }: { onShowAuth: () => void }) {
  const handleLogin = () => {
    onShowAuth();
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
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-accent text-brand-charcoal font-bold text-lg hover:shadow-[0_0_40px_rgba(198,169,107,0.3)] transition-all flex items-center justify-center gap-2 group"
              >
                Start Tracking
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-brand-slate text-brand-ivory font-bold text-lg hover:bg-brand-slate/80 transition-all">
                View Demo
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`}
                    alt="User"
                    className="w-10 h-10 rounded-full border-2 border-brand-charcoal grayscale"
                  />
                ))}
              </div>
              <div className="text-left">
                <div className="flex gap-1 text-brand-accent">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Sparkles key={i} className="w-3 h-3 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-brand-ivory/40">Trusted by <span className="text-brand-ivory font-bold">20,000+ users</span></p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Feature Grid */}
      <section className="px-6 mb-32">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureBadge 
            icon={<Zap className="w-5 h-5 text-brand-accent" />}
            title="Chat-Based Tracking"
            desc="Log expenses in natural language via AI."
          />
          <FeatureBadge 
            icon={<Sparkles className="w-5 h-5 text-brand-accent" />}
            title="AI Insights"
            desc="Smart insights about your spending habits."
          />
          <FeatureBadge 
            icon={<Shield className="w-5 h-5 text-brand-accent" />}
            title="Leak Detection"
            desc="Find hidden leaks and save more money."
          />
        </div>
      </section>

      {/* Powered by AI Agents Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 tracking-tight">Powered by AI Agents</h2>
          <p className="text-brand-ivory/40 mb-16 max-w-xl mx-auto">Veltrix is a team of specialized AI agents working together to optimize your financial intelligence.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <AgentCard 
              name="V-Parse" 
              desc="Understands your messages and extracts expenses with 99.9% accuracy." 
              icon={<Zap className="w-6 h-6 text-brand-accent" />} 
            />
            <AgentCard 
              name="V-Insight" 
              desc="Analyzes patterns and generates powerful behavioral insights." 
              icon={<Sparkles className="w-6 h-6 text-brand-accent" />} 
            />
            <AgentCard 
              name="V-Guard" 
              desc="Detects leaks, ghost subscriptions, and unnecessary spending." 
              icon={<Shield className="w-6 h-6 text-brand-accent" />} 
            />
            <AgentCard 
              name="V-Coach" 
              desc="Guides you with smart nudges to build better capital discipline." 
              icon={<HelpCircle className="w-6 h-6 text-brand-accent" />} 
            />
          </div>
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

      {/* Pricing Section */}
      <section className="py-40 px-6">
        <div className="max-w-7xl mx-auto text-center">
            <h2 className="font-display text-6xl font-bold mb-4 tracking-tighter uppercase">Scale with Veltrix</h2>
            <p className="text-brand-ivory/40 text-lg mb-12">Precise intelligence for every stage of capital.</p>
            
            <div className="flex items-center justify-center gap-4 mb-20">
               <span className="text-sm font-bold text-brand-ivory/40">Monthly</span>
               <div className="w-12 h-6 rounded-full bg-brand-slate relative p-1 cursor-pointer">
                  <div className="w-4 h-4 rounded-full bg-brand-accent absolute left-1" />
               </div>
               <span className="text-sm font-bold text-brand-ivory/80">Yearly</span>
               <span className="bg-brand-accent/20 text-brand-accent text-[10px] font-bold px-3 py-1 rounded-full uppercase ml-2">2 Months Free</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
               <PricingCard 
                  tier="Basic" 
                  price="0" 
                  desc="Perfect for individuals tracking daily micro-expenses." 
                  features={["Unlimited Expense Logs", "Daily Money Score", "Basic Weekly Analytics"]}
                  onSelect={handleLogin}
               />
               <PricingCard 
                  tier="Pro" 
                  price="49" 
                  popular 
                  desc="Advanced insights for serious financial optimization." 
                  features={["AI Behavioral Coaching", "Subscription Pulse", "Smart Impulse Alerts", "Custom Categories"]}
                  onSelect={handleLogin}
               />
               <PricingCard 
                  tier="Business" 
                  price="199" 
                  desc="Team-wide consciousness for group expenditure." 
                  features={["Multi-user Spaces", "Shared Budgets", "Advanced Data Export", "API Access"]}
                  onSelect={handleLogin}
               />
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

function PricingCard({ tier, price, desc, features, popular, onSelect }: { tier: string, price: string, desc: string, features: string[], popular?: boolean, onSelect: () => void }) {
  return (
    <div className={`p-10 rounded-[3rem] border transition-all ${popular ? 'bg-brand-accent text-brand-charcoal border-brand-accent shadow-[0_20px_50px_rgba(198,169,107,0.15)] scale-105 z-10' : 'glass-card border-brand-ivory/5 hover:border-brand-accent/20'}`}>
      <div className="flex justify-between items-start mb-4">
         <div className={`text-[10px] font-bold uppercase tracking-widest ${popular ? 'text-brand-charcoal/60' : 'text-brand-accent'}`}>{tier}</div>
         {popular && <div className="text-[8px] font-bold uppercase tracking-widest bg-brand-charcoal text-brand-accent px-2 py-1 rounded-md">Most Popular</div>}
      </div>
      <div className="flex items-baseline gap-1 mb-6">
         <span className="text-4xl font-display font-bold">₹{price}</span>
         <span className={`text-xs font-bold ${popular ? 'text-brand-charcoal/40' : 'text-brand-ivory/40'}`}>/MO</span>
      </div>
      <p className={`text-sm mb-10 leading-relaxed font-medium ${popular ? 'text-brand-charcoal/60' : 'text-brand-ivory/40'}`}>{desc}</p>
      <ul className="space-y-4 mb-12">
        {features.map((f, i) => (
          <li key={i} className="flex items-center gap-3 text-xs font-bold">
            <CheckCircle className={`w-4 h-4 ${popular ? 'text-brand-charcoal' : 'text-brand-accent'}`} />
            <span className={popular ? 'text-brand-charcoal/80' : 'text-brand-ivory/70'}>{f}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onSelect}
        className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${popular ? 'bg-brand-charcoal text-white hover:opacity-90' : 'border border-brand-ivory/10 hover:bg-brand-ivory hover:text-brand-charcoal'}`}
      >
        Get Started
      </button>
    </div>
  );
}

function FeatureBadge({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="p-8 rounded-3xl glass-card border-brand-ivory/5 group hover:border-brand-accent/20 transition-all">
      <div className="w-12 h-12 rounded-2xl bg-brand-charcoal flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-lg font-bold mb-2">{title}</h4>
      <p className="text-sm text-brand-ivory/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function AgentCard({ name, desc, icon }: { name: string, desc: string, icon: React.ReactNode }) {
  return (
    <div className="p-8 rounded-[2.5rem] bg-brand-slate/30 border border-brand-ivory/5 hover:border-brand-accent/20 transition-all group">
      <div className="w-12 h-12 rounded-2xl bg-brand-accent/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h4 className="text-xl font-display font-bold mb-2 group-hover:text-brand-accent transition-colors">{name}</h4>
      <p className="text-sm text-brand-ivory/40 leading-relaxed">{desc}</p>
    </div>
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
