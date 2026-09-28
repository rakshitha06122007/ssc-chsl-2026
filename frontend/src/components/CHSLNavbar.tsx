import React, { useState } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  Award, 
  Flame, 
  Timer, 
  Brain, 
  Settings, 
  Menu, 
  X, 
  Layers, 
  FolderSync, 
  ShieldCheck,
  Sparkles,
  Keyboard
} from 'lucide-react';
import { ExamTier } from '../types/chsl';

interface CHSLNavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeTier: ExamTier;
  onToggleTier: (tier: ExamTier) => void;
  onOpenTimer: () => void;
  isLoggedIn: boolean;
  onOpenAuth: () => void;
}

export function CHSLNavbar({
  currentTab,
  onSelectTab,
  activeTier,
  onToggleTier,
  onOpenTimer,
  isLoggedIn,
  onOpenAuth
}: CHSLNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: Flame },
    { id: 'syllabus', label: 'Syllabus', icon: Layers },
    { id: 'lessons', label: 'Concept Lessons', icon: BookOpen },
    { id: 'practice', label: 'Adaptive Practice', icon: CheckCircle2 },
    { id: 'mock-tests', label: 'Mock Test Lab', icon: Award, highlight: true },
    { id: 'mistakes', label: 'Mistake Notebook', icon: HelpCircle },
    { id: 'revision', label: 'Spaced Revision', icon: Brain },
    { id: 'planner', label: 'Study Planner', icon: GraduationCap },
    { id: 'tools', label: 'Subject Tools & Typing', icon: Keyboard },
    { id: 'ai-tutor', label: 'AI Study Mentor', icon: Sparkles },
    { id: 'admin', label: 'Admin', icon: Settings }
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#090d16]/90 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tier Selector */}
          <div className="flex items-center gap-3">
            <div 
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-amber-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition">
                <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-indigo-400 group-hover:text-amber-400 transition" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                  CHSL Mastery
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full">
                    2026
                  </span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">
                  Complete Exam Prep Platform
                </span>
              </div>
            </div>

            {/* Dedicated Tier 1 / Tier 2 Switcher */}
            <div className="ml-2 flex items-center bg-slate-900/90 border border-slate-700/80 rounded-xl p-0.5 shadow-inner">
              <button
                onClick={() => onToggleTier('tier1')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTier === 'tier1'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier 1
                <span className="text-[9px] opacity-75 font-normal">(CBE)</span>
              </button>
              <button
                onClick={() => onToggleTier('tier2')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                  activeTier === 'tier2'
                    ? 'bg-gradient-to-r from-violet-600 to-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tier 2
                <span className="text-[9px] opacity-75 font-normal">(Mains+Typing)</span>
              </button>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                      : link.highlight
                        ? 'text-amber-300 hover:bg-amber-500/10 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Icons: Timer & Guest/Cloud Sync */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenTimer}
              title="Open Focus Timer"
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-300 hover:text-indigo-400 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <Timer className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span className="hidden sm:inline">Focus Timer</span>
            </button>

            <button
              onClick={onOpenAuth}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border ${
                isLoggedIn
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25'
                  : 'bg-indigo-600/20 border-indigo-500/30 text-indigo-300 hover:bg-indigo-600/30'
              }`}
            >
              <FolderSync className="w-3.5 h-3.5" />
              <span>{isLoggedIn ? 'Cloud Synced' : 'Guest Mode (Sync)'}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden px-4 pt-3 pb-6 border-t border-slate-800/80 bg-[#090d16]/98 space-y-1">
          <div className="p-2 mb-2 bg-indigo-950/40 rounded-xl border border-indigo-800/30 text-xs text-indigo-300 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Active: <strong>{activeTier.toUpperCase()} Mode</strong>. Free access enabled.</span>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-3 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-300 hover:bg-slate-800/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
        </div>
      )}
    </nav>
  );
}
