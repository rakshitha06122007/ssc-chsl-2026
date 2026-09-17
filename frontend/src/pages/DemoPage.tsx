import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  HelpCircle, 
  RotateCcw,
  Zap
} from 'lucide-react';
import { DemoScenario, VerificationReport } from '../types';
import { getDemoScenarios, submitFullJobVerification } from '../services/api';
import { EvidenceLocker } from '../components/EvidenceLocker';
import { AuditTrace } from '../components/AuditTrace';
import { BeforeYouPay } from '../components/BeforeYouPay';
import { VerificationReportModal } from '../components/VerificationReportModal';

export const DemoPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<DemoScenario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const data = await getDemoScenarios();
        setScenarios(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  const handleRunScenario = async (scenario: DemoScenario) => {
    setRunningId(scenario.id);
    setReport(null);
    try {
      const res = await submitFullJobVerification('demo.judge@trusthire.ai', scenario.payload);
      if (res && res.report) {
        setReport(res.report);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
            Hackathon Presentation Suite
          </span>
          <span className="text-xs text-slate-400">1-Click Agentic Executions</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Demo Mode & Presentation Scenarios
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
          Pre-configured synthetic scenarios allowing hackathon judges and evaluators to observe the complete multi-step agent workflow in seconds.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((sc) => {
          const isRunning = runningId === sc.id;
          const isHackathon = sc.id === 'hackathon-demo';
          return (
            <div
              key={sc.id}
              className={`glass-panel rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                isHackathon 
                  ? 'border-cyan-500/50 bg-gradient-to-b from-cyan-950/20 to-[#0d1322] shadow-lg shadow-cyan-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                    isHackathon 
                      ? 'bg-cyan-500 text-navy-950 font-black animate-pulse' 
                      : 'bg-white/10 text-slate-300'
                  }`}>
                    {sc.badge}
                  </span>
                  {isHackathon && (
                    <span className="text-cyan-400 text-xs flex items-center gap-1 font-semibold">
                      <Zap className="w-3.5 h-3.5 fill-cyan-400" /> Top Pick
                    </span>
                  )}
                </div>
                <h3 className="text-base font-bold text-white">
                  {sc.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {sc.description}
                </p>
              </div>

              <button
                onClick={() => handleRunScenario(sc)}
                disabled={isRunning}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isHackathon
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/25'
                    : 'bg-white/10 hover:bg-white/15 text-slate-200'
                }`}
              >
                {isRunning ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-300" />
                    <span>Running Agent Investigation...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Run Complete Agent Workflow</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* BEFORE YOU PAY WARNING IF PAYMENT DETECTED IN DEMO */}
      {report?.payment_detected && (
        <BeforeYouPay 
          paymentDetails={{
            amount: report.company,
            purpose: 'Equipment Insurance Deposit'
          }}
          checklist={report.safety_checklist}
        />
      )}

      {/* LIVE DEMO RESULTS */}
      {report && (
        <div className="space-y-8 animate-fade-in pt-4 border-t border-white/10">
          {/* Result Header */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                Demo Workflow Result
              </span>
              <h2 className="text-2xl font-extrabold text-white mt-1">
                {report.company} — {report.job}
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Assessment: <strong className="text-cyan-300 font-bold">{report.assessment}</strong>
              </p>
            </div>

            <button
              onClick={() => setShowReportModal(true)}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-colors shrink-0"
            >
              <span>View Full Opportunity Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Evidence Locker */}
          <EvidenceLocker evidence={report.evidence_locker} />

          {/* Audit Trace */}
          <AuditTrace trace={report.audit_trace} />
        </div>
      )}

      {/* Full Report Modal */}
      <VerificationReportModal
        report={report}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
