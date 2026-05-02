import { motion } from 'motion/react';
import { X, User, Shield, Bell, CreditCard, HelpCircle, LogOut } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

export default function SettingsModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/80 backdrop-blur-xl p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-3xl overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-brand-ivory/5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Preferences</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-slate rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <SettingItem 
            icon={<User className="w-5 h-5" />} 
            title="Profile Details" 
            desc="Manage your personal information"
            onClick={() => toast.info("Profile editing coming soon")}
          />
          <SettingItem 
            icon={<Shield className="w-5 h-5" />} 
            title="Privacy & Security" 
            desc="Two-factor auth and data privacy"
            onClick={() => toast.info("Security settings locked")}
          />
          <SettingItem 
            icon={<Bell className="w-5 h-5" />} 
            title="Notifications" 
            desc="Configure smart alerts and nudges"
            onClick={() => toast.success("Notification preferences saved")}
          />
          <SettingItem 
            icon={<CreditCard className="w-5 h-5" />} 
            title="Premium Plan" 
            desc="Manage your subscription"
            onClick={() => toast.info("You're on the early-access free tier")}
          />
          <div className="pt-4 border-t border-brand-ivory/5">
            <button 
              onClick={() => auth.signOut()}
              className="w-full p-4 rounded-2xl flex items-center justify-between bg-red-400/5 hover:bg-red-400/10 text-red-400 transition-all group"
            >
              <div className="flex items-center gap-3 font-semibold">
                <LogOut className="w-5 h-5" />
                Sign Out
              </div>
              <div className="text-xs opacity-40 group-hover:opacity-100 transition-opacity">v1.0.4 r7</div>
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingItem({ icon, title, desc, onClick }: { icon: any, title: string, desc: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full p-4 rounded-2xl flex items-center gap-4 hover:bg-brand-slate/50 transition-all text-left group"
    >
      <div className="p-3 rounded-xl bg-brand-charcoal border border-brand-ivory/5 text-brand-accent group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-semibold">{title}</div>
        <div className="text-xs text-brand-ivory/40">{desc}</div>
      </div>
    </button>
  );
}
