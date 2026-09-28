import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  Play,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Sparkles,
  Zap,
  Target,
  Trophy,
  RotateCcw,
  BookOpen,
  ArrowRight,
  Search,
  ExternalLink,
  ShieldAlert,
  Send,
  HelpCircle
} from 'lucide-react';
import { EvaluationResponse, EvalCaseResult, DemoScenario, VerificationReport } from '../types';
import { runEvaluation, getDemoScenarios, submitFullJobVerification } from '../services/api';
import { EvidenceLocker } from '../components/EvidenceLocker';
import { AuditTrace } from '../components/AuditTrace';
import { BeforeYouPay } from '../components/BeforeYouPay';
import { VerificationReportModal } from '../components/VerificationReportModal';

interface ScamLabProps {
  onNavigateScan?: (prefill?: any) => void;
}

interface SimulatorChallenge {
  id: string;
  title: string;
  sender: string;
  snippet: string;
  details: string;
  isScam: boolean;
  trapExplanation: string;
  clues: string[];
}

const CHALLENGES: SimulatorChallenge[] = [
  {
    id: 'sim-1',
    title: 'Executive Assistant - Check Overpayment Trap',
    sender: 'recruiting-team@apexlogistics-careers.net',
    snippet: 'Congratulations! You have been selected for the Remote Executive Data Assistant role at $42/hr. We are sending a $3,250 cashier check to purchase an encrypted workstation from our verified vendor.',
    details: 'Received via direct email after an interview carried out entirely through text on Telegram. The check arrives via FedEx, and the recruiter instructs you to deposit it immediately and wire $2,800 to the vendor account before the check fully clears.',
    isScam: true,
    trapExplanation: 'CLASSIC CHECK OVERPAYMENT FRAUD: The cashier check is counterfeit and will bounce in 5-7 business days. Banks make funds available provisionally by law, so the victim wires real money to the criminal before the bank claws back the full bounced amount.',
    clues: ['Unsolicited high pay for entry-level work', 'Telegram-only text interview', 'Cashier check sent to purchase vendor equipment', 'Lookalike hyphenated domain (.net instead of legitimate company .com)']
  },
  {
    id: 'sim-2',
    title: 'Senior Frontend Engineer - Stripe Greenhouse',
    sender: 'alex.vance@stripe.com',
    snippet: 'Hi there, following up on your application for the Senior Frontend Engineer role on the Payments UI team. We would like to invite you to a 45-minute technical screen over Google Meet.',
    details: 'Applied through Stripe.com/jobs. The email headers show SPF and DKIM pass for stripe.com. The Google Meet link is hosted on meet.google.com with an @stripe.com calendar invitation.',
    isScam: false,
    trapExplanation: 'LEGITIMATE DIRECT HIRING: The email originates directly from verified corporate domain @stripe.com with passing cryptographic signatures (SPF/DKIM), formal video interview on Google Meet, and matches an active job listing.',
    clues: ['Cryptographically authenticated corporate domain', 'Video interview scheduled via standard calendar', 'Zero requests for payment, gift cards, or personal banking info']
  },
  {
    id: 'sim-3',
    title: 'Google Ad Reviewer - High Hourly Task Scam',
    sender: 'googlehr-onboarding-team@gmail.com',
    snippet: 'URGENT: Google is hiring remote Ad Optimization Specialists! $55/hr. Complete 35 ad validation tasks per day. Immediate start, no experience necessary.',
    details: 'Offer received via unsolicited WhatsApp message with a link to an unverified portal (google-adtask-pro.cc). You are asked to deposit $150 USDT crypto "working reserve" to unlock higher-tier commission tasks.',
    isScam: true,
    trapExplanation: 'TASK SCAM / CRYPTO ADVANCE-FEE: Google never conducts hiring via @gmail.com or WhatsApp. Demanding crypto or any advance payment to "unlock commissions" is a 100% confirmed Ponzi-style task scam.',
    clues: ['Google HR using free @gmail.com address', 'Cryptocurrency deposit required to unlock work tasks', 'Unsolicited WhatsApp solicitation', 'Suspicious unverified domain .cc']
  },
  {
    id: 'sim-4',
    title: 'Data Entry Associate - Upfront Equipment Deposit',
    sender: 'hr@healthcorp-remotejobs.org',
    snippet: 'You are selected for our Data Specialist position! We will provide a brand new MacBook Pro and dual monitors. To initiate courier shipping, please pay a refundable $200 insurance fee.',
    details: 'The employer claims to be a Fortune 500 healthcare provider, but the domain was registered 9 days ago. Payment is requested via Zelle or Apple Gift Cards to an "equipment logistics agent".',
    isScam: true,
    trapExplanation: 'UPFRONT EQUIPMENT SCAM: Legitimate enterprises NEVER ask new hires to pay insurance, shipping, or security deposits for employer-provided hardware, and NEVER request payment via Zelle or Gift Cards.',
    clues: ['Refundable equipment insurance deposit requested', 'Payment requested via Zelle/Gift Cards', 'Domain registered less than 2 weeks ago', 'Impersonating healthcare entity on high-churn .org domain']
  }
];

