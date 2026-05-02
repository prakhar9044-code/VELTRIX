import { useState, useRef, useEffect } from 'react';
import { User } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError } from '../../lib/firebase';
import { parseExpense } from '../../lib/gemini';
import ai from '../../lib/gemini';
import { OperationType, Expense } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  status?: 'pending' | 'success' | 'error';
}

export default function ChatInterface({ user, expenses }: { user: User, expenses: Expense[] }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const parsedData = await parseExpense(input);
      
      // Check if it's an analytical question instead of an expense log
      const isQuestion = input.toLowerCase().includes('?') || input.toLowerCase().includes('how') || input.toLowerCase().includes('where');
      
      if (isQuestion) {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: `Context: User has logged ${expenses.length} expenses totalling ₹${expenses.reduce((s, e) => s+e.amount, 0)}. Recent categories: ${[...new Set(expenses.map(e => e.category))].join(', ')}. Question: ${input}`,
          config: {
            systemInstruction: "You are Veltrix Portfolio Analyst. Be professional and concise.",
          }
        });
        
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'ai',
          text: response.text || "I couldn't process that. Try again.",
          timestamp: new Date()
        }]);
        setIsTyping(false);
        return;
      }

      // Proceed with logging expense...
      const expensesPath = `users/${user.uid}/expenses`;
      await addDoc(collection(db, expensesPath), {
        userId: user.uid,
        rawText: input,
        amount: parsedData.amount,
        currency: parsedData.currency || 'INR',
        category: parsedData.category,
        description: parsedData.description || input,
        date: new Date().toISOString(),
        timestamp: new Date().toISOString(),
        isAIProcessed: true,
        tags: parsedData.tags || []
      });

      const responseText = `Logged ₹${parsedData.amount} for ${parsedData.description} under ${parsedData.category}.`;
      toast.success("Expense Logged", {
        description: `₹${parsedData.amount} -> ${parsedData.category}`,
      });
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: responseText,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to log expense", {
        description: "Please check your connectivity or try again."
      });
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "I'm sorry, I couldn't process that entry. Could you try rephrasing it? (e.g., 'coffee 50')",
        timestamp: new Date(),
        status: 'error'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-card rounded-2xl shadow-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-brand-ivory/5 flex items-center justify-between bg-brand-charcoal/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-brand-accent" />
          </div>
          <div>
            <div className="font-semibold text-sm">Veltrix Intelligence Agent</div>
            <div className="text-[10px] text-green-500 flex items-center gap-1 font-bold tracking-widest uppercase">
              <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar"
      >
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 opacity-40">
            <div className="w-16 h-16 rounded-3xl bg-brand-slate/50 flex items-center justify-center mb-6">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-display font-bold mb-2">Welcome to Veltrix</h3>
            <p className="text-sm max-w-xs">
              Try typing like "Lunch 200" or "Bought a book 500". I'll categorize and log it instantly.
            </p>
          </div>
        )}
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.type === 'user' ? 'bg-brand-slate' : 'bg-brand-accent text-brand-charcoal'
                }`}>
                  {msg.type === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`px-4 py-3 rounded-2xl shadow-sm ${
                  msg.type === 'user' 
                    ? 'bg-brand-ivory text-brand-charcoal rounded-tr-none font-medium' 
                    : 'bg-brand-slate text-brand-ivory rounded-tl-none border border-brand-ivory/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start pl-11"
          >
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-brand-accent rounded-full animate-bounce" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 bg-brand-charcoal/30 border-t border-brand-ivory/5">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Log an expense... (e.g. coffee 50)"
            className="w-full bg-brand-slate/50 border border-brand-ivory/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 transition-all text-brand-ivory placeholder:text-brand-ivory/20"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isTyping}
            className={`absolute right-2 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              input.trim() && !isTyping 
                ? 'bg-brand-accent text-brand-charcoal scale-100' 
                : 'bg-brand-slate text-brand-ivory/20 scale-90 opacity-50'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
