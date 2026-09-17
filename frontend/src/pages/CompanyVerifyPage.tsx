import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  Mail, 
  MapPin, 
  ArrowRight,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { verifyCompany } from '../services/api';

export const CompanyVerifyPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;
    setLoading(true);
    try {
      const res = await verifyCompany(companyName, website, recruiterEmail);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExample = () => {
    setCompanyName('ABC Technologies');
    setWebsite('https://abc-technologies.example');
    setRecruiterEmail('abccompany@gmail.com');
    setLocation('Toronto, Canada');
  };

  return (
    <div className="py-6 max-w-4xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
            Corporate Registry & Cross-Domain Audit
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Verify Company
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cross-examine corporate identity, website authenticity, and recruiter mailbox consistency.
        </p>
      </div>

      {/* Input Form Card */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-xl space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Company Name *
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., ABC Technologies, Microsoft"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-blue-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Official Website
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g., https://abc-technologies.example"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-blue-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Recruiter Contact / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={recruiterEmail}
                  onChange={(e) => setRecruiterEmail(e.target.value)}
                  placeholder="e.g., recruiter@company.com or @gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-blue-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Country / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g., USA, UK, India, Canada"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-blue-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
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
              Load Example Inconsistency Scenario (ABC Tech + Gmail)
            </button>

            <button
              type="submit"
              disabled={loading || !companyName.trim()}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? 'Auditing Entity...' : 'Verify Company Information'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>

      {/* Audit Result Display */}
      {result && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold">
                Company Verification Outcome
              </span>
              <h3 className="text-xl font-bold text-white mt-0.5">{companyName}</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              result.status === 'Verified Public Entity' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
              result.inconsistency_found ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
              'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
            }`}>
              {result.status}
            </span>
          </div>

          {/* Finding */}
          <div className="p-4 rounded-2xl bg-navy-950/80 border border-white/10 space-y-2 text-xs">
            <div className="font-semibold text-white flex items-center gap-2">
              {result.inconsistency_found ? (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              <span>{result.finding}</span>
            </div>
            <p className="text-slate-300 leading-relaxed pl-6">
              {result.explanation}
            </p>
          </div>

          {/* Inconsistencies List */}
          {result.inconsistencies && result.inconsistencies.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs space-y-2">
              <span className="font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Detected Inconsistencies:
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300 pl-2">
                {result.inconsistencies.map((inc: string, i: number) => (
                  <li key={i}>{inc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Responsible AI Disclaimer */}
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 leading-relaxed">
            <strong>Responsible AI Rule:</strong> TrustHire AI does not automatically label companies fraudulent on the basis of a domain discrepancy alone. Independent corporate confirmation is recommended.
          </div>
        </div>
      )}
    </div>
  );
};
