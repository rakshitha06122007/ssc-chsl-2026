import React, { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Search, 
  Building2, 
  Mail, 
  Globe, 
  MessageSquare, 
  Sparkles, 
  Copy, 
  Check, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  FileCheck2, 
  Lock, 
  Send,
  Zap,
  Info
} from 'lucide-react';
import { 
  verifyCompany, 
  verifyRecruiter, 
  verifyWebsite, 
  verifyMessage, 
  submitFullJobVerification,
  submitJobChatStep
} from '../services/api';
import { User, VerificationReport } from '../types';

interface InvestigationStudioProps {
  user?: User | null;
  onViewReport?: (report: VerificationReport) => void;
  initialPayload?: Record<string, any>;
}

type StudioMode = 'omni' | 'interactive' | 'company' | 'recruiter' | 'website' | 'message';

export const InvestigationStudio: React.FC<InvestigationStudioProps> = ({ user, onViewReport, initialPayload }) => {
  const [mode, setMode] = useState<StudioMode>('omni');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Omni-Scanner inputs
  const [omniText, setOmniText] = useState('');
  
  // Specific inputs
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [recruiterEmail, setRecruiterEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [messageText, setMessageText] = useState('');

  React.useEffect(() => {
    if (initialPayload) {
      if (initialPayload.text) {
        setOmniText(initialPayload.text);
        setMode('omni');
      }
      if (initialPayload.company) setCompanyName(initialPayload.company);
      if (initialPayload.email) setRecruiterEmail(initialPayload.email);
      if (initialPayload.website) setWebsite(initialPayload.website);
      if (initialPayload.job_title) setJobTitle(initialPayload.job_title);
      if (initialPayload.message) setMessageText(initialPayload.message);
    }
  }, [initialPayload]);

  // Interactive mode states
  const [chatStep, setChatStep] = useState(1);
  const [chatQuestion, setChatQuestion] = useState('What company is this job offer from?');
  const [chatAnswer, setChatAnswer] = useState('');
  const [collectedData, setCollectedData] = useState<Record<string, any>>({});

  // Unified Analysis Result
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Countermeasure Generator selected template
  const [selectedCountermeasure, setSelectedCountermeasure] = useState<'verify' | 'payment' | 'interview'>('verify');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Sample Presets for Quick Testing
  const loadPreset = (preset: 'telegram_check' | 'google_impersonation' | 'legitimate_corp') => {
    if (preset === 'telegram_check') {
      setOmniText(`Congratulations! You have been selected for the Data Entry Analyst position at Finova Global. 
We will conduct your interview on Telegram with @FinovaHR_Desk. 
We will send you a cashier's check of $2,500 to purchase your office laptop from our certified vendor. 
Please deposit the check immediately and wire back the remaining balance.`);
      setMode('omni');
    } else if (preset === 'google_impersonation') {
      setOmniText(`Dear Candidate, I am Sarah Miller, Senior Technical Recruiter at Google LLC. 
We reviewed your profile and want to offer you a Remote AI Engineer position ($140k/yr). 
Please reply to my direct email: sarah.google.recruiting@gmail.com with your SSN and passport copy.`);
      setMode('omni');
    } else {
      setOmniText(`Offer Letter for Senior Frontend Developer at Stripe, Inc.
Official domain: stripe.com. Recruiter contact: careers@stripe.com. 
All onboarding is conducted through the Stripe candidate portal. No payments or equipment fees are required.`);
      setMode('omni');
    }
  };

  // Run Omni-Scanner
  const handleOmniScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!omniText.trim()) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      const emailMatch = omniText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
      const urlMatch = omniText.match(/(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(?:com|io|org|net|co|biz|xyz))/i);
      const extractedEmail = emailMatch ? emailMatch[0] : '';
      const extractedUrl = urlMatch ? urlMatch[0] : '';

      const fullInputs = {
        company_name: omniText.slice(0, 80),
        job_title: 'Position from Scanner',
        recruiter_email: extractedEmail,
        website: extractedUrl,
        raw_text: omniText,
        source: 'Omni-Scanner Studio'
      };

      const res = await submitFullJobVerification(user?.email || 'user@trusthire.ai', fullInputs);
      setAnalysisResult(res);
    } catch (err) {
      console.error('Scan error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run Specialized Analyzer
  const handleSpecializedScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);

    try {
      if (mode === 'company') {
        const res = await verifyCompany(companyName, website, recruiterEmail);
        setAnalysisResult({ assessment: res.risk_level === 'High Risk' ? 'HIGH CONCERN' : res.risk_level === 'Moderate Risk' ? 'NEEDS VERIFICATION' : 'LOW CONCERN', summary: res.summary, ...res });
      } else if (mode === 'recruiter') {
        const res = await verifyRecruiter(recruiterEmail, companyName, website);
        setAnalysisResult({ assessment: res.legitimacy === 'Suspicious' ? 'HIGH CONCERN' : res.legitimacy === 'Needs Caution' ? 'NEEDS VERIFICATION' : 'LOW CONCERN', summary: res.summary, ...res });
      } else if (mode === 'website') {
        const res = await verifyWebsite(website, companyName);
        setAnalysisResult({ assessment: res.verdict === 'Suspicious' ? 'HIGH CONCERN' : res.verdict === 'Unverified' ? 'NEEDS VERIFICATION' : 'LOW CONCERN', summary: res.summary, ...res });
      } else if (mode === 'message') {
        const res = await verifyMessage(messageText);
        const hasPayment = res.payment_red_flags && res.payment_red_flags.length > 0;
        setAnalysisResult({ assessment: hasPayment ? 'HIGH CONCERN' : 'NEEDS VERIFICATION', summary: hasPayment ? 'Payment solicitation and advance fee cues detected in message.' : 'Message analyzed for scam patterns.', ...res });
      }
    } catch (err) {
      console.error('Analyzer error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run Interactive Step
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatAnswer.trim()) return;

    const nextData = { ...collectedData, [`step_${chatStep}`]: chatAnswer };
    setCollectedData(nextData);
    setChatAnswer('');
    setLoading(true);

    try {
      const res = await submitJobChatStep(nextData);
      if (res.status === 'in_progress' && res.question_info) {
        setChatQuestion(res.question_info.question);
        setChatStep(s => s + 1);
      } else {
        const full = await submitFullJobVerification(user?.email || 'user@trusthire.ai', nextData);
        setAnalysisResult(full);
      }
    } catch (err) {
      console.error('Chat step error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Determine Risk Score & Color
  const getRiskInfo = () => {
    if (!analysisResult) return { score: 10, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Scan Ready' };
    const assessment = (analysisResult.assessment || '').toUpperCase();
    if (assessment.includes('HIGH') || analysisResult.payment_detected) {
      return { score: 94, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/40', label: 'High Scam Risk' };
    }
    if (assessment.includes('WARNING') || assessment.includes('NEEDS')) {
      return { score: 58, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/40', label: 'Needs Verification' };
    }
    return { score: 12, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Low Risk / Clean' };
  };

  const risk = getRiskInfo();

  // Countermeasure Templates
  const countermeasureTemplates = {
    verify: `Dear Recruiter,\n\nThank you for reaching out regarding this opportunity. To ensure compliance with security policies before proceeding, could you please provide:\n1. Your official corporate email address (from the verified company domain)\n2. The company's registered business identification / EIN number\n3. A link to this active opening on your official career portal (careers.company.com)\n\nLooking forward to your verification details.\n\nBest regards,`,
    payment: `Dear Hiring Team,\n\nThank you for the offer. However, per standard labor and security practices, I do not accept advance checks, nor do I wire funds or make upfront payments to private third-party vendors for equipment.\n\nIf company-provided hardware is required for this position, please courier the equipment directly to my address or bill it directly through your corporate supplier account.\n\nBest regards,`,
    interview: `Dear Hiring Representative,\n\nThank you for considering my application. I conduct all preliminary and formal interviews strictly via live video conference (Google Meet, Microsoft Teams, or Zoom) sent from an official corporate email address.\n\nI do not participate in text-only interviews via Telegram, WhatsApp, or Signal. Please provide a calendar invitation with an official meeting link at your convenience.\n\nBest regards,`
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Investigation Studio &bull; Multi-Agent Forensic Scanner</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Universal Job Verification Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Scan job offers, corporate emails, company domains, and suspicious interview messages with synchronized forensic agents.
          </p>
        </div>

        {/* Preset Quick Fill Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-mono">Try Scenario:</span>
          <button
            onClick={() => loadPreset('telegram_check')}
            className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            Telegram Check Scam
          </button>
          <button
            onClick={() => loadPreset('google_impersonation')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            Google Impersonation
          </button>
          <button
            onClick={() => loadPreset('legitimate_corp')}
            className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            Verified Stripe Offer
          </button>
        </div>
      </div>

      {/* Mode Selection Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-navy-950/80 border border-white/10 rounded-xl overflow-x-auto text-xs">
        {[
          { id: 'omni', label: 'Omni-Scanner (Universal)', icon: Sparkles },
          { id: 'interactive', label: 'Interactive Interview', icon: MessageSquare },
          { id: 'company', label: 'Company Authenticity', icon: Building2 },
          { id: 'recruiter', label: 'Recruiter Email', icon: Mail },
          { id: 'website', label: 'Domain & Website', icon: Globe },
          { id: 'message', label: 'Chat / SMS / Telegram', icon: Search },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id as StudioMode);
                setAnalysisResult(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                isActive 
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Studio Workspace: 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Scanner Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Mode 1: Omni-Scanner */}
            {mode === 'omni' && (
              <form onSubmit={handleOmniScan} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Universal Text / Offer / Message Paste
                    </label>
                    <span className="text-[11px] text-slate-500">Auto-detects emails, links &amp; red flags</span>
                  </div>
                  <textarea
                    rows={7}
                    required
                    value={omniText}
                    onChange={(e) => setOmniText(e.target.value)}
                    placeholder="Paste job description, email header, interview text, WhatsApp chat, or offer letter here..."
                    className="w-full p-4 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-mono leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-slate-400">
                    Runs 4 agents: Domain Analyzer, Payment Extortion, Entity Verifier, Scam Classifier.
                  </span>
                  <button
                    type="submit"
                    disabled={loading || !omniText.trim()}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <span>Execute Deep Scan</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Mode 2: Interactive Interview */}
            {mode === 'interactive' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-500/30 text-cyan-300 font-mono text-xs font-bold">
                      Step {chatStep}
                    </span>
                    <span className="text-xs text-white font-medium">{chatQuestion}</span>
                  </div>
                </div>

                <form onSubmit={handleChatSubmit} className="space-y-3">
                  <input
                    type="text"
                    autoFocus
                    required
                    value={chatAnswer}
                    onChange={(e) => setChatAnswer(e.target.value)}
                    placeholder="Type your response here..."
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !chatAnswer.trim()}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    >
                      {loading ? 'Evaluating...' : 'Next Step'}
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Mode 3: Company Authenticity */}
            {mode === 'company' && (
              <form onSubmit={handleSpecializedScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Technologies LLC"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Website (Optional)</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. acme.com"
                      className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Recruiter Email (Optional)</label>
                    <input
                      type="email"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                      placeholder="e.g. hr@acme.com"
                      className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !companyName.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Verifying Registry & Brand...' : 'Verify Company Legitimacy'}
                </button>
              </form>
            )}

            {/* Mode 4: Recruiter Email Scanner */}
            {mode === 'recruiter' && (
              <form onSubmit={handleSpecializedScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Recruiter Email Address</label>
                  <input
                    type="email"
                    required
                    value={recruiterEmail}
                    onChange={(e) => setRecruiterEmail(e.target.value)}
                    placeholder="e.g. recruiter@google-careers-portal.com or hr.google@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Claimed Company</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Google LLC"
                      className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Official Website</label>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="e.g. google.com"
                      className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !recruiterEmail.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Inspecting Domain & Headers...' : 'Analyze Recruiter Email'}
                </button>
              </form>
            )}

            {/* Mode 5: Website Domain Analyzer */}
            {mode === 'website' && (
              <form onSubmit={handleSpecializedScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Website URL or Domain</label>
                  <input
                    type="text"
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="e.g. https://amazon-careers-jobs-portal.xyz"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Claimed Brand / Company</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Amazon"
                    className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !website.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Checking WHOIS, Age & Typosquatting...' : 'Inspect Website Security'}
                </button>
              </form>
            )}

            {/* Mode 6: Chat / Message Analyzer */}
            {mode === 'message' && (
              <form onSubmit={handleSpecializedScan} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Interview Chat / Telegram / WhatsApp Message</label>
                  <textarea
                    rows={5}
                    required
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Paste messages demanding check deposits, gift cards, crypto tasks, or Telegram interview handles..."
                    className="w-full p-4 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !messageText.trim()}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  {loading ? 'Scanning for Extortion & Fee Cues...' : 'Scan Chat Message'}
                </button>
              </form>
            )}
          </div>

          {/* UNIQUE FEATURE: Counter-Scam Response Generator */}
          <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Counter-Scam Tactical Reply Generator</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">Defense Tool</span>
            </div>
            <p className="text-xs text-slate-400">
              Send one of these vetted counter-inquiries to expose fake recruiters and protect yourself before sharing personal data or money.
            </p>

            {/* Template Selector Tabs */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCountermeasure('verify')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCountermeasure === 'verify' 
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold' 
                    : 'bg-navy-950 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                1. Demand Corporate Proof
              </button>
              <button
                type="button"
                onClick={() => setSelectedCountermeasure('payment')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCountermeasure === 'payment' 
                    ? 'bg-rose-500/20 border-rose-400 text-rose-300 font-bold' 
                    : 'bg-navy-950 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                2. Refuse Equipment Fee
              </button>
              <button
                type="button"
                onClick={() => setSelectedCountermeasure('interview')}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedCountermeasure === 'interview' 
                    ? 'bg-purple-500/20 border-purple-400 text-purple-300 font-bold' 
                    : 'bg-navy-950 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                3. Demand Video Call
              </button>
            </div>

            {/* Template Display Box */}
            <div className="relative p-4 rounded-xl bg-navy-950 border border-white/15">
              <pre className="text-xs font-sans text-slate-300 whitespace-pre-wrap leading-relaxed">
                {countermeasureTemplates[selectedCountermeasure]}
              </pre>
              <button
                type="button"
                onClick={() => copyToClipboard(countermeasureTemplates[selectedCountermeasure], selectedCountermeasure)}
                className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedKey === selectedCountermeasure ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Response</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Threat Gauge & Forensic Dossier */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0d1322] border border-white/10 rounded-2xl p-6 shadow-xl space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Live Threat Dossier</h3>
              </div>
              <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${risk.bg} ${risk.color} ${risk.border}`}>
                {risk.label}
              </span>
            </div>

            {/* Risk Gauge Visual */}
            <div className="flex items-center gap-4 p-4 rounded-xl bg-navy-950 border border-white/10">
              <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-white/10"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={risk.color}
                    strokeDasharray={`${risk.score}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-lg font-black font-mono text-white leading-none">{risk.score}%</span>
                  <span className="text-[8px] text-slate-500 uppercase tracking-tighter">Risk</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">
                  {analysisResult?.assessment || 'No Analysis Executed'}
                </span>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {analysisResult?.summary || 'Submit an offer, email, domain, or message on the left to initiate real-time multi-agent investigation.'}
                </p>
              </div>
            </div>

            {/* Extracted Evidence Chips */}
            {analysisResult && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  Forensic Findings
                </h4>
                
                <div className="space-y-2">
                  {analysisResult.payment_detected && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="block font-semibold">Payment / Fee Extortion Detected</strong>
                        <span>Requesting check deposits or equipment purchases before work begins is a primary scam hallmark.</span>
                      </div>
                    </div>
                  )}

                  {analysisResult.evidence_locker && analysisResult.evidence_locker.length > 0 && (
                    <div className="space-y-1.5">
                      {analysisResult.evidence_locker.slice(0, 4).map((item: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs flex items-center justify-between">
                          <span className="text-slate-300 font-medium truncate max-w-[200px]">{item.finding || item.title || 'Evidence item'}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono shrink-0">
                            {item.status || item.source || 'Verified'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {onViewReport && analysisResult.report && (
                    <button
                      onClick={() => onViewReport(analysisResult.report)}
                      className="w-full mt-3 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Open Full Security Dossier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Defensive Advice Card */}
            <div className="p-3.5 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-slate-400 text-xs space-y-1.5">
              <span className="font-semibold text-cyan-300 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                TrustHire Golden Rule
              </span>
              <p className="text-[11px] leading-relaxed">
                Legitimate employers will <strong>never</strong> ask you to wire money, buy crypto, or deposit personal checks to pay for company hardware.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
