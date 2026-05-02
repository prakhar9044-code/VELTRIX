import { useState, useEffect, useCallback } from 'react';
import { User } from 'firebase/auth';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { OperationType, Expense, Insight } from '../../types';
import ChatInterface from '../chat/ChatInterface';
import InsightsGrid from './InsightsGrid';
import Navbar from '../layout/Navbar';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, MessageSquare, History, Settings, LogOut, Sparkles } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { generateWeeklyInsight } from '../../services/aiService';
import SettingsModal from './SettingsModal';
import SupportBot from '../chat/SupportBot';
import { Toaster, toast } from 'sonner';

export default function Dashboard({ user }: { user: User }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard' | 'history'>('chat');
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
    const qExpenses = query(collection(db, expensesPath), orderBy('timestamp', 'desc'));
    
    const unsubExpenses = onSnapshot(qExpenses, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(data);
    }, (error) => handleFirestoreError(error, OperationType.LIST, expensesPath));

    const insightsPath = `users/${user.uid}/insights`;
    const qInsights = query(collection(db, insightsPath), orderBy('timestamp', 'desc'));

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
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex flex-col w-64 border-r border-brand-ivory/5 p-6 gap-2">
          <NavItem 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
            icon={<MessageSquare className="w-5 h-5" />} 
            label="Intelligent Chat" 
          />
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Insights Grid" 
          />
          <NavItem 
            active={activeTab === 'history'} 
            onClick={() => setActiveTab('history')} 
            icon={<History className="w-5 h-5" />} 
            label="Log History" 
          />
          <div className="mt-auto pt-6 border-t border-brand-ivory/5 space-y-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate/50 transition-all"
            >
              <Settings className="w-5 h-5" />
              Settings
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="flex items-center gap-3 w-full p-3 rounded-xl text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
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
          </AnimatePresence>
        </div>
      </main>

      {/* Support and Modals */}
      <SupportBot />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} />
      <Toaster richColors position="top-right" theme="dark" />

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
