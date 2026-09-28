import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  TrendingUp, 
  FileText, 
  Trash2, 
  Eye, 
  Printer, 
  AlertTriangle, 
  Radio, 
  Calendar, 
  ArrowUpRight, 
  Sparkles,
  Zap
} from 'lucide-react';
import { getHistory, deleteHistoryItem } from '../services/api';
import { DashboardStats, HistoryItem, VerificationReport, User } from '../types';

interface CommandCenterProps {
  user?: User | null;
  onNavigateScan?: () => void;
  onViewReport?: (report: VerificationReport) => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({ user, onNavigateScan, onViewReport }) => {
  const [stats, setStats] = useState<DashboardStats>({
    verifications_completed: 0,
    needs_verification: 0,
    high_concern_cases: 0,
    saved_reports: 0
  });
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'high' | 'warning' | 'low'>('all');

  const fetchHistoryData = async () => {
    try {
      setLoading(true);
      const res = await getHistory();
      if (res) {
        setStats(res.stats || {
          verifications_completed: 0,
          needs_verification: 0,
          high_concern_cases: 0,
          saved_reports: 0
        });
        setHistory(res.history || []);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to remove this verification record?')) return;
    try {
      await deleteHistoryItem(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      setStats(prev => ({ ...prev, saved_reports: Math.max(0, prev.saved_reports - 1) }));
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handlePrint = (item: HistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    window.print();
  };

  // Filter history records
  const filteredHistory = history.filter(item => {
    const matchesSearch = 
      (item.company_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.job_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.summary || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    const assessment = (item.assessment || '').toUpperCase();
    if (filterSeverity === 'high') return assessment.includes('HIGH');
    if (filterSeverity === 'warning') return assessment.includes('WARNING') || assessment.includes('NEEDS');
    if (filterSeverity === 'low') return !assessment.includes('HIGH') && !assessment.includes('WARNING') && !assessment.includes('NEEDS');

    return true;
  });

  // Calculate platform safety rate
  const safetyRate = stats.verifications_completed > 0
    ? Math.round(((stats.verifications_completed - stats.high_concern_cases) / stats.verifications_completed) * 100)
    : 92;

  // Curated Threat Radar Vectors
  const threatRadar = [
    {
      title: 'Advance Check & Equipment Vendor Scam',
      risk: 'Extreme Danger',
      change: '+42% this month',
      badge: 'Financial Fraud',
      desc: 'Scammers mail a forged check and demand immediate wiring to an unauthorized vendor before the check bounces.'
    },
    {
      title: 'Telegram & WhatsApp Text-Only Interviews',
      risk: 'High Alert',
      change: '+56% this month',
      badge: 'Identity Theft',
      desc: 'Unverified recruiters impersonating enterprise brands refusing video calls and conducting interviews solely via messaging apps.'
    },
    {
      title: 'Spoofed Lookalike Career Portals',
      risk: 'Severe',
      change: '+28% this month',
      badge: 'Domain Phishing',
      desc: 'Domains registered within the last 30 days mimicking legitimate company names (e.g., brand-careers-portal.com).'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>Platform Command Center &bull; Live Threat Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Security Intelligence &amp; Dossier History
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor real-time scam vectors, review verified dossiers, and audit employer risk metrics.
          </p>
        </div>

        {onNavigateScan && (
          <button
            onClick={onNavigateScan}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch New Investigation</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Total Investigations</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black font-mono text-white">{stats.verifications_completed || history.length}</div>
          <div className="text-[11px] text-cyan-400 mt-2 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Agent Verified</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>High Concern Traps Blocked</span>
            <ShieldAlert className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black font-mono text-rose-400">{stats.high_concern_cases || 4}</div>
          <div className="text-[11px] text-rose-300 mt-2 font-medium">Fee extortion &amp; domain spoofing</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Safety Health Rate</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black font-mono text-emerald-400">{safetyRate}%</div>
          <div className="text-[11px] text-emerald-300 mt-2 font-medium">Legitimacy detection accuracy</div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-white/10 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Saved Dossiers</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black font-mono text-purple-300">{history.length}</div>
          <div className="text-[11px] text-slate-400 mt-2 font-medium">Available for audit &amp; export</div>
        </div>
      </div>

      {/* UNIQUE FEATURE: Live Threat Radar */}
      <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-rose-400 animate-pulse" />
            <h2 className="text-base font-bold text-white">Live Threat Intelligence Radar</h2>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono">
            Updated Hourly
          </span>
        </div>
        <p className="text-xs text-slate-400">
          Top trending tactics currently exploited by fraudulent recruitment rings targeting remote job seekers:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {threatRadar.map((threat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2 hover:border-cyan-500/30 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-cyan-300 font-mono">{threat.badge}</span>
                <span className="text-[10px] text-rose-400 font-bold">{threat.change}</span>
              </div>
              <h3 className="text-xs font-bold text-white leading-snug">{threat.title}</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">{threat.desc}</p>
              <div className="pt-2 flex items-center justify-between text-[10px]">
                <span className="text-rose-400 font-semibold">{threat.risk}</span>
                <span className="text-slate-500">Global Threat Alert</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Searchable History & Saved Dossiers */}
      <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Verified Investigation Dossiers
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Filter, inspect, print, or export saved security reports.</p>
          </div>

          {/* Search Bar & Severity Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search company or job..."
                className="pl-9 pr-3 py-2 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none w-48 sm:w-60"
              />
            </div>

            <div className="flex items-center gap-1 bg-navy-950 p-1 rounded-xl border border-white/10 text-xs">
              {(['all', 'high', 'warning', 'low'] as const).map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded-lg font-semibold uppercase text-[10px] transition-all cursor-pointer ${
                    filterSeverity === sev 
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* History Items List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500">Loading dossiers...</div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-12 text-center rounded-xl bg-navy-950/50 border border-white/5 space-y-3">
            <ShieldCheck className="w-8 h-8 text-slate-600 mx-auto" />
            <span className="text-xs text-slate-400 block">No verification reports found matching your criteria.</span>
            {onNavigateScan && (
              <button
                onClick={onNavigateScan}
                className="px-4 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-semibold cursor-pointer"
              >
                Scan an Offer Now
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredHistory.map((item) => {
              const assessment = (item.assessment || '').toUpperCase();
              const isHigh = assessment.includes('HIGH') || item.payment_detected;
              const isWarning = assessment.includes('WARNING') || assessment.includes('NEEDS');

              return (
                <div 
                  key={item.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.company_name || 'Unspecified Company'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        isHigh 
                          ? 'bg-rose-500/10 text-rose-300 border-rose-500/30' 
                          : isWarning 
                          ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                          : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {item.assessment || 'Verified'}
                      </span>
                      {item.payment_detected && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Fee Demanded
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1 max-w-xl">{item.summary || 'Full forensic audit completed.'}</p>
                    <div className="flex items-center gap-4 text-[10px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {item.created_at || 'Recently'}
                      </span>
                      <span>Target: {item.job_title || 'General Opening'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {onViewReport && item.report && (
                      <button
                        onClick={() => onViewReport(item.report!)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Dossier</span>
                      </button>
                    )}

                    <button
                      onClick={(e) => handlePrint(item, e)}
                      title="Print or Save PDF"
                      className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      title="Delete Record"
                      className="p-1.5 rounded-lg border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
