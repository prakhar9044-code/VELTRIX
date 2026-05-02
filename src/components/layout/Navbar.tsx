import { User } from 'firebase/auth';
import { Sparkles, Bell, User as UserIcon } from 'lucide-react';

export default function Navbar({ user }: { user: User }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-brand-ivory/5 bg-brand-charcoal z-40">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-brand-accent flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-brand-charcoal" />
        </div>
        <span className="font-display font-bold text-xl tracking-tight">VELTRIX</span>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 rounded-xl text-brand-ivory/40 hover:text-brand-ivory hover:bg-brand-slate/50 transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand-accent rounded-full border-2 border-brand-charcoal" />
        </button>
        
        <div className="flex items-center gap-3 pl-4 border-l border-brand-ivory/10">
          <div className="hidden md:block text-right">
            <div className="text-xs font-bold">{user.displayName || 'User'}</div>
            <div className="text-[10px] text-brand-ivory/40">Free Plan</div>
          </div>
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName || ''} 
              className="w-10 h-10 rounded-xl border border-brand-ivory/10"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-brand-slate flex items-center justify-center border border-brand-ivory/10">
              <UserIcon className="w-5 h-5 opacity-40" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
