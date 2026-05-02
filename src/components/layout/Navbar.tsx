import { User } from 'firebase/auth';
import { Sparkles, Bell, User as UserIcon, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function Navbar({ user }: { user: User }) {
  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-brand-ivory/5 bg-brand-charcoal/50 backdrop-blur-md z-40">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-display font-bold tracking-tight">Dashboard</h1>
      </div>

      <div className="flex items-center gap-6">
        <button 
          onClick={() => toast.info("Search coming soon")}
          className="p-2 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate transition-all"
        >
          <Search className="w-5 h-5" />
        </button>
        <button 
          onClick={() => toast.info("No new notifications")}
          className="p-2 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate transition-all relative"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-brand-accent rounded-full" />
        </button>
        
        <div 
          onClick={() => toast.info(`Signed in as ${user.displayName || 'User'}`)}
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
    </header>
  );
}
