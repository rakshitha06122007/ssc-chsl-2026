import React from 'react';
import { 
  ShieldCheck, 
  Search, 
  Zap, 
  Activity, 
  FlaskConical, 
  Clock, 
  Lock,
  ArrowDownToLine
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: User | null;
  onOpenPrivacy: () => void;
  isInstallable?: boolean;
  onInstall?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPrivacy,
  isInstallable = false,
  onInstall
}) => {
  const navItems = [
    { 
      id: 'studio', 
      label: 'Investigation Studio', 
      icon: Search, 
      badge: 'Omni-Scan'
    },
    { 
      id: 'fast', 
      label: 'Fast Verify', 
      icon: Zap, 
      badge: '1-Click'
    },
    { 
      id: 'command', 
      label: 'Command Center', 
      icon: Activity, 
      badge: 'Threat Radar'
    },
    { 
      id: 'lab', 
      label: 'Scam Lab', 
      icon: FlaskConical, 
      badge: 'Simulator'
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: Clock
    },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 pt-3 pb-2 bg-[#0b0f19]/85 backdrop-blur-2xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('studio')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 group-hover:shadow-indigo-500/50 transition-all duration-300">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#0b0f19] shadow-sm animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                TrustHire
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/40 font-mono tracking-wider">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
              Multi-Agent Forensic Verification
            </p>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-[#11182c]/80 border border-white/10 shadow-lg shadow-black/20 backdrop-blur-md gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-500/30 border border-white/15'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Navigation Dropdown/Pills */}
        <div className="flex lg:hidden items-center gap-1 overflow-x-auto py-1">
          {navItems.slice(0, 3).map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Section */}
        <div className="flex items-center gap-2.5">
          {isInstallable && onInstall && (
            <button
              onClick={onInstall}
              title="Install App"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              <ArrowDownToLine className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}

          <button
            onClick={onOpenPrivacy}
            title="Privacy & Data Charter"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-semibold border border-white/10 hover:border-violet-500/30 transition-all cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-violet-400" />
            <span className="hidden md:inline">Privacy</span>
          </button>

          {/* Direct Access Pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Direct Access</span>
          </div>
        </div>
      </div>
    </header>
  );
};
