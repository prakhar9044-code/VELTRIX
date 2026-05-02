import { useState } from 'react';
import { User } from 'firebase/auth';
import { Insight } from '../../types';
import { Sparkles, Bell, User as UserIcon, Search } from 'lucide-react';
import { toast } from 'sonner';
import NotificationsModal from './NotificationsModal';

export default function Navbar({ user, insights }: { user: User, insights: Insight[] }) {
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-brand-ivory/5 bg-brand-charcoal/50 backdrop-blur-md z-40">
      <div className="flex items-center gap-4">
        <div className="flex items-center md:hidden gap-3 px-2">
            <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center shadow-[0_0_15px_rgba(198,169,107,0.2)]">
               <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-charcoal">
                  <path d="M4 4L12 20L20 4" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight uppercase">Veltrix</span>
        </div>
        <h1 className="hidden md:block text-3xl font-display font-bold tracking-tight">Financial Stream</h1>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => toast.info("Search coming soon")}
          className="p-2 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate transition-all"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setIsNotifsOpen(true)}
          className="p-2 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate transition-all relative group"
        >
          <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse" />
        </button>
        
        <div 
          className="flex items-center gap-3 pl-6 border-l border-brand-ivory/10 cursor-pointer group"
        >
           <div className="w-10 h-10 rounded-xl bg-brand-slate border border-brand-ivory/10 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden">
             {user.photoURL ? (
               <img src={user.photoURL} alt="User" referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
             ) : (
               <UserIcon className="w-5 h-5 opacity-40" />
             )}
           </div>
        </div>
      </div>

      <NotificationsModal isOpen={isNotifsOpen} onClose={() => setIsNotifsOpen(false)} insights={insights} />
    </header>
  );
}
