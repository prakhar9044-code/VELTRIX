import { useState, useRef, useEffect, useMemo } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { parseExpense } from '../../lib/gemini';
import ai from '../../lib/gemini';
import { OperationType, Expense } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  User as UserIcon, 
  Plus, 
  MessageSquare, 
  LayoutDashboard, 
  History, 
  Target, 
  TrendingUp, 
  PieChart, 
  Mic, 
  MoreHorizontal,
  ChevronRight,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
  cardData?: any;
}

export default function ChatInterface({ user, expenses }: { user: User, expenses: Expense[] }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesPath = `users/${user.uid}/messages`;
    const q = query(collection(db, messagesPath), orderBy('timestamp', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: (doc.data().timestamp as any)?.toDate() || new Date()
      } as Message));
      setMessages(msgs);
    }, (error) => handleFirestoreError(error, OperationType.LIST, messagesPath));

    return () => unsubscribe();
  }, [user.uid]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const recentChats = [
    { id: '1', title: 'Weekend Dining Sprawl', time: '2h ago' },
    { id: '2', title: 'Monthly Budget Sync', time: 'Yesterday' },
    { id: '3', title: 'Impuse Coffee Leak', time: '3 days ago' },
  ];

  const quickActions = [
    "How can I save more?",
    "Show weekly summary",
    "Is my budget on track?",
    "Analyze recent coffee leaks"
  ];

  const handleSubmit = async (textOverride?: string) => {
    const text = textOverride || input;
    if (!text.trim() || isTyping) return;

    const messagesPath = `users/${user.uid}/messages`;
    
    const userMsgData = {
      type: 'user',
      text,
      timestamp: serverTimestamp()
    };

    setInput('');
    setIsTyping(true);

    try {
      await addDoc(collection(db, messagesPath), userMsgData);

      const parsedData = await parseExpense(text);
      const isQuestion = text.toLowerCase().includes('?') || text.toLowerCase().includes('how') || text.toLowerCase().includes('where') || text.toLowerCase().includes('analyze') || text.toLowerCase().includes('summary');
      
      if (isQuestion) {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Context: User has logged ${expenses.length} expenses totalling ₹${expenses.reduce((s, e) => s+e.amount, 0)}. Recent categories: ${[...new Set(expenses.map(e => e.category))].join(', ')}. Question: ${text}`,
          config: {
            systemInstruction: "You are Veltrix Portfolio Analyst. Be professional, concise and use numbers to prove points. If they ask for a summary, give a brief breakdown. If they ask about saving, suggest one specific area based on the context provided.",
          }
        });
        
        const aiMsgData: any = {
          type: 'ai',
          text: response.text || "I couldn't process that. Try again.",
          timestamp: serverTimestamp(),
        };

        if (text.toLowerCase().includes('summary') || text.toLowerCase().includes('analyze')) {
          aiMsgData.cardData = {
            type: 'summary',
            total: expenses.reduce((s, e) => s + e.amount, 0),
            velocity: Math.round(expenses.reduce((s, e) => s + e.amount, 0) / 7),
            topCategory: [...new Set(expenses.map(e => e.category))][0] || 'N/A'
          };
        }
        
        await addDoc(collection(db, messagesPath), aiMsgData);
      } else {
        // Proceed with logging expense...
        const expensesPath = `users/${user.uid}/expenses`;
        await addDoc(collection(db, expensesPath), {
          userId: user.uid,
          rawText: text,
          amount: parsedData.amount,
          currency: parsedData.currency || 'INR',
          category: parsedData.category,
          description: parsedData.description || text,
          date: new Date().toISOString(),
          timestamp: new Date().toISOString(),
          isAIProcessed: true,
          tags: parsedData.tags || []
        });

        const responseText = `Understood. Logged ₹${parsedData.amount} for ${parsedData.description} into ${parsedData.category}. Your capital velocity has been recalculated.`;
        
        await addDoc(collection(db, messagesPath), {
          type: 'ai',
          text: responseText,
          timestamp: serverTimestamp(),
          cardData: {
            type: 'log',
            amount: parsedData.amount,
            category: parsedData.category
          }
        });
      }
    } catch (error) {
      console.error(error);
      await addDoc(collection(db, messagesPath), {
        type: 'ai',
        text: "I'm sorry, I couldn't process that entry. Could you try rephrasing it? (e.g., 'coffee 50')",
        timestamp: serverTimestamp(),
        status: 'error'
      });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-full bg-[#0F1115] overflow-hidden rounded-[2.5rem] border border-brand-ivory/5 shadow-2xl relative">
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative bg-transparent">
        {/* Header */}
        <header className="h-20 border-b border-brand-ivory/5 flex items-center justify-between px-8 bg-[#0F1115]/80 backdrop-blur-md z-10 transition-all">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-2xl bg-brand-accent/20 flex items-center justify-center shadow-lg shadow-brand-accent/5">
                <Sparkles className="w-5 h-5 text-brand-accent" />
             </div>
             <div>
                <h2 className="text-base font-bold text-brand-ivory tracking-tight">Veltrix Intelligence</h2>
                <div className="flex items-center gap-1.5">
                   <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                   <span className="text-[10px] font-bold uppercase text-green-500 tracking-widest">Neural Stream Active</span>
                </div>
             </div>
          </div>
          <div className="flex items-center gap-2">
             <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-accent/10 text-brand-accent text-xs font-bold border border-brand-accent/20 hover:bg-brand-accent hover:text-brand-charcoal transition-all">
                <Plus className="w-4 h-4" />
                <span>New Session</span>
             </button>
             <button className="p-3 rounded-xl hover:bg-brand-ivory/5 transition-all text-brand-ivory/40">
                <SearchIcon className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Messages List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-8 space-y-8 no-scrollbar scroll-smooth">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
               <motion.div 
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="w-20 h-20 rounded-[2rem] bg-brand-accent/10 flex items-center justify-center mb-8 relative"
               >
                  <Sparkles className="w-10 h-10 text-brand-accent animate-pulse" />
                  <div className="absolute inset-0 rounded-[2rem] border border-brand-accent/20 animate-ping [animation-duration:3s]" />
               </motion.div>
               <h1 className="text-3xl font-display font-bold text-brand-ivory mb-4 tracking-tight">How can I assist your portfolio today?</h1>
               <p className="text-brand-ivory/40 text-sm leading-relaxed mb-10">
                 Ask me to log an expense, analyze your spending patterns, or help you track your financial ambitions in real-time.
               </p>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
                  {quickActions.map((action, i) => (
                    <motion.button
                      key={action}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => handleSubmit(action)}
                      className="px-6 py-4 rounded-2xl bg-brand-slate/30 border border-brand-ivory/5 hover:border-brand-accent/30 hover:bg-brand-slate/50 transition-all text-left text-sm text-brand-ivory/60 group"
                    >
                      <div className="flex items-center justify-between">
                         <span>{action}</span>
                         <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </div>
                    </motion.button>
                  ))}
               </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((msg, idx) => (
              <ChatMessage key={msg.id} msg={msg} idx={idx} />
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4"
            >
               <div className="w-8 h-8 rounded-full bg-brand-accent/10 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-brand-accent animate-spin [animation-duration:3s]" />
               </div>
               <div className="bg-brand-slate/30 border border-brand-ivory/5 px-6 py-4 rounded-3xl rounded-tl-none">
                  <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-bounce" />
                  </div>
               </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Floating Actions Pill */}
        {messages.length > 0 && !isTyping && (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="absolute bottom-28 left-0 right-0 flex justify-center px-6"
           >
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                 {quickActions.slice(0, 3).map(action => (
                   <button 
                     key={action}
                     onClick={() => handleSubmit(action)}
                     className="px-4 py-2 rounded-full bg-[#1A1D24]/80 backdrop-blur-sm border border-brand-ivory/10 text-[10px] font-bold text-brand-ivory/60 hover:text-brand-accent hover:border-brand-accent/30 transition-all whitespace-nowrap"
                   >
                     {action}
                   </button>
                 ))}
              </div>
           </motion.div>
        )}

        {/* Input Bar */}
        <div className="p-6 bg-[#0F1115]/50 backdrop-blur-xl border-t border-brand-ivory/5">
           <form 
             onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
             className="max-w-4xl mx-auto relative group"
           >
              <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button type="button" className="p-2 rounded-lg hover:bg-brand-ivory/5 transition-all text-brand-ivory/30">
                    <Plus className="w-5 h-5" />
                 </button>
              </div>
              
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Veltrix about your capital..."
                className="w-full bg-[#1A1D24] border border-brand-ivory/10 rounded-2xl py-5 pl-14 pr-24 focus:outline-none focus:border-brand-accent/50 transition-all text-brand-ivory placeholder:text-brand-ivory/20 shadow-inner"
              />

              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <button type="button" className="p-2 rounded-lg hover:bg-brand-ivory/5 transition-all text-brand-ivory/30">
                    <Mic className="w-5 h-5" />
                 </button>
                 <button 
                   type="submit"
                   disabled={!input.trim() || isTyping}
                   className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                     input.trim() && !isTyping 
                       ? 'bg-brand-accent text-brand-charcoal scale-100 shadow-lg shadow-brand-accent/20' 
                       : 'bg-brand-slate text-brand-ivory/20 scale-90 opacity-50'
                   }`}
                 >
                    <Send className="w-5 h-5" />
                 </button>
              </div>
           </form>
        </div>
      </main>

      {/* Floating AI Visual */}
      <div className="absolute bottom-24 right-10 pointer-events-none z-50 overflow-visible">
         <motion.div
           animate={{ 
             y: [0, -15, 0],
             rotate: [0, 2, -2, 0]
           }}
           transition={{ 
             duration: 6, 
             repeat: Infinity, 
             ease: "easeInOut" 
           }}
           className="w-32 h-32 relative hidden lg:block"
         >
            <div className="absolute inset-0 bg-brand-accent/10 blur-3xl rounded-full" />
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_0_30px_rgba(198,169,107,0.4)]">
               <defs>
                  <linearGradient id="robotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                     <stop offset="0%" stopColor="#C6A96B" />
                     <stop offset="100%" stopColor="#8A764A" />
                  </linearGradient>
               </defs>
               <motion.path 
                 d="M100 40C70 40 50 60 50 90C50 120 70 140 100 140C130 140 150 120 150 90C150 60 130 40 100 40Z" 
                 fill="url(#robotGrad)"
                 animate={{ d: isTyping ? [
                    "M100 40C70 40 50 60 50 90C50 120 70 140 100 140C130 140 150 120 150 90C150 60 130 40 100 40Z",
                    "M100 35C65 35 45 60 45 95C45 130 65 155 100 155C135 155 155 130 155 95C155 60 135 35 100 35Z",
                    "M100 40C70 40 50 60 50 90C50 120 70 140 100 140C130 140 150 120 150 90C150 60 130 40 100 40Z"
                 ] : "M100 40C70 40 50 60 50 90C50 120 70 140 100 140C130 140 150 120 150 90C150 60 130 40 100 40Z" }}
                 transition={{ duration: 0.5, repeat: isTyping ? Infinity : 0 }}
               />
               <circle cx="80" cy="85" r="12" fill="#0F1115" opacity="0.8" />
               <circle cx="120" cy="85" r="12" fill="#0F1115" opacity="0.8" />
               <motion.circle 
                 cx="80" cy="85" r="4" fill="#C6A96B"
                 animate={{ scale: [1, 1.5, 1] }} 
                 transition={{ duration: 2, repeat: Infinity }}
               />
               <motion.circle 
                 cx="120" cy="85" r="4" fill="#C6A96B"
                 animate={{ scale: [1, 1.5, 1] }} 
                 transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
               />
               <rect x="80" y="110" width="40" height="4" rx="2" fill="#0F1115" opacity="0.3" />
            </svg>
         </motion.div>
      </div>

    </div>
  );
}

function SidebarNavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
      active 
        ? 'bg-brand-ivory/5 text-brand-ivory' 
        : 'text-brand-ivory/40 hover:text-brand-ivory/60 hover:bg-brand-ivory/5'
    }`}>
      {icon}
      <span>{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-accent shadow-[0_0_8px_#C6A96B]" />}
    </button>
  );
}

function ChatMessage({ msg, idx }: { msg: Message, idx: number }) {
  const isUser = msg.type === 'user';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      className={`flex gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
        isUser ? 'bg-brand-slate text-brand-ivory' : 'bg-brand-accent text-brand-charcoal'
      }`}>
        {isUser ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </div>
      
      <div className={`flex flex-col gap-3 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
         <div className={`px-6 py-4 rounded-[2rem] text-sm shadow-xl ${
           isUser 
             ? 'bg-brand-ivory text-brand-charcoal font-medium rounded-tr-none' 
             : 'bg-brand-slate/40 text-brand-ivory/90 border border-brand-ivory/5 rounded-tl-none backdrop-blur-sm'
         }`}>
            {msg.text}
         </div>

         {msg.cardData && <AICard data={msg.cardData} />}

         <span className="text-[10px] text-brand-ivory/20 font-bold uppercase tracking-widest px-2">
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </span>
      </div>
    </motion.div>
  );
}

