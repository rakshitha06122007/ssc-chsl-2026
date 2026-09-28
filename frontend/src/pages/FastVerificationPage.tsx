import React, { useState, useRef } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Building2,
  Briefcase,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Zap,
  Info,
  Globe,
  Mail,
  Copy,
  Check,
  MessageSquare,
  Lock,
  Layers,
  ShieldAlert
} from 'lucide-react';
import { verifyCompany, verifyWebsite, submitFullJobVerification } from '../services/api';
import { EvidenceLocker } from '../components/EvidenceLocker';
import { AuditTrace } from '../components/AuditTrace';
import { EvidenceItem, AuditTraceStep, VerificationReport } from '../types';

export type VerificationType = 'company' | 'job';

export interface FastAssessmentResult {
  type: VerificationType;
  level: 'Lower Risk' | 'Caution' | 'High Risk';
  title: string;
  summary: string;
  reasons: string[];
  facts: string[];
  warnings: string[];
  inferences: string[];
  recommendedAction: string;
  limitations: string;
  latencySeconds: number;
  evidenceItems: EvidenceItem[];
  auditTrace: AuditTraceStep[];
  rawReport?: VerificationReport;
  tacticalReplies?: {
    decline: string;
    verifyDemand: string;
    probe: string;
  };
}

interface FastVerificationPageProps {
  onViewHistory?: () => void;
}

