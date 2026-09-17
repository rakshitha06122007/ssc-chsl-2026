import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  ExternalLink, 
  Building2, 
  ArrowRight,
  Info
} from 'lucide-react';
import { verifyWebsite } from '../services/api';

export const WebsiteAnalyzePage: React.FC = () => {
  const [website, setWebsite] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!website.trim()) return;
    setLoading(true);
    try {
      const res = await verifyWebsite(website, companyName);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setWebsite('https://netflix-careers-portal.live');
    setCompanyName('Netflix');
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
            Domain & Protocol Forensic Engine
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Analyze Website
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Evaluates top-level domains, HTTPS enforcement, typosquatting risk, and organizational consistency.
        </p>
      </div>

      {/* Input Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Website URL / Domain *
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="e.g., https://netflix-careers-portal.live or company.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-emerald-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Claimed Employer / Brand (Optional)
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Netflix, Google, Apple"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-emerald-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleExample}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Load Example Typosquatting (Netflix + .live domain)
            </button>

            <button
              type="submit"
              disabled={loading || !website.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Analyzing Domain...' : 'Analyze Website'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Parsed Domain: {result.domain}
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{website}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.status === 'Low Concern' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              result.status === 'Warning Indicator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              {result.status}
            </span>
          </div>

          {/* Facts vs Warnings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px]">
                Identified Domain Properties
              </span>
              <ul className="space-y-1 text-slate-300">
                {result.facts && result.facts.map((f: string, i: number) => (
                  <li key={i}>• {f}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px]">
                Potential Warning Indicators
              </span>
              <ul className="space-y-1 text-slate-300">
                {result.warnings && result.warnings.length > 0 ? (
                  result.warnings.map((w: string, i: number) => (
                    <li key={i} className="text-amber-200">• {w}</li>
                  ))
                ) : (
                  <li className="text-slate-400">No red flags identified in domain syntax.</li>
                )}
              </ul>
            </div>
          </div>

          {/* Responsible AI Disclaimer */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            <strong>Responsible AI Rule:</strong> TrustHire AI does not claim that website age, design aesthetics, or SSL certificates alone prove organizational legitimacy. Genuine enterprises must be cross-checked with independent registries.
          </div>
        </div>
      )}
    </div>
  );
};
