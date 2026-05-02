import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, Send, X, Sparkles, HelpCircle } from 'lucide-react';
import ai from '../../lib/gemini';
import { toast } from 'sonner';

export default function SupportBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: 'Hi! I am the Veltrix Concierge. How can I help you optimize your finances today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: messages.map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.text}`).join('\n') + `\nUser: ${userText}`,
        config: {
          systemInstruction: "You are the Veltrix Concierge. Be helpful, concise, and professional."
        }
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm having trouble connecting right now." }]);
    } catch (err) {
      toast.error("Support system temporarily busy");
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] md:bottom-10 md:right-10">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] glass-card rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-4 bg-brand-accent text-brand-charcoal flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                <span className="font-bold">Concierge Support</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    m.role === 'user' 
                      ? 'bg-brand-accent text-brand-charcoal rounded-tr-none' 
                      : 'bg-brand-slate text-brand-ivory rounded-tl-none border border-brand-ivory/5'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-[10px] text-brand-accent animate-pulse uppercase tracking-widest font-bold">Concierge is typing...</div>}
            </div>

            <form onSubmit={handleSend} className="p-4 border-t border-brand-ivory/5 bg-brand-charcoal/50">
              <div className="relative">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  className="w-full bg-brand-slate/50 border border-brand-ivory/10 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:border-brand-accent transition-all text-sm"
                  placeholder="Ask a question..."
                />
                <button className="absolute right-2 top-1.5 p-2 text-brand-accent">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-brand-accent text-brand-charcoal flex items-center justify-center shadow-[0_0_20px_rgba(197,160,89,0.3)] group overflow-hidden"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
             <motion.div key="x" initial={{ rotate: -90 }} animate={{ rotate: 0 }}>
               <X className="w-7 h-7" />
             </motion.div>
          ) : (
            <motion.div key="chat" initial={{ y: 20 }} animate={{ y: 0 }} className="flex flex-col items-center">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
