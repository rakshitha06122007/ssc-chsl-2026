import React from 'react';
import { 
  GitCommit, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Terminal 
} from 'lucide-react';
import { AuditTraceStep } from '../types';

interface AuditTraceProps {
  trace: AuditTraceStep[];
}

export const AuditTrace: React.FC<AuditTraceProps> = ({ trace }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-white/10 mb-5">
        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <Terminal className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Agent Investigation Trace</span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
              Deterministic Audit Log
            </span>
          </h3>
          <p className="text-xs text-slate-400">Verifiable action, result, and decision progression</p>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-blue-500 before:to-emerald-500">
        {trace.map((step) => (
          <div key={step.step} className="relative group">
            {/* Timeline bullet */}
            <div className="absolute -left-[27px] top-1 w-5 h-5 rounded-full bg-[#090d16] border-2 border-cyan-400 flex items-center justify-center text-[10px] font-mono font-bold text-cyan-300 shadow-md shadow-cyan-500/30">
              {step.step}
            </div>

            <div className="rounded-xl p-3.5 bg-navy-950/60 border border-white/5 hover:border-white/15 transition-all space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {step.action}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Step {step.step}</span>
              </div>

              <p className="text-slate-300 leading-relaxed text-[11px] pl-5">
                <strong className="text-cyan-300 font-medium">Result:</strong> {step.result}
              </p>

              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 pl-5 pt-1 border-t border-white/5">
                <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Next Decision: {step.next_decision}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