function AICard({ data }: { data: any }) {
  if (data.type === 'summary') {
    const chartData = [
      { name: 'Mon', value: 400 },
      { name: 'Tue', value: 300 },
      { name: 'Wed', value: 600 },
      { name: 'Thu', value: 200 },
      { name: 'Fri', value: 800 },
      { name: 'Sat', value: 500 },
      { name: 'Sun', value: 900 },
    ];

    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full bg-[#1A1D24] border border-brand-accent/20 rounded-[2rem] p-6 shadow-2xl shadow-brand-accent/5 overflow-hidden relative group"
      >
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
           <TrendingUp className="w-20 h-20 text-brand-accent" />
        </div>

        <h4 className="text-[10px] font-bold uppercase tracking-widest text-brand-accent mb-6 flex items-center gap-2">
           <Zap className="w-3 h-3" />
           Velocity Report
        </h4>

        <div className="grid grid-cols-2 gap-4 mb-8">
           <div className="p-4 rounded-2xl bg-brand-charcoal/50 border border-brand-ivory/5">
              <div className="text-[9px] font-bold text-brand-ivory/30 uppercase mb-1">Total Burn</div>
              <div className="text-2xl font-display font-bold text-brand-ivory">₹{data.total.toLocaleString()}</div>
           </div>
           <div className="p-4 rounded-2xl bg-brand-charcoal/50 border border-brand-ivory/5">
              <div className="text-[9px] font-bold text-brand-ivory/30 uppercase mb-1">Avg Ticket</div>
              <div className="text-2xl font-display font-bold text-brand-ivory">₹{data.velocity.toLocaleString()}</div>
           </div>
        </div>

        <div className="h-40 w-full mb-6">
           <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorVal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="5%" stopColor="#C6A96B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#C6A96B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="#C6A96B" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
           </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-brand-ivory/5">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-brand-accent" />
              <span className="text-xs text-brand-ivory/60">Concentrated in <span className="text-brand-ivory font-bold">{data.topCategory}</span></span>
           </div>
           <button className="text-[10px] font-bold uppercase tracking-widest text-brand-accent hover:underline">View Breakdown</button>
        </div>
      </motion.div>
    );
  }

  if (data.type === 'log') {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4 transition-all hover:bg-emerald-500/10"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
           <Plus className="w-5 h-5" />
        </div>
        <div className="flex-1">
           <div className="text-xs font-bold text-emerald-400 uppercase tracking-tighter mb-0.5">Asset Registry Updated</div>
           <div className="text-sm text-brand-ivory/80 font-medium">₹{data.amount} → <span className="text-brand-ivory">{data.category}</span></div>
        </div>
        <CheckIcon className="w-4 h-4 text-emerald-500" />
      </motion.div>
    );
  }

  return null;
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
  );
}

