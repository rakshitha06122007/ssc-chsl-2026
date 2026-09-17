import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Lock, 
  FileText, 
  Layers, 
  ChevronRight,
  HelpCircle,
  FolderLock,
  Cpu,
  Building,
  Mail,
  CreditCard
} from 'lucide-react';

interface LandingPageProps {
  onStartVerification: () => void;
  onExploreDemo: () => void;
  onSelectTab: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartVerification,
  onExploreDemo,
  onSelectTab
}) => {
  return (
    <div className="space-y-24 py-8 sm:py-12 text-left">
      {/* HERO SECTION */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold animate-pulse">
          <ShieldCheck className="w-4 h-4" />
          <span>Enterprise Productivity / Agentic AI Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
          Verify Before You Trust. <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Verify Before You Pay.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          An AI-powered verification assistant that helps investigate job opportunities, work-from-home offers, recruiters, and companies using transparent evidence and forensic risk indicators.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
          <button
            onClick={() => onSelectTab('login')}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
          >
            <span>GET STARTED (LOGIN / OTP)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={onStartVerification}
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-cyan-500/30 text-white font-bold text-sm transition-all hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>VERIFY A JOB</span>
          </button>
          <button
            onClick={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>HOW IT WORKS</span>
          </button>
          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-5 py-4 rounded-xl bg-navy-950/80 hover:bg-navy-900 border border-white/10 text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <span>60s Demo</span>
            <span className="text-[9px] px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Instant</span>
          </button>
        </div>

        {/* Philosophy Badge */}
        <div className="p-4 rounded-2xl bg-navy-950/70 border border-white/10 max-w-2xl mx-auto text-xs text-slate-300 leading-relaxed">
          <p>
            <strong className="text-cyan-300">Central Promise:</strong> "Verify the opportunity, rather than detect fake companies." TrustHire AI handles real-world ambiguity responsibly, avoiding speculative <em>"100% genuine"</em> or <em>"100% scam"</em> claims.
          </p>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">The Threat Landscape</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">Why Traditional Job Checkers Fail</h2>
          <p className="text-slate-400 text-sm">
            Modern employment fraud is sophisticated. Scammers create spoofed domains, impersonate executive recruiters on LinkedIn, and use chat platforms to solicit upfront equipment deposits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Upfront Equipment Traps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applicants are told they must pay a $150–$500 "refundable insurance deposit" or buy software licenses before receiving their corporate laptop. The funds are never returned.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Recruiter Domain Impersonation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scammers claim to represent major brands (Google, Amazon, Microsoft) but communicate using free email providers (@gmail, @yahoo) or subtle typosquats (g00gle-jobs.com).
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Binary "Scam" Hallucinations</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Simple chatbots guess or falsely label legitimate small businesses as scams. TrustHire AI evaluates evidence rigorously and reports uncertainty transparently.
            </p>
          </div>
        </div>
      </section>

      {/* HOW TRUSTHIRE WORKS (AGENTIC ARCHITECTURE) */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/10 relative overflow-hidden">
          <div className="max-w-3xl mb-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Agentic AI Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Deterministic 8-Step Investigation Lifecycle
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              TrustHire AI is not a simple prompt wrapper. It coordinates specialized agents that execute a rigorous workflow with verifiable audit logs.
            </p>
          </div>

          {/* Workflow Steps Horizontal Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { num: '01', title: 'ASK', desc: 'Dynamic 1-question conversational inquiry' },
              { num: '02', title: 'COLLECT', desc: 'Gathers entity, channel, and offer artifacts' },
              { num: '03', title: 'INVESTIGATE', desc: 'Cross-checks entity registers and domains' },
              { num: '04', title: 'ANALYZE', desc: 'Scans for payment demands and urgency' },
              { num: '05', title: 'DECIDE', desc: 'Evaluates evidence sufficiency and consistency' },
              { num: '06', title: 'EXPLAIN', desc: 'Catalogs findings in the Evidence Locker' },
              { num: '07', title: 'REPORT', desc: 'Compiles Opportunity Verification Report' },
              { num: '08', title: 'LOG', desc: 'Records transparent step-by-step audit trace' },
            ].map((step) => (
              <div key={step.num} className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-1">
                <span className="font-mono text-cyan-400 text-xs font-bold">{step.num}</span>
                <h4 className="text-xs font-bold text-white tracking-wide">{step.title}</h4>
                <p className="text-[11px] text-slate-400">{step.desc}</p>
              </div>
            ))}
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs">
            <div className="flex items-start gap-3">
              <FolderLock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Evidence Locker</strong>
                <span className="text-slate-400">Classifies findings into User Provided, Verified Evidence, AI Analysis, and Unknown.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Before You Pay Protocol</strong>
                <span className="text-slate-400">Prominent safety shield triggered whenever upfront money or deposits are mentioned.</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-semibold">Responsible AI Grounding</strong>
                <span className="text-slate-400">Handles sparse inputs by declaring "Insufficient Evidence" rather than guessing.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK EXPLORE / FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {[
            {
              q: "Why doesn't TrustHire AI give a simple '100% Scam' or '100% Genuine' badge?",
              a: "Responsible AI in cybersecurity must avoid false certainty. A legitimate startup might use an unlisted domain, while an imposter can claim a Fortune 500 brand. TrustHire AI provides transparent evidence across 8 dimensions so users make informed decisions."
            },
            {
              q: "What should I do if a recruiter asks me to pay a refundable deposit for a laptop?",
              a: "Under no circumstances should you transfer money, purchase gift cards, or wire cryptocurrency. Standard corporate recruitment protocols provide equipment directly to hired candidates at company expense."
            },
            {
              q: "Does TrustHire AI store my personal passwords or banking credentials?",
              a: "No. The system strictly adheres to zero-knowledge credential security and never asks users for banking credentials, card numbers, or OTP codes."
            }
          ].map((faq, i) => (
            <div key={i} className="glass-panel rounded-xl p-5 border border-white/5 space-y-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER DISCLAIMER */}
      <footer className="pt-12 pb-6 border-t border-white/10 text-center space-y-4 max-w-4xl mx-auto px-4">
        <div className="flex justify-center gap-6 text-xs text-slate-400 flex-wrap">
          <button onClick={() => onSelectTab('guides')} className="hover:text-cyan-300 transition-colors">Work-From-Home Safety Guide</button>
          <button onClick={() => onSelectTab('guides')} className="hover:text-cyan-300 transition-colors">Company Verification Guide</button>
          <button onClick={() => onSelectTab('guides')} className="hover:text-cyan-300 transition-colors">Warning Signs Checklist</button>
          <button onClick={() => onSelectTab('evaluation')} className="hover:text-cyan-300 transition-colors">Evaluation Suite (20 Tests)</button>
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          <strong>Disclaimer:</strong> TrustHire AI provides verification assistance and risk indicators. It does not guarantee that an opportunity or company is legitimate or fraudulent. Always conduct independent verification before transferring funds or sharing confidential identity documents.
        </p>
      </footer>
    </div>
  );
};