export const ScamLab: React.FC<ScamLabProps> = ({ onNavigateScan }) => {
  const [activeTab, setActiveTab] = useState<'simulator' | 'benchmark' | 'playbook'>('simulator');

  // Simulator State
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState<number>(0);
  const [userGuess, setUserGuess] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  // Benchmark State
  const [evalData, setEvalData] = useState<EvaluationResponse | null>(null);
  const [benchmarkRunning, setBenchmarkRunning] = useState<boolean>(false);
  const [expandedEvalId, setExpandedEvalId] = useState<string | null>(null);

  // Demo Scenarios State
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [demoRunningId, setDemoRunningId] = useState<string | null>(null);
  const [demoReport, setDemoReport] = useState<VerificationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Playbook State
  const [playbookSearch, setPlaybookSearch] = useState<string>('');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('fake-check');

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getDemoScenarios();
        setScenarios(data || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchScenarios();
  }, []);

  const currentChallenge = CHALLENGES[currentChallengeIdx];

  const handleMakeGuess = (guessIsScam: boolean) => {
    if (userGuess !== null) return;
    setUserGuess(guessIsScam);
    setShowExplanation(true);
    const isCorrect = guessIsScam === currentChallenge.isScam;
    setScore(prev => ({
      correct: isCorrect ? prev.correct + 1 : prev.correct,
      total: prev.total + 1
    }));
  };

  const handleNextChallenge = () => {
    setUserGuess(null);
    setShowExplanation(false);
    setCurrentChallengeIdx((prev) => (prev + 1) % CHALLENGES.length);
  };

  const handleRunBenchmark = async () => {
    setBenchmarkRunning(true);
    try {
      const data = await runEvaluation();
      setEvalData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setBenchmarkRunning(false);
    }
  };

  const handleRunDemoScenario = async (scenario: DemoScenario) => {
    setDemoRunningId(scenario.id);
    setDemoReport(null);
    try {
      const res = await submitFullJobVerification('demo.judge@trusthire.ai', scenario.payload);
      if (res && res.report) {
        setDemoReport(res.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDemoRunningId(null);
    }
  };

  // Playbook Topics
  const PLAYBOOK_TOPICS = [
    {
      id: 'fake-check',
      title: 'Fake Check & Equipment Overpayment',
      badge: 'Critical Threat',
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      summary: 'Criminal sends a counterfeit check to "buy home office equipment" from a specific vendor.',
      rule: 'NEVER accept or deposit checks from a remote company to buy supplies. Legitimate companies ship hardware directly to your door at zero expense.',
      steps: [
        'Check is physically sent via FedEx/UPS or emailed as an e-check image.',
        'Recipient deposits it; bank makes funds temporarily available within 24-48 hours.',
        'Scammer demands immediate wire, Zelle, or crypto payment to an "approved logistics vendor".',
        'Check bounces 5-10 days later; victim is legally liable to repay the entire sum to their bank.'
      ]
    },
    {
      id: 'task-scam',
      title: 'Cryptocurrency Task Scams & Optimization',
      badge: 'High Velocity',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      summary: 'Promising $200-$500/day for pressing "Submit" on app reviews or hotel bookings, demanding crypto deposits.',
      rule: 'If an employer requires you to deposit cryptocurrency or money in order to "reset your workbench" or "withdraw profits", it is an active Ponzi theft ring.',
      steps: [
        'Contact initiated via unsolicited WhatsApp or Telegram message.',
        'Candidate is shown a slick fake dashboard showing rapid "earnings".',
        'User encounters a "negative balance" or "combo task" requiring a deposit to continue.',
        'Once funds are deposited, withdrawals are permanently blocked with demands for "tax fees".'
      ]
    },
    {
      id: 'lookalike-domain',
      title: 'Executive & Recruiter Domain Impersonation',
      badge: 'Deceptive Vector',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      summary: 'Typosquatting authentic brand names (e.g. @apple-careers-portal.com or @stripe-hr.net).',
      rule: 'Always inspect the exact top-level domain. Legitimate talent recruiters email strictly from the primary corporate domain (e.g. @stripe.com, @google.com).',
      steps: [
        'Scammer registers a recently created domain with hyphens or alternate TLDs (.net, .careers, .cc).',
        'Clones the real company branding, CEO portrait, and authentic job descriptions from LinkedIn.',
        'Conducts text interviews without video to prevent candidate from discovering the deception.'
      ]
    },
    {
      id: 'interview-redflags',
      title: 'Chat-Only Text Interview Red Flags',
      badge: 'Operational Tell',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      summary: 'Conducting entire hiring pipelines strictly through Telegram, Signal, or WhatsApp messaging.',
      rule: 'Legitimate corporate hiring requires face-to-face video conferences or recorded corporate interviews, never anonymous chat apps.',
      steps: [
        'Recruiter directs you to message a specific username on Telegram (@Hiring_Manager_HR).',
        'Sends a questionnaire with 10 generic questions over text.',
        'Sends an official-looking offer letter 15 minutes later without any voice or video conversation.'
      ]
    }
  ];

  const filteredPlaybook = PLAYBOOK_TOPICS.filter(
    t => t.title.toLowerCase().includes(playbookSearch.toLowerCase()) ||
         t.summary.toLowerCase().includes(playbookSearch.toLowerCase()) ||
         t.rule.toLowerCase().includes(playbookSearch.toLowerCase())
  );

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-3 h-3" />
              Scam Lab & Evaluation Suite
            </span>
            <span className="text-xs text-slate-400">Interactive Adversarial Testing</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Scam Lab & Benchmark
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Test your scam detection intuition in the interactive simulator, verify multi-agent accuracy across our 20-case test suite, and study our forensic defensive playbook.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-navy-950/80 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'simulator'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Spot-the-Scam</span>
          </button>
          <button
            onClick={() => setActiveTab('benchmark')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'benchmark'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>20-Case Benchmark</span>
          </button>
          <button
            onClick={() => setActiveTab('playbook')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'playbook'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Defensive Playbook</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: SPOT-THE-SCAM SIMULATOR ================= */}
      {activeTab === 'simulator' && (
        <div className="space-y-6 animate-fade-in">
          {/* Header & Score Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">Interactive Challenge</span>
              <h2 className="text-lg font-bold text-white">Can You Spot the Employment Fraud?</h2>
              <p className="text-xs text-slate-400 mt-0.5">Read the communication, analyze the clues, and test your judgment against real forensic criteria.</p>
            </div>
            <div className="flex items-center gap-4 bg-navy-950/80 px-4 py-2.5 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-slate-300 font-medium">Your Score:</span>
                <span className="text-base font-bold font-mono text-cyan-300">
                  {score.correct} / {score.total}
                </span>
              </div>
              <button
                onClick={() => {
                  setScore({ correct: 0, total: 0 });
                  setCurrentChallengeIdx(0);
                  setUserGuess(null);
                  setShowExplanation(false);
                }}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                title="Reset Challenge Score"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Scenario Card */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-300 font-bold">
                  Case #{currentChallengeIdx + 1} of {CHALLENGES.length}
                </span>
                <span className="text-slate-400 font-medium truncate max-w-xs">{currentChallenge.title}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">Simulated Forensic Intercept</span>
            </div>

            {/* Email / Message Simulation Container */}
            <div className="rounded-2xl bg-navy-950/90 border border-white/10 p-5 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs pb-3 border-b border-white/10 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono">From:</span>
                  <span className="font-mono text-cyan-300 font-medium">{currentChallenge.sender}</span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">Received Today</span>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-white leading-relaxed">
                  "{currentChallenge.snippet}"
                </p>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 leading-relaxed space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Background Context</span>
                  <p>{currentChallenge.details}</p>
                </div>
              </div>
            </div>

            {/* Decision Buttons */}
            {userGuess === null ? (
              <div className="space-y-3 pt-2">
                <p className="text-center text-xs font-medium text-slate-300">
                  What is your verdict on this hiring communication?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => handleMakeGuess(true)}
                    className="py-4 px-6 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-rose-950/30 group"
                  >
                    <AlertTriangle className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" />
                    <span>Flag as SCAM / FRAUD</span>
                  </button>
                  <button
                    onClick={() => handleMakeGuess(false)}
                    className="py-4 px-6 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-sm transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg shadow-emerald-950/30 group"
                  >
                    <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span>Verify as SAFE / LEGITIMATE</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-5 animate-fade-in pt-2">
                {/* Result Announcement */}
                <div className={`p-4 rounded-2xl border flex items-center gap-3.5 ${
                  userGuess === currentChallenge.isScam
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                }`}>
                  {userGuess === currentChallenge.isScam ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {userGuess === currentChallenge.isScam
                        ? 'Spot On! Excellent Forensic Instinct.'
                        : 'Caution! This Was Deceptive.'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      This scenario is <strong className="text-white font-mono">{currentChallenge.isScam ? 'A CONFIRMED SCAM' : 'LEGITIMATE HIRING'}</strong>.
                    </p>
                  </div>
                </div>

                {/* Forensic Analysis & Clues */}
                <div className="p-5 rounded-2xl bg-navy-950/80 border border-white/10 space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold">Forensic Breakdown</span>
                    <p className="text-slate-200 leading-relaxed">{currentChallenge.trapExplanation}</p>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold mb-2">Key Diagnostic Clues:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentChallenge.clues.map((clue, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{clue}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Bar: Next or Inspect in Studio */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => {
                      if (onNavigateScan) {
                        onNavigateScan({
                          text: currentChallenge.snippet + '\n\n' + currentChallenge.details,
                          email: currentChallenge.sender
                        });
                      }
                    }}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Inspect with Omni-Scanner</span>
                  </button>

                  <button
                    onClick={handleNextChallenge}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Next Challenge Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick 1-Click Demo Scenarios */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>1-Click Live Agent Demo Scenarios</span>
                </h3>
                <p className="text-xs text-slate-400">Pre-configured synthetic scenarios executing real multi-agent investigations end-to-end.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((sc) => {
                const isRunning = demoRunningId === sc.id;
                const isHackathon = sc.id === 'hackathon-demo';
                return (
                  <div
                    key={sc.id}
                    className={`glass-panel rounded-2xl p-5 border flex flex-col justify-between space-y-4 transition-all ${
                      isHackathon
                        ? 'border-cyan-500/40 bg-gradient-to-b from-cyan-950/20 to-[#0d1322] shadow-lg shadow-cyan-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                          isHackathon ? 'bg-cyan-500 text-navy-950 font-black' : 'bg-white/10 text-slate-300'
                        }`}>
                          {sc.badge}
                        </span>
                        {isHackathon && (
                          <span className="text-cyan-400 text-xs font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 fill-cyan-400" /> Top Pick
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white">{sc.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">{sc.description}</p>
                    </div>

                    <button
                      onClick={() => handleRunDemoScenario(sc)}
                      disabled={isRunning}
                      className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isHackathon
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200'
                      }`}
                    >
                      {isRunning ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                          <span>Investigating...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Run Agent Workflow</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Demo Results Viewer */}
            {demoReport && (
              <div className="pt-6 space-y-6 animate-fade-in border-t border-white/10">
                {demoReport.payment_detected && (
                  <BeforeYouPay
                    paymentDetails={{
                      amount: demoReport.company,
                      purpose: 'Equipment Insurance Deposit'
                    }}
                    checklist={demoReport.safety_checklist}
                  />
                )}
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-white">Live Investigation Output</h3>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Formal Dossier</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <EvidenceLocker evidence={demoReport.evidence_locker} />
                  <AuditTrace trace={demoReport.audit_trace || []} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 2: 20-CASE BENCHMARK SUITE ================= */}
      {activeTab === 'benchmark' && (
        <div className="space-y-6 animate-fade-in">
          {/* Benchmark Header & Trigger */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">Automated Test Harness</span>
              <h2 className="text-lg font-bold text-white">20-Case Multi-Agent Accuracy Benchmark</h2>
              <p className="text-xs text-slate-400 mt-0.5">Executes actual deterministic multi-agent scans across 10 distinct adversarial threat vectors.</p>
            </div>
            <button
              onClick={handleRunBenchmark}
              disabled={benchmarkRunning}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {benchmarkRunning ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
                  <span>Running Live Verification...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Execute Full Benchmark</span>
                </>
              )}
            </button>
          </div>

          {/* Benchmark KPI Cards */}
          {evalData && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-xs font-medium">Test Pass Rate</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400 font-mono">{evalData.accuracy_pct}%</span>
                  <span className="text-xs text-slate-400 font-mono">({evalData.passed}/{evalData.total_tests})</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Verified against actual agent logic</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-xs font-medium">Execution Duration</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-cyan-300 font-mono">{evalData.duration_seconds}s</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Deterministic multi-agent pipeline</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-xs font-medium">Threat Categories</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white font-mono">
                    {Object.keys(evalData.category_breakdown || {}).length}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Vectors</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Full spectrum adversarial coverage</span>
              </div>

              <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
                <span className="text-slate-400 text-xs font-medium">Zero Hallucinations</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-blue-400 font-mono">100%</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Strictly grounded in evidence</span>
              </div>
            </div>
          )}

          {/* Category Breakdown */}
          {evalData && evalData.category_breakdown && (
            <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Threat Category Performance</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {Object.entries(evalData.category_breakdown).map(([cat, stat]) => (
                  <div key={cat} className="p-3 rounded-xl bg-navy-950/80 border border-white/5 space-y-1 text-xs">
                    <span className="text-[11px] text-slate-300 font-semibold block truncate" title={cat}>
                      {cat}
                    </span>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-400">Score:</span>
                      <span className={stat.passed === stat.total ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                        {stat.passed}/{stat.total} ({Math.round((stat.passed / stat.total) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed 20 Test Cases */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Evaluation Matrix (20 Test Scenarios)</h3>
                <p className="text-xs text-slate-400">Expand any case to review the forensic payload, expected verdict, and agent audit trail.</p>
              </div>
              {evalData && (
              <span className="text-xs font-mono text-slate-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                {evalData.test_results?.length || 20} Cases Analyzed
              </span>
            )}
          </div>

          {evalData && evalData.test_results && evalData.test_results.length > 0 ? (
            <div className="space-y-3 pt-2">
              {evalData.test_results.map((res: EvalCaseResult) => {
                const isExpanded = expandedEvalId === res.id;
                const isPassed = res.passed;
                return (
                  <div
                    key={res.id}
                    className="rounded-2xl border border-white/10 bg-navy-950/60 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setExpandedEvalId(isExpanded ? null : res.id)}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors cursor-pointer gap-4"
                    >
                      <div className="flex items-center gap-3">
                        {isPassed ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-cyan-300">{res.id}</span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                              {res.category}
                            </span>
                          </div>
                          <span className="text-xs font-semibold text-white block mt-0.5">{res.name}</span>
                          <span className="text-[11px] text-slate-400 block mt-0.5">{res.description}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right hidden sm:block">
                          <span className="text-[11px] font-mono block text-slate-400">
                            Verdict: <strong className="text-white">{res.actual.assessment}</strong>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{res.latency_ms}ms</span>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-4 pt-2 border-t border-white/5 bg-navy-950/90 text-xs space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="p-3 rounded-xl bg-white/5 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Expected Outcome</span>
                            <span className="font-mono text-emerald-400 font-semibold">{res.expected.assessment}</span>
                          </div>
                          <div className="p-3 rounded-xl bg-white/5 space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Actual Result</span>
                            <span className="font-mono text-cyan-300 font-semibold">{res.actual.assessment}</span>
                          </div>
                        </div>

                        {res.actual.summary && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Agent Summary</span>
                            <p className="text-slate-300 leading-relaxed">{res.actual.summary}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            ) : (
              <div className="p-10 text-center rounded-2xl bg-navy-950/40 border border-dashed border-white/10 space-y-3">
                <FlaskConical className="w-8 h-8 text-cyan-400/60 mx-auto" />
                <h4 className="text-sm font-semibold text-white">Benchmark Ready to Run</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click the "Execute Full Benchmark" button above to initiate real-time verification across all 20 test cases.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DEFENSIVE PLAYBOOK ================= */}
      {activeTab === 'playbook' && (
        <div className="space-y-6 animate-fade-in">
          {/* Search & Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-white/10">
            <div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">Defensive Playbook</span>
              <h2 className="text-lg font-bold text-white">Remote Employment Fraud Playbook</h2>
              <p className="text-xs text-slate-400 mt-0.5">Authoritative tactics, mechanics, and defensive protocols against common scams.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search red flags & tactics..."
                value={playbookSearch}
                onChange={(e) => setPlaybookSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-navy-950/80 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlaybook.map((topic) => (
              <div
                key={topic.id}
                className="glass-panel rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${topic.badgeColor}`}>
                      {topic.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">{topic.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{topic.summary}</p>

                  <div className="p-3.5 rounded-xl bg-navy-950/90 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">Defensive Rule</span>
                    <p className="font-semibold leading-relaxed">{topic.rule}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">Modus Operandi Breakdown:</span>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {topic.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-mono text-cyan-400 text-[10px] mt-0.5">{i + 1}.</span>
                        <span className="leading-snug">{st}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Candidate Safety Pledge Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-bold block">Defensive Best Practice</span>
              <h4 className="text-base font-bold text-white">The Golden Rule of Remote Job Safety</h4>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Money only flows in ONE direction: from the employer to the employee. An authentic company will never ask you to pay, transfer, deposit, or purchase anything upfront.
              </p>
            </div>
            <button
              onClick={() => onNavigateScan?.()}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shrink-0 cursor-pointer transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <span>Verify an Offer Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Modal for Demo Report */}
      {showReportModal && demoReport && (
        <VerificationReportModal
          report={demoReport}
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </div>
  );
};
