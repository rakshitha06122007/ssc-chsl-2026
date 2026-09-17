import React, { useState } from 'react';
import { 
  Mail, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Briefcase, 
  ArrowRight,
  Info
} from 'lucide-react';
import { verifyRecruiter } from '../services/api';

export const RecruiterEmailPage: React.FC = () => {
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recruiterEmail.trim()) return;
    setLoading(true);
    try {
      const res = await verifyRecruiter(recruiterEmail, companyName, '');
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setRecruiterEmail('google.careers.hr2026@gmail.com');
    setCompanyName('Google');
    setPosition('Remote Customer Operations');
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono text-[10px] font-bold">
            Recruiter Mailbox Intelligence
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Analyze Recruiter Email
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Forensic breakdown into FACT, WARNING INDICATOR, UNKNOWN, and AI ANALYSIS.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Recruiter Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="e.g., recruiter@company.com or hr-hiring@gmail.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-purple-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Claimed Company (Optional)
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Google, Microsoft"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-purple-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Offered Role / Position (Optional)
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Remote Customer Support"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-purple-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleExample}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Load Example Impersonation (Google + Gmail)
            </button>

            <button
              type="submit"
              disabled={loading || !recruiterEmail.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Analyzing Mailbox...' : 'Analyze Recruiter Email'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Result Display: FACT, WARNING INDICATOR, UNKNOWN, AI ANALYSIS */}
      {result && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Domain Analysis Verdict
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{recruiterEmail}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.status === 'Low Concern' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              result.status === 'Warning Indicator' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              {result.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* 1. FACT */}
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                FACTS
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {result.facts && result.facts.length > 0 ? (
                  result.facts.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500">No verified facts available.</li>
                )}
              </ul>
            </div>

            {/* 2. WARNING INDICATOR */}
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-amber-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                WARNING INDICATORS
              </span>
              <ul className="space-y-1.5 text-slate-300">
                {result.warnings && result.warnings.length > 0 ? (
                  result.warnings.map((w: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{w}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-400">No immediate warning indicators detected.</li>
                )}
              </ul>
            </div>

            {/* 3. UNKNOWN */}
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                UNKNOWN
              </span>
              <ul className="space-y-1.5 text-slate-400">
                {result.unknowns && result.unknowns.length > 0 ? (
                  result.unknowns.map((u: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{u}</span>
                    </li>
                  ))
                ) : (
                  <li>Corporate mailbox credentials require active handshake.</li>
                )}
              </ul>
            </div>

            {/* 4. AI ANALYSIS */}
            <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2">
              <span className="font-bold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                AI ANALYSIS
              </span>
              <p className="text-slate-300 leading-relaxed text-xs">
                {result.ai_analysis}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
