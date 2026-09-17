import React from 'react';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  Building2, 
  Briefcase, 
  Globe, 
  Mail, 
  Calendar,
  Share2
} from 'lucide-react';
import { VerificationReport } from '../types';
import { EvidenceLocker } from './EvidenceLocker';
import { AuditTrace } from './AuditTrace';

interface VerificationReportModalProps {
  report: VerificationReport | null;
  isOpen: boolean;
  onClose: () => void;
}

export const VerificationReportModal: React.FC<VerificationReportModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  if (!isOpen || !report) return null;

  const getAssessmentStyle = (assessment: VerificationReport['assessment']) => {
    switch (assessment) {
      case 'HIGH CONCERN':
        return {
          bg: 'bg-rose-500/10',
          border: 'border-rose-500/40',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-white',
          icon: AlertOctagon
        };
      case 'MULTIPLE WARNING SIGNS':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/40',
          text: 'text-amber-400',
          badge: 'bg-amber-500 text-slate-950',
          icon: AlertTriangle
        };
      case 'NEEDS VERIFICATION':
        return {
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/40',
          text: 'text-cyan-400',
          badge: 'bg-cyan-500 text-navy-950',
          icon: HelpCircle
        };
      case 'INCONCLUSIVE':
        return {
          bg: 'bg-slate-500/10',
          border: 'border-slate-500/40',
          text: 'text-slate-300',
          badge: 'bg-slate-600 text-white',
          icon: HelpCircle
        };
      case 'LOW CONCERN':
      default:
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/40',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500 text-navy-950',
          icon: ShieldCheck
        };
    }
  };

  const assessStyle = getAssessmentStyle(report.assessment);
  const AssessIcon = assessStyle.icon;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl my-8 text-left max-h-[90vh] overflow-y-auto">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-400 font-bold">
                TrustHire AI Investigation
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {report.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Primary Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-navy-950 border border-white/10 mb-6 text-xs">
          <div className="space-y-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Company
            </span>
            <p className="font-bold text-white text-sm">{report.company}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5" /> Position
            </span>
            <p className="font-bold text-white text-sm">{report.job}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> Website
            </span>
            <p className="font-mono text-cyan-300 truncate">{report.website}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Recruiter
            </span>
            <p className="font-mono text-slate-200 truncate">{report.recruiter}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400">Channel</span>
            <p className="font-medium text-slate-200">{report.recruitment_channel}</p>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Verified On
            </span>
            <p className="font-mono text-slate-300">{report.date}</p>
          </div>
        </div>

        {/* Assessment Banner */}
        <div className={`p-6 rounded-2xl border ${assessStyle.border} ${assessStyle.bg} mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <span className="text-xs uppercase font-mono tracking-wider text-slate-400 font-bold">
              Agent Risk Assessment
            </span>
            <div className="flex items-center gap-3">
              <AssessIcon className={`w-8 h-8 ${assessStyle.text}`} />
              <h3 className={`text-2xl font-black tracking-tight ${assessStyle.text}`}>
                {report.assessment}
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed max-w-2xl">
              {report.explanation}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <span className={`inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${assessStyle.badge}`}>
              {report.assessment}
            </span>
          </div>
        </div>

        {/* 8 Forensic Categories Grid */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider flex items-center gap-2">
            <span>Forensic Assessment by Category</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(report.categories || {}).map(([key, cat]) => (
              <div key={key} className="p-3.5 rounded-xl bg-navy-950/80 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-300">{cat.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-cyan-300 font-medium border border-white/10">
                    {cat.status}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-200">{cat.finding}</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">{cat.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Locker Component */}
        <div className="mb-8">
          <EvidenceLocker evidence={report.evidence_locker || []} />
        </div>

        {/* Audit Trace Component */}
        <div className="mb-8">
          <AuditTrace trace={report.audit_trace || []} />
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-navy-950/90 border border-white/5 text-center text-[11px] text-slate-500 leading-relaxed">
          {report.disclaimer}
        </div>
      </div>
    </div>
  );
};
