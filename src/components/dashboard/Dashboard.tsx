import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { OperationType, Expense, Insight, Budget, Goal } from '../../types';
import ChatInterface from '../chat/ChatInterface';
import InsightsGrid from './InsightsGrid';
import Navbar from '../layout/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, MessageSquare, History, Settings, LogOut, CreditCard, PieChart, Bell, Target, ChevronRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { generateWeeklyInsight } from '../../services/aiService';
import SettingsModal from './SettingsModal';
import SupportBot from '../chat/SupportBot';
import { Toaster, toast } from 'sonner';
import SubscriptionDetector from './SubscriptionDetector';
import BudgetsView from './BudgetsView';
import AlertsView from './AlertsView';
import GoalsView from './GoalsView';
import ExpenseHistory from './ExpenseHistory';

export default function Dashboard({ user }: { user: User }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'history' | 'subs' | 'budgets' | 'alerts' | 'goals'>('chat');
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

    const budgetsPath = `users/${user.uid}/budgets`;
    const unsubBudgets = onSnapshot(collection(db, budgetsPath), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Budget));
      setBudgets(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, budgetsPath));

    const goalsPath = `users/${user.uid}/goals`;
    const unsubGoals = onSnapshot(collection(db, goalsPath), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Goal));
      setGoals(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, goalsPath));

    return () => {
      unsubExpenses();
      unsubInsights();
      unsubBudgets();
      unsubGoals();
    };
  }, [user.uid]);

  // Try to generate insights once we have data
  useEffect(() => {
    if (expenses.length >= 3 && insights.length === 0 && !isGenerating) {
      triggerAI();
    }
  }, [expenses.length, insights.length, triggerAI, isGenerating]);

  return (
    <div className="flex flex-col h-screen bg-brand-charcoal overflow-hidden pwa-container">
      <Navbar user={user} insights={insights} />
      
      <main className="flex-1 overflow-hidden relative flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col w-72 border-r border-brand-ivory/5 p-6 space-y-2 bg-brand-charcoal">
          <div className="mb-8 flex items-center gap-3 px-2">
             <div className="w-10 h-10 rounded-xl bg-brand-accent flex items-center justify-center shadow-[0_0_20px_rgba(198,169,107,0.2)]">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-brand-charcoal">
                   <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
             </div>
             <div className="flex flex-col">
               <span className="font-display font-bold text-xl tracking-tight uppercase leading-none">Veltrix</span>
               <span className="text-[8px] font-bold text-brand-accent uppercase tracking-widest mt-1">Intelligence</span>
             </div>
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
            active={activeTab === 'budgets'} 
            onClick={() => setActiveTab('budgets')} 
            icon={<PieChart className="w-5 h-5" />} 
            label="Budgets" 
          />
           <NavItem 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')} 
            icon={<Bell className="w-5 h-5" />} 
            label="Alerts" 
          />
          <NavItem 
            active={activeTab === 'goals'} 
            onClick={() => setActiveTab('goals')} 
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
        <div className="flex-1 relative flex flex-col overflow-hidden px-4 md:px-8 py-4 pb-24 md:pb-4">
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
            {activeTab === 'budgets' && (
              <motion.div
                key="budgets"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <BudgetsView user={user} expenses={expenses} budgets={budgets} />
              </motion.div>
            )}
            {activeTab === 'alerts' && (
              <motion.div
                key="alerts"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <AlertsView expenses={expenses} />
              </motion.div>
            )}
            {activeTab === 'goals' && (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="h-full overflow-y-auto no-scrollbar"
              >
                <GoalsView user={user} goals={goals} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Support and Modals */}
      <SupportBot />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />

      {/* Mobile Navigation */}
      <nav className="md:hidden flex h-20 items-center justify-around border-t border-brand-ivory/5 bg-brand-charcoal/80 backdrop-blur-xl px-4 pb-safe z-50 fixed bottom-0 left-0 right-0">
        <MobileNavItem 
          active={activeTab === 'chat'} 
          onClick={() => setActiveTab('chat')} 
          icon={<MessageSquare className="w-5 h-5" />} 
          label="AI"
        />
        <MobileNavItem 
          active={activeTab === 'dashboard'} 
          onClick={() => setActiveTab('dashboard')} 
          icon={<LayoutDashboard className="w-5 h-5" />} 
          label="Home"
        />
        <MobileNavItem 
          active={activeTab === 'history'} 
          onClick={() => setActiveTab('history')} 
          icon={<History className="w-5 h-5" />} 
          label="Stream"
        />
        <MobileNavItem 
          active={activeTab === 'alerts'} 
          onClick={() => setActiveTab('alerts')} 
          icon={<Bell className="w-5 h-5" />} 
          label="Pulse"
        />
        <MobileNavItem 
          active={isSettingsOpen} 
          onClick={() => setIsSettingsOpen(true)} 
          icon={<Settings className="w-5 h-5" />} 
          label="Set"
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

function MobileNavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`min-h-[44px] flex flex-col items-center justify-center gap-1 transition-all active:scale-90 ${
        active 
          ? 'text-brand-accent' 
          : 'text-brand-ivory/30 hover:text-brand-ivory/50'
      }`}
    >
      <div className={`p-2.5 rounded-xl transition-all ${active ? 'bg-brand-accent/10 border border-brand-accent/20' : ''}`}>
        {icon}
      </div>
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

// Remove ExpenseHistory from Dashboard.tsx as it is now modularized