export const FastVerificationPage: React.FC<FastVerificationPageProps> = ({ onViewHistory }) => {
  const [activeType, setActiveType] = useState<VerificationType>('company');

  // Company Form Inputs
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');

  // Job Offer Form Inputs
  const [jobText, setJobText] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [statusStep, setStatusStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState<FastAssessmentResult | null>(null);
  const [showDetailedAnalysis, setShowDetailedAnalysis] = useState(false);
  const [selectedReplyTab, setSelectedReplyTab] = useState<'decline' | 'verifyDemand' | 'probe'>('decline');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // 1-Click Quick Fill Presets for Instant Testing
  const handlePresetCompany = (name: string, web: string) => {
    setCompanyName(name);
    setCompanyWebsite(web);
    setErrorMessage('');
    setResult(null);
  };

  const handlePresetJob = (text: string, contact: string) => {
    setJobText(text);
    setRecruiterContact(contact);
    setErrorMessage('');
    setResult(null);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Main Submit Handler
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    // Input Validation
    if (activeType === 'company') {
      if (!companyName.trim() || companyName.trim().length < 2) {
        setErrorMessage('Please enter a company name (at least 2 characters).');
        return;
      }
    } else {
      if (!jobText.trim() || jobText.trim().length < 15) {
        setErrorMessage('Please paste or type the job offer text or recruitment message (at least 15 characters).');
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setShowDetailedAnalysis(false);
    setStatusStep(1);
    setStatusMessage('Querying corporate registries & entity filings...');
    const startTime = performance.now();

    try {
      if (activeType === 'company') {
        const checks = [verifyCompany(companyName.trim(), companyWebsite.trim())];
        if (companyWebsite.trim()) {
          setStatusStep(2);
          setStatusMessage('Inspecting DNS WHOIS & cryptographic TLS certificates...');
          checks.push(verifyWebsite(companyWebsite.trim(), companyName.trim()));
        }

        const [compRes, webRes] = await Promise.all(checks);
        setStatusStep(3);
        setStatusMessage('Synthesizing risk assessment & heuristic findings...');

        const latency = Number(((performance.now() - startTime) / 1000).toFixed(2));

        let level: 'Lower Risk' | 'Caution' | 'High Risk' = 'Lower Risk';
        let title = '';
        let summary = '';
        const reasons: string[] = [];
        const facts: string[] = [];
        const warnings: string[] = [];
        const inferences: string[] = [];
        let recommendedAction = '';

        const isEntityVerified = compRes?.status === 'Verified Public Entity';
        const hasInconsistency = Boolean(compRes?.inconsistency_found);
        const webWarnings = webRes?.warnings || [];

        if (hasInconsistency || webWarnings.length > 0) {
          if (webWarnings.some((w: string) => w.toLowerCase().includes('typosquat') || w.toLowerCase().includes('spoof'))) {
            level = 'High Risk';
            title = 'High Risk — Domain Spoofing or Lookalike Impersonation';
            summary = 'The supplied website appears to impersonate an authentic corporate brand using a lookalike or typosquatted domain.';
          } else {
            level = 'Caution';
            title = 'Caution — Information Inconsistencies Detected';
            summary = compRes?.explanation || 'Discrepancies identified between claimed company name and official records.';
          }
        } else if (isEntityVerified) {
          level = 'Lower Risk';
          title = 'Lower Risk — Registered Public Entity Verified';
          summary = compRes?.finding || `${companyName} matches an authentic registered business entity.`;
        } else {
          level = 'Caution';
          title = 'Caution — Unlisted or Private Enterprise';
          summary = `'${companyName}' was not located in major enterprise registries. This is normal for early-stage startups, private agencies, or local businesses.`;
        }

        // Reasons
        if (isEntityVerified) {
          reasons.push(`Verified registered corporate identity: ${compRes?.data?.official_name || companyName}.`);
          if (compRes?.data?.hq) reasons.push(`Recognized headquarters: ${compRes.data.hq}.`);
          if (compRes?.data?.standard_hiring_process) reasons.push(`Standard hiring protocol: ${compRes.data.standard_hiring_process}`);
        } else {
          reasons.push(`Entity not found in centralized public multinational registries.`);
          reasons.push(`Local business registry records should be reviewed manually.`);
        }

        if (compRes?.inconsistencies && compRes.inconsistencies.length > 0) {
          compRes.inconsistencies.forEach((inc: string) => reasons.push(inc));
          warnings.push(...compRes.inconsistencies);
        }

        if (webWarnings.length > 0) {
          webWarnings.forEach((w: string) => warnings.push(w));
        }

        // Facts
        if (compRes?.data?.domains) {
          facts.push(`Official Authorized Domains: ${compRes.data.domains.join(', ')}`);
        }
        if (companyWebsite.trim()) {
          facts.push(`Supplied Website: ${companyWebsite.trim()}`);
        }
        if (webRes?.facts) {
          facts.push(...webRes.facts);
        }

        inferences.push('Analysis based on automated public entity indexing and cryptographic domain attributes.');
        if (!isEntityVerified) {
          inferences.push('Absence from enterprise database does NOT indicate fraud; many legitimate small companies are not publicly indexed.');
        }

        if (level === 'Lower Risk') {
          recommendedAction = `Ensure communications originate strictly from official domains (${compRes?.data?.domains?.[0] || 'the corporate domain'}). Proceed with standard professional interview process.`;
        } else if (level === 'High Risk') {
          recommendedAction = `Do not share personal financial data or accept checks. Independently contact the company switchboard to report suspected impersonation.`;
        } else {
          recommendedAction = `Request the recruiter's official corporate email and cross-check the business on your local government business registry.`;
        }

        const limitations = 'TrustHire checks corporate registries, authoritative domain records, and public filings. It cannot verify private confidential contracts or unlisted small businesses without local registry inspection.';

        const evidenceItems: EvidenceItem[] = [
          {
            id: 'ev-1',
            finding: isEntityVerified ? 'Registered Business Record Found' : 'Unlisted in Central Enterprise Index',
            source: 'Corporate Registries & Open Entity Data',
            category: 'Verified Evidence',
            status: isEntityVerified ? 'Low Concern' : 'Needs Verification',
            explanation: compRes?.explanation || 'Corporate directory search results.'
          }
        ];

        if (companyWebsite.trim()) {
          evidenceItems.push({
            id: 'ev-2',
            finding: webRes?.finding || `Website Domain: ${companyWebsite}`,
            source: 'Whois & DNS Inspector',
            category: 'Verified Evidence',
            status: webWarnings.length > 0 ? 'Warning Indicator' : 'Low Concern',
            explanation: webWarnings.length > 0 ? webWarnings.join(' ') : 'Domain structure aligns with standard corporate presence.'
          });
        }

        const auditTrace: AuditTraceStep[] = [
          { step: 1, action: 'Query Public Registries', result: isEntityVerified ? 'Entity Record Match' : 'Unlisted/Private', next_decision: 'Evaluate Domain Properties' },
          { step: 2, action: 'Cross-Check Official Domains', result: hasInconsistency ? 'Domain Mismatch' : 'Aligned', next_decision: 'Formulate Assessment' }
        ];

        const tacticalReplies = {
          decline: `Thank you for reaching out. Based on security analysis of the provided information, I am unable to verify the corporate affiliation of this opportunity. As a matter of policy, I do not participate in unverified hiring procedures or advance payments. Please remove my contact information from your records.`,
          verifyDemand: `Hello. Before moving forward, please send an official interview invitation from your verified corporate domain email address and provide the direct requisition link on your corporate careers portal. I also require all interviews to take place over corporate video conference (Google Meet / Teams / Zoom).`,
          probe: `Thank you for the message. Could you please share the registered corporate business registration number (EIN/CIN/Companies House ID) and the direct phone extension of your Human Resources department for identity confirmation?`
        };

        setResult({
          type: 'company',
          level,
          title,
          summary,
          reasons,
          facts,
          warnings,
          inferences,
          recommendedAction,
          limitations,
          latencySeconds: latency,
          evidenceItems,
          auditTrace,
          tacticalReplies
        });

      } else {
        // JOB OFFER VERIFICATION
        setStatusStep(1);
        setStatusMessage('Extracting entities & parsing recruitment communication...');
        
        const payload = {
          raw_message: jobText.trim(),
          recruiter_email: recruiterContact.includes('@') ? recruiterContact.trim() : '',
          website: recruiterContact.includes('.') && !recruiterContact.includes('@') ? recruiterContact.trim() : ''
        };

        setStatusStep(2);
        setStatusMessage('Analyzing advance-fee triggers & equipment check patterns...');
        const jobRes = await submitFullJobVerification('user@trusthire.ai', payload);

        setStatusStep(3);
        setStatusMessage('Compiling forensic risk assessment...');

        const latency = Number(((performance.now() - startTime) / 1000).toFixed(2));
        const report = jobRes?.report;
        const rawAssessment = (jobRes?.assessment || report?.assessment || 'NEEDS VERIFICATION').toUpperCase();

        let level: 'Lower Risk' | 'Caution' | 'High Risk' = 'Caution';
        if (rawAssessment.includes('LOW')) {
          level = 'Lower Risk';
        } else if (rawAssessment.includes('HIGH') || rawAssessment.includes('WARNING') || jobRes?.payment_detected) {
          level = 'High Risk';
        } else {
          level = 'Caution';
        }

        const reasons: string[] = [];
        const facts: string[] = [];
        const warnings: string[] = [];
        const inferences: string[] = [];

        if (report?.summary) reasons.push(report.summary);
        if (report?.explanation && report.explanation !== report.summary) reasons.push(report.explanation);

        if (jobRes?.payment_detected) {
          warnings.push('CRITICAL: Upfront payment, cashier check deposit, or equipment fee detected in recruitment message.');
          reasons.push('Employer requests monetary transfer, advance deposit, or unverified hardware purchasing.');
        }

        const items: EvidenceItem[] = jobRes?.evidence_locker || report?.evidence_locker || [];
        items.forEach((item) => {
          if (item.status === 'High Concern' || item.status === 'Warning Indicator') {
            warnings.push(`${item.finding}: ${item.explanation}`);
          } else if (item.status === 'Low Concern') {
            facts.push(`${item.finding} (${item.source})`);
          } else {
            inferences.push(`${item.finding} (${item.explanation})`);
          }
        });

        let recommendedAction = '';
        if (level === 'High Risk') {
          recommendedAction = 'DO NOT transfer funds, deposit checks, or send personal financial documents (SSN/banking credentials). Cease communication immediately.';
        } else if (level === 'Caution') {
          recommendedAction = 'Verify that the vacancy is listed on the official company careers page and request a live video interview before sharing confidential information.';
        } else {
          recommendedAction = 'Proceed with standard pre-employment application etiquette. Never agree to pay for onboarding equipment.';
        }

        const limitations = 'Job offer heuristics evaluate communication patterns, advance-fee vectors, and sender domain alignment. Always verify the offer with the company human resources office directly.';

        const tacticalReplies = {
          decline: `Thank you for the communication. After reviewing this proposal against standard employment safety standards, I must decline. Legitimate employers provide necessary equipment directly and never require candidates to deposit checks or transfer funds to vendors. Please do not contact me further.`,
          verifyDemand: `Hello. To proceed with this candidacy, please send a calendar invitation from your corporate email domain for a formal video conference interview on Microsoft Teams or Google Meet, along with the requisition ID on your public careers portal.`,
          probe: `Thank you. Could you provide your corporate HR office contact number and the physical address of the facility handling this position so I may verify this offer with your personnel department?`
        };

        setResult({
          type: 'job',
          level,
          title: level === 'High Risk' ? 'High Risk — Employment Fraud Signals Detected' : (level === 'Lower Risk' ? 'Lower Risk — Standard Opportunity Signals' : 'Caution — Verification Required Before Proceeding'),
          summary: report?.summary || jobRes?.summary || 'Verification scan completed.',
          reasons: reasons.length > 0 ? reasons : ['Analysis completed based on communication text heuristics.'],
          facts,
          warnings,
          inferences,
          recommendedAction,
          limitations,
          latencySeconds: latency,
          evidenceItems: items,
          auditTrace: jobRes?.audit_trace || report?.audit_trace || [],
          rawReport: report,
          tacticalReplies
        });
      }

      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err: any) {
      console.error(err);
      setErrorMessage('Verification service encountered a network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
      setStatusMessage('');
      setStatusStep(0);
    }
  };

  const handleReset = () => {
    setCompanyName('');
    setCompanyWebsite('');
    setJobText('');
    setRecruiterContact('');
    setResult(null);
    setErrorMessage('');
    setShowDetailedAnalysis(false);
  };

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 space-y-9 text-left">
      {/* Stripe-style Vibrant Fintech Hero */}
      <div className="text-center space-y-4">
        {/* Luminous Pill Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500/15 via-indigo-500/15 to-pink-500/15 border border-violet-400/30 text-violet-200 text-xs font-semibold tracking-wide shadow-sm shadow-violet-500/10">
          <Sparkles className="w-3.5 h-3.5 text-violet-300" />
          <span>Intelligent Pre-Employment Risk Engine</span>
        </div>

        {/* Headline with vibrant gradient */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
          Verify Before You Trust.<br />
          <span className="bg-gradient-to-r from-violet-400 via-indigo-200 to-pink-300 bg-clip-text text-transparent">
            Verify Before You Pay.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Instantly evaluate employment offers and companies against official corporate registries, lookalike domain spoofing, and advance-fee fraud algorithms.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2 text-xs text-slate-300">
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-violet-400" /> Official Registries
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            <Lock className="w-3.5 h-3.5 text-emerald-400" /> Zero Data Retention
          </span>
          <span className="flex items-center gap-1.5 bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400" /> Sub-Second Analysis
          </span>
        </div>
      </div>

      {/* Main Single-Page Verification Card */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-9 relative overflow-hidden">
        {/* Illuminated top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-indigo-500 to-pink-500" />

        {/* Step 1: Choice Toggle */}
        <div className="flex p-1.5 rounded-2xl bg-[#0d1326] border border-white/10 max-w-md mx-auto mb-7 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setActiveType('company');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeType === 'company'
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-white/15'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Verify a Company</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveType('job');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeType === 'job'
                ? 'bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 border border-white/15'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Check a Job Offer</span>
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleVerify} className="space-y-6">
          {activeType === 'company' ? (
            /* Mode A: Company Inputs */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Company Name <span className="text-violet-400">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Official business or enterprise name</span>
                </label>
                <div className="relative">
                  <Building2 className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-violet-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Stripe, Google, Apex Logistics"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0d1326]/90 border border-white/10 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-inner"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Official Website or Domain <span className="text-slate-400 text-[11px] font-normal">(Optional)</span></span>
                  <span className="text-[11px] text-indigo-300 font-normal">Enables domain spoofing check</span>
                </label>
                <div className="relative">
                  <Globe className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="e.g. stripe.com or apexlogistics-careers.net"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0d1326]/90 border border-white/10 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 1-Click Quick Testing Pills */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>1-Click Test Scenarios:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetCompany('Google', 'google.com')}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-violet-500/40 text-xs text-slate-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>Google (Verified Enterprise)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetCompany('Apex Logistics', 'apexlogistics-careers.net')}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-rose-500/40 text-xs text-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    <span>Apex Logistics (Lookalike Spoof)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetCompany('Novatech Labs', '')}
                    className="px-3.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 hover:border-amber-500/40 text-xs text-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>Novatech Labs (Unlisted Startup)</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Mode B: Job Offer Inputs */
            <div className="space-y-4 animate-fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Job Offer Text or Recruitment Message <span className="text-violet-400">*</span></span>
                  <span className="text-[11px] text-slate-400 font-normal">Email, Telegram message, or letter</span>
                </label>
                <textarea
                  rows={4}
                  value={jobText}
                  onChange={(e) => setJobText(e.target.value)}
                  placeholder="Paste the email, Telegram message, or job offer letter here (e.g., 'Congratulations! We are pleased to offer you the remote position...')"
                  className="w-full p-4 rounded-2xl bg-[#0d1326]/90 border border-white/10 text-white placeholder-slate-400 text-sm leading-relaxed focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all resize-y shadow-inner"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Recruiter Email or Job Link <span className="text-slate-400 text-[11px] font-normal">(Optional)</span></span>
                  <span className="text-[11px] text-indigo-300 font-normal">Checks off-domain recruiters</span>
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={recruiterContact}
                    onChange={(e) => setRecruiterContact(e.target.value)}
                    placeholder="e.g. hr-onboarding@googlehr-careers.cc or recruiter email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#0d1326]/90 border border-white/10 text-white placeholder-slate-400 text-sm sm:text-base focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/30 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* 1-Click Quick Testing Pills */}
              <div className="pt-2">
                <span className="text-xs text-slate-400 block mb-2 font-medium flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>1-Click Test Scenarios:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePresetJob(
                      'Congratulations! You are selected as our Remote Executive Assistant at $42/hr. We are dispatching a cashier check of $3,250 to purchase an encrypted workstation from our approved hardware vendor. Please deposit the check immediately and wire the funds.',
                      'recruiter@apexlogistics-careers.net'
                    )}
                    className="px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs text-rose-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>🚨 Cashier Check Scam ($3,250)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetJob(
                      'URGENT: Google is hiring remote Ad Optimization Reviewers! $55/hr. Complete 35 tasks per day via Telegram. Deposit $150 USDT crypto working reserve to unlock VIP commission payouts.',
                      'googlehr-onboarding-team@gmail.com'
                    )}
                    className="px-3.5 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs text-amber-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>⚠️ Telegram Crypto Task Scam</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePresetJob(
                      'Hi there! Following up on your application for the Senior Frontend Engineer position at Stripe. We would like to schedule a 45-minute technical conversation on Google Meet.',
                      'alex.vance@stripe.com'
                    )}
                    className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <span>✅ Authentic Stripe Engineer Offer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
              <AlertCircleIcon className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 py-4 px-8 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-indigo-500/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin text-violet-200" />
                  <span>Evaluating Risk Factors...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-current" />
                  <span>Verify Now</span>
                </>
              )}
            </button>

            {(companyName || jobText || result) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center justify-center gap-2 shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Live Progress Status Indicator */}
          {loading && (
            <div className="p-4 rounded-2xl bg-[#0d1326]/95 border border-violet-500/40 text-xs text-violet-200 flex items-center gap-3.5 animate-fade-in shadow-inner">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 border border-violet-500/40 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet-300 animate-spin" />
              </div>
              <div className="space-y-0.5 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">Forensic Risk Analysis In Progress</span>
                  <span className="text-[10px] text-violet-400 font-mono">Stage {statusStep}/3</span>
                </div>
                <p className="text-[11px] text-violet-300/90 font-mono">{statusMessage || 'Executing parallel security checks...'}</p>
              </div>
            </div>
          )}
        </form>
      </div>

      {/* ================= RESULTS SECTION (ON SAME PAGE) ================= */}
      {result && (
        <div ref={resultsRef} className="space-y-6 animate-fade-in pt-2">
          {/* Main Assessment Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
            result.level === 'Lower Risk'
              ? 'bg-gradient-to-b from-emerald-950/40 via-[#0d1326] to-[#090d19] border-emerald-500/40 shadow-emerald-500/10'
              : result.level === 'Caution'
              ? 'bg-gradient-to-b from-amber-950/40 via-[#0d1326] to-[#090d19] border-amber-500/40 shadow-amber-500/10'
              : 'bg-gradient-to-b from-rose-950/40 via-[#0d1326] to-[#090d19] border-rose-500/40 shadow-rose-500/10'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                  result.level === 'Lower Risk'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-emerald-500/25'
                    : result.level === 'Caution'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-amber-500/25'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-rose-500/25'
                }`}>
                  {result.level === 'Lower Risk' && <ShieldCheck className="w-8 h-8" />}
                  {result.level === 'Caution' && <AlertTriangle className="w-8 h-8" />}
                  {result.level === 'High Risk' && <AlertOctagon className="w-8 h-8" />}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full font-mono shadow-sm ${
                      result.level === 'Lower Risk'
                        ? 'bg-emerald-500 text-slate-950'
                        : result.level === 'Caution'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-rose-500 text-white animate-pulse'
                    }`}>
                      {result.level}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      ⚡ Verified in {result.latencySeconds}s
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {result.title}
                  </h2>
                </div>
              </div>

              {onViewHistory && (
                <button
                  onClick={onViewHistory}
                  className="self-start sm:self-auto text-xs text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Clock className="w-3.5 h-3.5 text-violet-400" />
                  <span>View in History</span>
                </button>
              )}
            </div>

            {/* Assessment Summary */}
            <div className="py-5 space-y-5">
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-medium">
                {result.summary}
              </p>

              {/* Main Reasons Behind the Assessment */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono block">
                  Diagnostic Findings:
                </span>
                <div className="space-y-2">
                  {result.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                      <span className="text-violet-400 font-bold mt-0.5">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Facts vs Warning Signs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Verified Facts */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 font-mono flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verified Facts ({result.facts.length})</span>
                  </span>
                  {result.facts.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.facts.map((fact, idx) => (
                        <li key={idx} className="leading-snug">{fact}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No public entity records available for automatic verification.</p>
                  )}
                </div>

                {/* Warning Signs */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 font-mono flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Warning Signs ({result.warnings.length})</span>
                  </span>
                  {result.warnings.length > 0 ? (
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {result.warnings.map((warn, idx) => (
                        <li key={idx} className="leading-snug">{warn}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-slate-400">Zero active threat flags detected in provided inputs.</p>
                  )}
                </div>
              </div>

              {/* Recommended Next Action */}
              <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-xs sm:text-sm text-violet-200 space-y-1 mt-4">
                <span className="text-[11px] font-mono text-violet-300 uppercase tracking-wider font-bold block">
                  Recommended Action:
                </span>
                <p className="font-semibold leading-relaxed text-white">
                  {result.recommendedAction}
                </p>
              </div>

              {/* ⭐ FEATURE: Counter-Scam Tactical Reply Generator */}
              {result.tacticalReplies && (result.level === 'High Risk' || result.level === 'Caution') && (
                <div className="mt-4 p-5 rounded-2xl bg-[#0d1326]/90 border border-violet-500/30 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-violet-400" />
                      <span className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                        Counter-Scam Tactical Reply Generator
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">1-Click Defensive Candidate Reply</span>
                  </div>

                  {/* Strategy Tabs */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setSelectedReplyTab('decline')}
                      className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        selectedReplyTab === 'decline'
                          ? 'bg-rose-500/25 text-rose-200 border border-rose-500/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      🛑 Legal Refusal & Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedReplyTab('verifyDemand')}
                      className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        selectedReplyTab === 'verifyDemand'
                          ? 'bg-violet-500/25 text-violet-200 border border-violet-500/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      🎥 Demand Video Call & Official Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedReplyTab('probe')}
                      className={`px-3.5 py-1.5 rounded-full font-semibold transition-all cursor-pointer ${
                        selectedReplyTab === 'probe'
                          ? 'bg-amber-500/25 text-amber-200 border border-amber-500/40 shadow-sm'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      🔍 Probe for Business ID
                    </button>
                  </div>

                  {/* Reply Box with Copy Button */}
                  <div className="relative p-3.5 rounded-xl bg-black/60 border border-white/10 text-xs text-slate-200 font-mono leading-relaxed">
                    <p>{result.tacticalReplies[selectedReplyTab]}</p>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(result.tacticalReplies![selectedReplyTab], selectedReplyTab)}
                      className="mt-3 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-indigo-500/20"
                    >
                      {copiedKey === selectedReplyTab ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Response to Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Important Limitations (Responsible AI Note) */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                <p>{result.limitations}</p>
              </div>
            </div>

            {/* Expandable Detailed Analysis Toggle */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowDetailedAnalysis(!showDetailedAnalysis)}
                className="py-2 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer border border-white/5"
              >
                <span>{showDetailedAnalysis ? 'Hide Detailed Analysis' : 'View Detailed Analysis'}</span>
                {showDetailedAnalysis ? <ChevronUp className="w-4 h-4 text-violet-400" /> : <ChevronDown className="w-4 h-4 text-violet-400" />}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Start Another Check
              </button>
            </div>
          </div>

          {/* Expandable Detailed Analysis Section (Evidence Locker & Audit Trace) */}
          {showDetailedAnalysis && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <EvidenceLocker evidence={result.evidenceItems} />
                <AuditTrace trace={result.auditTrace} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
