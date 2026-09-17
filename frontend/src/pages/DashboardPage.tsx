import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Building2, 
  Mail, 
  Globe, 
  ClipboardCheck, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  FileText, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { DashboardStats, HistoryItem, VerificationReport, User } from '../types';
import { getHistory, deleteHistoryItem } from '../services/api';

interface DashboardPageProps {
  user: User | null;
  onNavigate: (tab: string, extraPayload?: any) => void;
  onViewReport: (report: VerificationReport) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  onNavigate,
  onViewReport
}) => {
  const [stats, setStats] = useState<DashboardStats>({
    verifications_completed: 0,
    needs_verification: 0,
    high_concern_cases: 0,
    saved_reports: 0
  });
  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      if (data && data.stats) {
        setStats(data.stats);
        setRecentHistory(data.history || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this verification record?')) {
      await deleteHistoryItem(id);
      loadData();
    }
  };

  const getAssessmentBadge = (assessment: string) => {
    switch (assessment) {
      case 'HIGH CONCERN':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">High Concern</span>;
      case 'MULTIPLE WARNING SIGNS':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Warning Signs</span>;
      case 'NEEDS VERIFICATION':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">Needs Verification</span>;
      case 'INCONCLUSIVE':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-400 border border-slate-500/30">Inconclusive</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Low Concern</span>;
    }
  };

  return (
    <div className="space-y-8 py-4 sm:py-6 text-left max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
              Enterprise Dashboard
            </span>
            {user?.is_demo_mode && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[10px] font-semibold border border-amber-500/30">
                Demo Auth Mode
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Welcome to TrustHire AI
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Multi-agent opportunity verification engine. Analyze work-from-home offers, inspect corporate domain claims, and enforce Before You Pay safety protocols.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0">
          <button
            onClick={() => onNavigate('verify-job')}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Verify Job Offer</span>
          </button>
          <button
            onClick={() => onNavigate('demo')}
            className="px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>60s Hackathon Run</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Completed Investigations</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white font-mono">{stats.verifications_completed}</p>
          <span className="text-[11px] text-slate-400 block">Total forensic scans logged</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Needs Verification</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">{stats.needs_verification}</p>
          <span className="text-[11px] text-slate-400 block">Personal email / mismatch flags</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>High Concern Cases</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400 font-mono">{stats.high_concern_cases}</p>
          <span className="text-[11px] text-slate-400 block">Upfront fee / credential demands</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Saved Reports</span>
            <FileText className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{stats.saved_reports}</p>
          <span className="text-[11px] text-slate-400 block">SQLite persisted audit archives</span>
        </div>
      </div>

      {/* Main 5 Quick Action Cards */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
          <span>Verification Modules</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Card 1: Verify Job Offer */}
          <div 
            onClick={() => onNavigate('verify-job')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                  Verify Job Offer
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Agentic</span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step intelligent conversation that adapts inquiry based on channel, payment demands, and recruiter domain.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-cyan-400 pt-2">
              <span>Start Investigation</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Verify Company */}
          <div 
            onClick={() => onNavigate('company-verify')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Verify Company
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Cross-correlates corporate identity against registered directories and detects domain inconsistencies.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-blue-400 pt-2">
              <span>Verify Entity</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Analyze Recruiter Email */}
          <div 
            onClick={() => onNavigate('recruiter-email')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Analyze Recruiter Email
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Classifies personal vs corporate email domains, detects domain spoofing, and outputs FACT / WARNING / UNKNOWN indicators.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-purple-400 pt-2">
              <span>Analyze Recruiter</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Analyze Website */}
          <div 
            onClick={() => onNavigate('website-analyze')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Analyze Website
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Evaluates top-level domains, HTTPS encryption, typosquatting, and consistency with claimed hiring entity.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-400 pt-2">
              <span>Inspect URL</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Analyze Message / Offer Letter */}
          <div 
            onClick={() => onNavigate('message-analyze')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Analyze Job Message
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Paste email, WhatsApp, or Telegram offers to automatically extract compensation, urgency, and sensitive data prompts.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 pt-2">
              <span>Extract Entities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Safety Checklist */}
          <div 
            onClick={() => onNavigate('guides')}
            className="glass-panel glass-panel-hover p-6 rounded-2xl border border-white/10 cursor-pointer space-y-3 relative group"
          >
            <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-rose-300 transition-colors">
                Safety Checklist & Guides
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Public informational procedures on how to independently verify remote jobs and avoid upfront payment fraud.
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-rose-400 pt-2">
              <span>View Checklist</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Verification History Table */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-base font-bold text-white">Recent Verification History</h3>
            <p className="text-xs text-slate-400">Persisted forensic reports in SQLite</p>
          </div>
          <button 
            onClick={loadData}
            title="Refresh History"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {recentHistory.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 space-y-2">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <p>No verification records logged yet.</p>
            <button
              onClick={() => onNavigate('verify-job')}
              className="text-cyan-400 hover:underline text-xs font-semibold"
            >
              Start your first opportunity investigation →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Position</th>
                  <th className="py-3 px-3">Assessment</th>
                  <th className="py-3 px-3">Findings</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentHistory.slice(0, 8).map((item) => (
                  <tr 
                    key={item.id} 
                    onClick={() => item.report && onViewReport(item.report)}
                    className="hover:bg-white/[0.02] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-mono text-slate-400">{item.created_at}</td>
                    <td className="py-3 px-3 font-semibold text-white">{item.company_name}</td>
                    <td className="py-3 px-3 text-slate-300">{item.job_title}</td>
                    <td className="py-3 px-3">{getAssessmentBadge(item.assessment)}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-xs truncate">{item.summary}</td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.report) onViewReport(item.report);
                        }}
                        className="p-1.5 rounded-lg text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                        title="View Full Report"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
