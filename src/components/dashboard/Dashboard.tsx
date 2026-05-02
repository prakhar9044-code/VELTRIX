import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { OperationType, Expense, Insight } from '../../types';
import ChatInterface from '../chat/ChatInterface';
import InsightsGrid from './InsightsGrid';
import Navbar from '../layout/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, MessageSquare, History, Settings, LogOut, Sparkles, CreditCard, PieChart, Bell, Target, ChevronRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { generateWeeklyInsight } from '../../services/aiService';
import SettingsModal from './SettingsModal';
import SupportBot from '../chat/SupportBot';
import { Toaster, toast } from 'sonner';
import SubscriptionDetector from './SubscriptionDetector';

export default function Dashboard({ user }: { user: User }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'history' | 'subs'>('chat');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    toast.success(`Welcome back, ${user.displayName || 'Friend'}`);
  }, [user]);

  const triggerAI = useCallback(async () => {
    if (expenses.length < 3 || insights.length > 0) return;
    setIsGenerating(true);
    try {
      await generateWeeklyInsight(user.uid, expenses);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  }, [user.uid, expenses, insights]);

  useEffect(() => {
    const expensesPath = `users/${user.uid}/expenses`;
    const qExpenses = query(
      collection(db, expensesPath), 
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );
    
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, expensesPath));

    const insightsPath = `users/${user.uid}/insights`;
    const qInsights = query(
      collection(db, insightsPath), 
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubInsights = onSnapshot(qInsights, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Insight));
      setInsights(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, insightsPath));

    return () => {
      unsubExpenses();
      unsubInsights();
    };
  }, [user.uid]);

  // Try to generate insights once we have data
  useEffect(() => {
    if (expenses.length >= 3 && insights.length === 0 && !isGenerating) {
      triggerAI();
    }
  }, [expenses.length, insights.length, triggerAI, isGenerating]);

  return (
    <div className="flex flex-col h-screen bg-brand-charcoal overflow-hidden">
      <Navbar user={user} />
      
      <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        <nav className="hidden md:flex flex-col w-72 border-r border-brand-ivory/5 p-6 space-y-2">
          <div className="mb-8 flex items-center gap-3 px-2">
             <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-brand-charcoal" />
             </div>
             <span className="font-display font-bold text-xl tracking-tight uppercase">Veltrix</span>
          </div>

          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
          />
          <NavItem 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="Veltrix AI" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History className="w-5 h-5" />} 
            label="Transactions" 
          />
          <NavItem 
            active={activeTab === 'subs'} 
            onClick={() => setActiveTab('subs')} 
            icon={<CreditCard className="w-5 h-5" />} 
            label="Subscriptions" 
          />
          <NavItem 
            active={false} 
            onClick={() => toast.info("Coming soon")} 
            icon={<PieChart className="w-5 h-5" />} 
            label="Budgets" 
          />
           <NavItem 
            active={false} 
            onClick={() => toast.info("Coming soon")} 
            icon={<Bell className="w-5 h-5" />} 
            label="Alerts" 
          />
          <NavItem 
            active={false} 
            onClick={() => toast.info("Coming soon")} 
            icon={<Target className="w-5 h-5" />} 
            label="Goals" 
          />
          <NavItem 
            active={isSettingsOpen} 
            onClick={() => setIsSettingsOpen(true)} 
            icon={<Settings className="w-5 h-5" />} 
            label="Settings" 
          />

          <div className="mt-auto pt-6 border-t border-brand-ivory/5">
            <div 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-brand-slate/50 hover:bg-brand-slate transition-all cursor-pointer group"
            >
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
                alt="Profile" 
                className="w-10 h-10 rounded-xl grayscale group-hover:grayscale-0 transition-all"
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 overflow-hidden">
                <div className="text-xs font-bold truncate">{user.displayName || 'Prakhar Verma'}</div>
                <div className="text-[10px] text-brand-accent font-bold uppercase tracking-tighter">Premium Plan</div>
              </div>
              <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </nav>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col overflow-hidden px-4 md:px-8 py-4">
          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full"
              >
                <ChatInterface user={user} expenses={expenses} />
              </motion.div>
            )}
            {activeTab === 'dashboard' && (
              <motion.div
                key="insights"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <InsightsGrid user={user} expenses={expenses} insights={insights} />
              </motion.div>
            )}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <ExpenseHistory expenses={expenses} />
              </motion.div>
            )}
            {activeTab === 'subs' && (
              <motion.div
                key="subs"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <SubscriptionDetector expenses={expenses} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Support and Modals */}
      <SupportBot />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />

      {/* Mobile Navigation */}
      <nav className="md:hidden flex h-20 items-center justify-around border-t border-brand-ivory/5 bg-brand-charcoal px-6 pb-2">
        <MobileNavItem 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare className="w-6 h-6" />} 
        />
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard className="w-6 h-6" />} 
        />
        <MobileNavItem 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History className="w-6 h-6" />} 
        />
      </nav>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
        active 
          ? 'bg-brand-ivory text-brand-charcoal font-semibold shadow-xl' 
          : 'text-brand-ivory/60 hover:text-brand-ivory hover:bg-brand-slate/50'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function MobileNavItem({ active, onClick, icon }: { active: boolean, onClick: () => void, icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`p-3 rounded-2xl transition-all ${
        active 
          ? 'bg-brand-accent text-brand-charcoal scale-110 shadow-lg' 
          : 'text-brand-ivory/40'
      }`}
    >
      {icon}
    </button>
  );
}

function ExpenseHistory({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="space-y-4 pb-12">
      <h2 className="font-display text-2xl font-bold mb-6">Recent Activity</h2>
      {expenses.length === 0 ? (
        <div className="text-center py-20 text-brand-ivory/30">No expenses logged yet.</div>
      ) : (
        expenses.map(expense => (
          <div key={expense.id} className="p-4 rounded-xl border border-brand-ivory/5 bg-brand-slate/20 flex items-center justify-between group hover:border-brand-accent/30 transition-all">
            <div>
              <div className="font-medium text-lg">{expense.description}</div>
              <div className="text-sm text-brand-ivory/40 flex items-center gap-2">
                <span className="bg-brand-slate px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">{expense.category}</span>
                {new Date(expense.timestamp).toLocaleDateString()}
              </div>
            </div>
            <div className="text-xl font-display font-bold">
              ₹{expense.amount.toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
