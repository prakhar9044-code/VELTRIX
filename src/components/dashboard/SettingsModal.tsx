import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Shield, Bell, CreditCard, HelpCircle, LogOut, History, ChevronRight, Check } from 'lucide-react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { toast } from 'sonner';

export default function SettingsModal({ isOpen, onClose, user }: { isOpen: boolean, onClose: () => void, user: any }) {
  const [currency, setCurrency] = useState('INR (₹)');
  const [theme, setTheme] = useState('Dark');
  const [notifsEnabled, setNotifsEnabled] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isLoading, setIsLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (theme === 'Light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, [theme]);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      toast.success("Veltrix Installed");
    }
  };

  useEffect(() => {
    if (isOpen && user) {
      loadSettings();
    }
  }, [isOpen, user]);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, `users/${user.uid}/settings`, 'preferences');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setCurrency(data.currency || 'INR (₹)');
        setTheme(data.theme || 'Dark');
        setNotifsEnabled(data.notifications !== undefined ? data.notifications : true);
      } else {
        // Init default settings if don't exist
        await setDoc(docRef, {
          currency: 'INR (₹)',
          theme: 'Dark',
          notifications: true,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreference = async (key: string, value: any) => {
    try {
      const docRef = doc(db, `users/${user.uid}/settings`, 'preferences');
      await updateDoc(docRef, {
        [key]: value,
        updatedAt: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error saving preference:", e);
      toast.error("Failed to save preference");
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) return;
    try {
      await updateProfile(auth.currentUser!, { displayName });
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (e) {
      toast.error("Failed to update profile");
    }
  };

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
            <div className="p-6 rounded-3xl bg-brand-slate border border-brand-ivory/5 transition-all">
              <div className="flex items-center gap-5">
                <div className="relative group">
                  <img 
                    src={user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.uid}`} 
                    className="w-16 h-16 rounded-2xl grayscale group-hover:grayscale-0 transition-all border border-brand-ivory/10" 
                    alt="Avatar"
                  />
                  <div className="absolute inset-0 bg-brand-charcoal/40 items-center justify-center hidden group-hover:flex rounded-2xl cursor-pointer">
                    <History className="w-5 h-5 text-brand-ivory" />
                  </div>
                </div>
                
                <div className="flex-1">
                  {isEditingProfile ? (
                    <div className="flex gap-2">
                      <input 
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-brand-charcoal border border-brand-accent/30 rounded-lg px-3 py-1 text-sm font-bold w-full"
                        autoFocus
                      />
                      <button onClick={handleUpdateProfile} className="p-1 bg-brand-accent text-brand-charcoal rounded-lg">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <div className="font-bold text-lg tracking-tight">{displayName || 'Prakhar Verma'}</div>
                      <div className="text-xs text-brand-ivory/40">{user?.email || 'hello@veltrix.com'}</div>
                    </div>
                  )}
                </div>
                
                {!isEditingProfile && (
                  <button 
                    onClick={() => setIsEditingProfile(true)}
                    className="text-[10px] font-bold text-brand-accent px-3 py-1 rounded-lg border border-brand-accent/20 hover:bg-brand-accent hover:text-brand-charcoal transition-all"
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <SettingsSection title="Preferences">
            <SettingsItem 
              icon={<CreditCard className="w-4 h-4 text-brand-accent" />} 
              label="Currency" 
              value={currency}
              onClick={() => {
                const next = currency === 'INR (₹)' ? 'USD ($)' : 'INR (₹)';
                setCurrency(next);
                savePreference('currency', next);
                toast.success(`Currency switched to ${next}`);
              }}
            />
            <SettingsItem 
              icon={<Shield className="w-4 h-4 text-brand-accent" />} 
              label="Theme" 
              value={theme}
              onClick={() => {
                const next = theme === 'Dark' ? 'Light' : 'Dark';
                setTheme(next);
                savePreference('theme', next);
                toast.info(`Theme switched to ${next}`);
              }}
            />
            <SettingsItem 
              icon={<Bell className="w-4 h-4 text-brand-accent" />} 
              label="Notifications" 
              isSwitch 
              switchActive={notifsEnabled}
              onSwitch={() => {
                const next = !notifsEnabled;
                setNotifsEnabled(next);
                savePreference('notifications', next);
                toast.success(`Notifications ${next ? 'enabled' : 'disabled'}`);
              }}
            />
          </SettingsSection>

          {/* Security Section */}
          <SettingsSection title="Security">
            <SettingsItem icon={<Shield className="w-4 h-4 opacity-40" />} label="Change Password" hasArrow onClick={() => toast.info("Check your email for reset instructions")} />
          </SettingsSection>

          {/* Data Section */}
          <SettingsSection title="Data">
            <SettingsItem icon={<History className="w-4 h-4 opacity-40" />} label="Export Data (.json)" hasArrow onClick={() => toast.success("Preparing your archive...")} />
            {deferredPrompt && (
              <SettingsItem 
                icon={<Shield className="w-4 h-4 text-brand-accent animate-pulse" />} 
                label="Install App" 
                value="Offline Access"
                onClick={handleInstall} 
              />
            )}
          </SettingsSection>

          {/* About Section */}
          <SettingsSection title="About">
            <SettingsItem label="About Veltrix" value="v1.1.2" onClick={() => toast.info("Veltrix Intelligence v1.1.2")} />
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

function SettingsItem({ icon, label, value, hasArrow, isSwitch, switchActive, onSwitch, onClick }: { 
  icon?: React.ReactNode, 
  label: string, 
  value?: string, 
  hasArrow?: boolean, 
  isSwitch?: boolean,
  switchActive?: boolean,
  onSwitch?: () => void,
  onClick?: () => void
}) {
  return (
    <div 
      onClick={isSwitch ? onSwitch : onClick}
      className="flex items-center justify-between p-4 rounded-2xl hover:bg-brand-slate transition-all group cursor-pointer border border-transparent hover:border-brand-ivory/5"
    >
      <div className="flex items-center gap-4">
        {icon && <div className="w-4 h-4">{icon}</div>}
        <span className="text-sm font-medium tracking-tight text-brand-ivory/80">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        {value && <span className="text-xs text-brand-ivory/40 font-bold uppercase tracking-tighter">{value}</span>}
        {hasArrow && <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 transition-opacity" />}
        {isSwitch && (
          <div className={`w-10 h-5 rounded-full transition-all relative ${switchActive ? 'bg-brand-accent/50' : 'bg-brand-charcoal'}`}>
            <motion.div 
              animate={{ x: switchActive ? 22 : 2 }}
              className={`absolute top-1 w-3 h-3 rounded-full shadow-lg ${switchActive ? 'bg-brand-accent' : 'bg-brand-ivory/20'}`} 
            />
          </div>
        )}
      </div>
    </div>
  );
}
