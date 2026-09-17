import React, { useState } from 'react';
import { 
  AlertOctagon, 
  ShieldAlert, 
  CheckSquare, 
  Square, 
  Lock, 
  Info,
  ExternalLink
} from 'lucide-react';
import { SafetyChecklistItem } from '../types';

interface BeforeYouPayProps {
  paymentDetails?: {
    amount?: string;
    purpose?: string;
    warning?: string;
  };
  checklist?: SafetyChecklistItem[];
  onDismiss?: () => void;
}

export const BeforeYouPay: React.FC<BeforeYouPayProps> = ({
  paymentDetails,
  checklist = [],
  onDismiss
}) => {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleCheck = (id: number) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const defaultChecklist: SafetyChecklistItem[] = checklist.length > 0 ? checklist : [
    { id: 1, task: "Verify the company independently in official government/state business registers.", recommended: true },
    { id: 2, task: "Verify recruiter identity on professional corporate platforms (match corporate email domain).", recommended: true },
    { id: 3, task: "Confirm job opening and requisition on the company's official public careers portal.", recommended: true },
    { id: 4, task: "Confirm corporate switchboard or central HR telephone contact independently.", recommended: true },
    { id: 5, task: "Review the payment request carefully (legitimate employers supply equipment without upfront candidate fees).", recommended: true },
    { id: 6, task: "Avoid sharing passwords, OTPs, card CVVs, or online banking direct deposit credentials.", recommended: true }
  ];

  return (
    <div className="rounded-2xl border-2 border-rose-500/50 bg-gradient-to-b from-rose-950/40 to-[#0d1322] p-6 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Warning Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 shadow-lg shadow-rose-500/20 animate-pulse">
          <AlertOctagon className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-rose-500 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
              Critical Warning
            </span>
            <span className="text-xs text-rose-300 font-semibold">BEFORE YOU PAY</span>
          </div>
          <h3 className="text-xl font-extrabold text-white mt-1">
            An Upfront Payment Request Was Detected
          </h3>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Legitimate corporate employers across all legitimate jurisdictions provide company equipment, onboarding materials, and background checks at <strong>zero financial cost</strong> to the applicant.
          </p>
        </div>
      </div>

      {/* Details Box */}
      {paymentDetails && (
        <div className="p-4 rounded-xl bg-navy-950/80 border border-rose-500/20 mb-6 space-y-2 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="font-semibold text-rose-300">What was requested:</span>
            <span className="font-mono text-white font-bold">{paymentDetails.amount || 'Unspecified Amount'} for {paymentDetails.purpose || 'Equipment/Training'}</span>
          </div>
          <p className="text-slate-400 leading-relaxed pt-1 border-t border-white/5">
            <strong>Why additional verification is important:</strong> Fraudulent actors frequently use fake equipment reimbursement checks or demand crypto/Zelle/wire fees that cannot be recovered once transferred.
          </p>
        </div>
      )}

      {/* Interactive Verification Checklist */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Mandatory Verification Checklist</span>
        </h4>
        <div className="space-y-2">
          {defaultChecklist.map((item) => {
            const isChecked = !!checkedItems[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 text-xs select-none ${
                  isChecked 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200' 
                    : 'bg-navy-950/40 border-white/10 text-slate-300 hover:border-white/20'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-slate-400">
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-500 hover:text-slate-400" />
                  )}
                </div>
                <span className={isChecked ? 'line-through opacity-80' : ''}>
                  {item.task}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Zero Banking Credentials Stored Guarantee */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-white/10 text-[11px] text-slate-400 flex items-center gap-3">
        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
        <p>
          <strong className="text-white">Security Guarantee:</strong> TrustHire AI never asks you to enter banking passwords, OTPs, or payment card CVVs. Always safeguard your financial credentials.
        </p>
      </div>
    </div>
  );
};
