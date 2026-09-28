import React from 'react';
import { ShieldCheck, Lock, EyeOff, Server, Trash2, X } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel-elevated w-full max-w-lg rounded-3xl p-6 sm:p-8 relative space-y-6 text-left border border-violet-500/30">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center text-violet-300">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Privacy & Security Charter</h3>
              <p className="text-xs text-slate-400">Zero data monetization, privacy-first architecture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="space-y-3.5 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0d1326]/90 border border-white/5 shadow-sm">
            <EyeOff className="w-5 h-5 text-violet-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">No Tracking or Resume Harvesting</strong>
              <p className="text-slate-400">TrustHire AI does not store candidate resumes, sell recruiter contact data, or share search queries with third parties.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0d1326]/90 border border-white/5 shadow-sm">
            <Server className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Encrypted Heuristic Verification</strong>
              <p className="text-slate-400">All checks run through encrypted TLS channels. Public directory lookups are stateless and cached securely.</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#0d1326]/90 border border-white/5 shadow-sm">
            <Trash2 className="w-5 h-5 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Instant History Deletion</strong>
              <p className="text-slate-400">You can clear your local or server verification history at any time with a single click in the History tab.</p>
            </div>
          </div>
        </div>

        {/* Responsible AI Disclaimer */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-[11px] text-slate-300 leading-relaxed">
          <span className="font-bold text-white block mb-1">Responsible AI Principle:</span>
          An unlisted or private business is never classified as fraudulent merely because it lacks public multinational corporate records. Independent verification is always recommended.
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/25 cursor-pointer"
        >
          I Understand
        </button>
      </div>
    </div>
  );
};
