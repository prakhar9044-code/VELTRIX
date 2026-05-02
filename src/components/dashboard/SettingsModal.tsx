import { motion } from 'motion/react';
import { X, User, Shield, Bell, CreditCard, HelpCircle, LogOut, History, ChevronRight } from 'lucide-react';
import { auth } from '../../lib/firebase';
import { toast } from 'sonner';

export default function SettingsModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-brand-charcoal/90 backdrop-blur-xl p-4"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-lg glass-card rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-8 border-b border-brand-ivory/5 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight">Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-brand-slate rounded-xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
          {/* Profile Section */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/20 mb-4 px-2">Profile</h3>
            <div className="p-4 rounded-2xl bg-brand-slate border border-brand-ivory/5 flex items-center justify-between group cursor-pointer hover:bg-brand-slate/80 transition-all">
              <div className="flex items-center gap-4">
                <img 
                  src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                  className="w-12 h-12 rounded-xl grayscale group-hover:grayscale-0 transition-all" 
                  alt="Avatar"
                />
                <div>
                  <div className="font-bold text-sm tracking-tight">{user?.displayName || 'Prakhar Verma'}</div>
                  <div className="text-xs text-brand-ivory/40">hello@veltrix.com</div>
                </div>
              </div>
              <button className="text-[10px] font-bold text-brand-accent px-3 py-1 rounded-lg border border-brand-accent/20">Edit Profile</button>
            </div>
          </div>

          {/* Preferences Section */}
          <SettingsSection title="Preferences">
            <SettingsItem icon={<CreditCard className="w-4 h-4 text-brand-accent" />} label="Currency" value="INR (₹)" />
            <SettingsItem icon={<Shield className="w-4 h-4 text-brand-accent" />} label="Theme" value="Dark" />
            <SettingsItem icon={<Bell className="w-4 h-4 text-brand-accent" />} label="Notifications" isSwitch />
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection title="Security">
            <SettingsItem icon={<Shield className="w-4 h-4 opacity-40" />} label="Change Password" hasArrow />
          </SettingsSection>

          {/* Data Section */}
          <SettingsSection title="Data">
            <SettingsItem icon={<History className="w-4 h-4 opacity-40" />} label="Export Data" hasArrow />
          </SettingsSection>

          {/* About Section */}
          <SettingsSection title="About">
            <SettingsItem label="About Veltrix" value="v1.0.0" />
            <button 
              onClick={() => auth.signOut()}
              className="w-full mt-4 flex items-center gap-3 p-4 rounded-2xl bg-red-400/5 text-red-400 text-sm font-bold border border-red-400/10 hover:bg-red-400/10 transition-all"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              Logout
            </button>
          </SettingsSection>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SettingsSection({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand-ivory/20 mb-3 px-2">{title}</h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}

function SettingsItem({ icon, label, value, hasArrow, isSwitch }: { icon?: React.ReactNode, label: string, value?: string, hasArrow?: boolean, isSwitch?: boolean }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-slate transition-all group cursor-pointer">
      <div className="flex items-center gap-4">
        {icon && <div className="w-4 h-4">{icon}</div>}
        <span className="text-sm font-medium tracking-tight text-brand-ivory/80">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-xs text-brand-ivory/40 font-medium">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />}
        {isSwitch && <div className="w-8 h-4 rounded-full bg-brand-accent/20 relative"><div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-brand-accent transition-all" /></div>}
      </div>
    </div>
  );
}
