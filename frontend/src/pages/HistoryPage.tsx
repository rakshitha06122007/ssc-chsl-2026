import React, { useState, useEffect } from 'react';
import { 
  History, 
  Search, 
  Trash2, 
  Eye, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Calendar, 
  Building2, 
  Briefcase, 
  RefreshCw,
  FileText
} from 'lucide-react';
import { HistoryItem, VerificationReport } from '../types';
import { getHistory, deleteHistoryItem } from '../services/api';

interface HistoryPageProps {
  onViewReport: (report: VerificationReport) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onViewReport }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getHistory();
      if (data && data.history) {
        setHistory(data.history);
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

  const handleDelete = async (id: number) => {
    if (confirm('Delete this report record permanently?')) {
      await deleteHistoryItem(id);
      loadData();
    }
  };

  const filteredHistory = history.filter(item => 
    item.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.job_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.assessment.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
              Archived Reports
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verification History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Browse and review previously generated Opportunity Verification Reports.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors self-start sm:self-auto"
          title="Refresh History"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by company name, job title, or risk assessment..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
        />
      </div>

      {/* History Grid */}
      {filteredHistory.length === 0 ? (
        <div className="glass-panel rounded-3xl p-16 text-center text-xs text-slate-400 space-y-2">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <p>No verification records match your query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">{item.created_at}</span>
                  {getAssessmentBadge(item.assessment)}
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{item.company_name}</h3>
                  <p className="text-xs text-slate-300 font-medium">{item.job_title}</p>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-[10px] text-slate-500 font-mono">
                  User: {item.user_email}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {item.report && (
                    <button
                      onClick={() => onViewReport(item.report!)}
                      className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Report</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
