import React, { useState } from 'react';
import { 
  FolderLock, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle, 
  HelpCircle,
  Filter
} from 'lucide-react';
import { EvidenceItem } from '../types';

interface EvidenceLockerProps {
  evidence: EvidenceItem[];
}

export const EvidenceLocker: React.FC<EvidenceLockerProps> = ({ evidence }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'User Provided', 'Verified Evidence', 'AI Analysis', 'Unknown'];

  const filteredEvidence = activeCategory === 'All' 
    ? evidence 
    : evidence.filter(e => e.category === activeCategory);

  const getStatusBadge = (status: EvidenceItem['status']) => {
    switch (status) {
      case 'High Concern':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/30">
            <AlertCircle className="w-3 h-3" />
            High Concern
          </span>
        );
      case 'Warning Indicator':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3" />
            Warning Indicator
          </span>
        );
      case 'Needs Verification':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            <HelpCircle className="w-3 h-3" />
            Needs Verification
          </span>
        );
      case 'Low Concern':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            Low Concern
          </span>
        );
    }
  };

  const getCategoryColor = (cat: EvidenceItem['category']) => {
    switch (cat) {
      case 'Verified Evidence': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'AI Analysis': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'User Provided': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <FolderLock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Evidence Locker</span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                {evidence.length} Findings
              </span>
            </h3>
            <p className="text-xs text-slate-400">Forensic artifacts, cross-domain checks & source attributions</p>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-cyan-500 text-navy-950 font-bold shadow-md shadow-cyan-500/20'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      <div className="mt-4 space-y-2.5">
        {filteredEvidence.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No evidence findings match this filter.
          </div>
        ) : (
          filteredEvidence.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-white/5 bg-navy-950/60 hover:border-white/15 transition-all overflow-hidden"
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[10px] text-slate-400 shrink-0 font-bold">
                      {item.id}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border shrink-0 font-medium ${getCategoryColor(item.category)}`}>
                      {item.category}
                    </span>
                    <p className="text-xs font-medium text-slate-200 truncate">
                      {item.finding}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {getStatusBadge(item.status)}
                    <button className="text-slate-400 hover:text-white transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-white/5 bg-white/[0.02] text-xs space-y-2 animate-fade-in">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-400">
                      <span><strong>Source:</strong> {item.source}</span>
                      <span><strong>Classification:</strong> {item.status}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-navy-900/80 border border-white/5 text-slate-300 leading-relaxed text-xs">
                      <strong className="text-cyan-300">Why it matters:</strong> {item.explanation}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
