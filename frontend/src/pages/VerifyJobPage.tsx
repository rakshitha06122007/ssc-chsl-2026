import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Send, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  HelpCircle, 
  FileText, 
  RotateCcw,
  Bot,
  User as UserIcon,
  FolderLock,
  Terminal,
  Printer
} from 'lucide-react';
import { QuestionStep, VerificationReport, User } from '../types';
import { submitJobChatStep, submitFullJobVerification } from '../services/api';
import { EvidenceLocker } from '../components/EvidenceLocker';
import { AuditTrace } from '../components/AuditTrace';
import { BeforeYouPay } from '../components/BeforeYouPay';
import { VerificationReportModal } from '../components/VerificationReportModal';

interface VerifyJobPageProps {
  user: User | null;
  initialPayload?: Record<string, any>;
}

export const VerifyJobPage: React.FC<VerifyJobPageProps> = ({ user, initialPayload }) => {
  const [collectedData, setCollectedData] = useState<Record<string, any>>(initialPayload || {});
  const [currentQuestion, setCurrentQuestion] = useState<QuestionStep | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [investigating, setInvestigating] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'ai' | 'user'; text: string }>>([]);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  // Initialize or progress the question flow
  const fetchNextQuestion = async (data: Record<string, any>) => {
    setLoading(true);
    try {
      const res = await submitJobChatStep(data);
      if (res && res.question_info) {
        setCurrentQuestion(res.question_info);
        // Append AI message to chat history if not duplicate
        setChatHistory(prev => {
          const lastMsg = prev[prev.length - 1];
          if (lastMsg && lastMsg.sender === 'ai' && lastMsg.text === res.question_info.question) {
            return prev;
          }
          return [...prev, { sender: 'ai', text: res.question_info.question }];
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNextQuestion(collectedData);
  }, []);

  const handleAnswer = async (answerValue: string) => {
    if (!currentQuestion || !currentQuestion.field) return;
    const field = currentQuestion.field;
    
    // Add user message to conversation history
    setChatHistory(prev => [...prev, { sender: 'user', text: answerValue }]);

    const updatedData = { ...collectedData, [field]: answerValue };
    setCollectedData(updatedData);
    setInputValue('');

    await fetchNextQuestion(updatedData);
  };

  const handleSkip = async () => {
    if (!currentQuestion || !currentQuestion.field) return;
    const field = currentQuestion.field;
    const updatedData = { ...collectedData, [`${field}_skipped`]: true, [field]: 'None provided' };
    setCollectedData(updatedData);
    setInputValue('');
    await fetchNextQuestion(updatedData);
  };

  const handleExecuteInvestigation = async () => {
    setInvestigating(true);
    try {
      const res = await submitFullJobVerification(user?.email || 'guest@trusthire.ai', collectedData);
      if (res && res.report) {
        setReport(res.report);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setInvestigating(false);
    }
  };

  const handleReset = () => {
    setCollectedData({});
    setChatHistory([]);
    setReport(null);
    fetchNextQuestion({});
  };

  return (
    <div className="py-6 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
              Dynamic Inquiry Agent
            </span>
            <span className="text-xs text-slate-400">Step-by-Step Question Flow</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Verify Job Opportunity
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Completeness Bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Completeness:</span>
            <div className="w-28 h-2.5 rounded-full bg-navy-950 border border-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                style={{ width: `${currentQuestion?.completeness_score || 10}%` }}
              />
            </div>
            <span className="font-mono text-xs text-cyan-300 font-bold">
              {currentQuestion?.completeness_score || 10}%
            </span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 transition-colors"
            title="Reset Form"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* BEFORE YOU PAY WARNING IF PAYMENT DETECTED */}
      {report?.payment_detected && (
        <BeforeYouPay 
          paymentDetails={{
            amount: collectedData.payment_amount,
            purpose: collectedData.payment_purpose
          }}
          checklist={report.safety_checklist}
        />
      )}

      {/* CONVERSATIONAL QUESTION WORKFLOW CARD */}
      {!report && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
          {/* Chat Transcript Stream */}
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {chatHistory.map((msg, i) => (
              <div 
                key={i} 
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div 
                  className={`p-3.5 rounded-2xl max-w-lg leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-br-none shadow-md'
                      : 'bg-navy-950/80 border border-white/10 text-slate-200 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700/50 flex items-center justify-center text-slate-300 shrink-0">
                    <UserIcon className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2 items-center text-xs text-slate-400">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>Agent evaluating information completeness...</span>
              </div>
            )}
          </div>

          {/* Dynamic Interactive Input Area */}
          {currentQuestion && currentQuestion.step !== 'complete' && (
            <div className="pt-4 border-t border-white/10 space-y-4">
              {/* Option Chips if options available */}
              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {currentQuestion.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(opt)}
                      className="px-3.5 py-1.5 rounded-xl bg-navy-950 hover:bg-cyan-500/20 border border-white/15 hover:border-cyan-400/40 text-xs font-medium text-slate-200 hover:text-cyan-300 transition-all cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {/* Text / Textarea Input */}
              {currentQuestion.input_type !== 'none' && (
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) handleAnswer(inputValue.trim());
                  }}
                  className="space-y-3"
                >
                  <div className="flex gap-2">
                    {currentQuestion.input_type === 'textarea' ? (
                      <textarea
                        rows={3}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        className="w-full p-3 rounded-2xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={currentQuestion.placeholder}
                        className="w-full px-4 py-3 rounded-2xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all"
                      />
                    )}

                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold disabled:opacity-40 transition-all flex items-center justify-center cursor-pointer shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    {currentQuestion.can_skip ? (
                      <button
                        type="button"
                        onClick={handleSkip}
                        className="text-slate-400 hover:text-slate-200 transition-colors text-[11px]"
                      >
                        Skip this step →
                      </button>
                    ) : <span />}

                    {currentQuestion.can_investigate_now && (
                      <button
                        type="button"
                        onClick={handleExecuteInvestigation}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-1"
                      >
                        <span>Sufficient info gathered. Investigate Now →</span>
                      </button>
                    )}
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Investigation Trigger Button when Complete */}
          {(currentQuestion?.step === 'complete' || currentQuestion?.can_investigate_now) && (
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                onClick={handleExecuteInvestigation}
                disabled={investigating}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 mx-auto cursor-pointer transition-all hover:scale-105"
              >
                {investigating ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Orchestrating 8-Step Multi-Agent Investigation...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span>RUN COMPREHENSIVE INVESTIGATION</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* FINAL REPORT RESULTS VIEW */}
      {report && (
        <div className="space-y-8 animate-fade-in">
          {/* Assessment Summary Header */}
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-mono tracking-wider text-cyan-400 font-bold">
                  Investigation Assessment
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {report.company} — {report.job}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-navy-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:bg-cyan-400 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Full Report</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300 font-medium transition-colors"
                >
                  Verify Another
                </button>
              </div>
            </div>

            {/* Assessment Callout */}
            <div className={`p-4 rounded-2xl border ${
              report.assessment === 'HIGH CONCERN' ? 'bg-rose-500/10 border-rose-500/40 text-rose-300' :
              report.assessment === 'MULTIPLE WARNING SIGNS' ? 'bg-amber-500/10 border-amber-500/40 text-amber-300' :
              report.assessment === 'NEEDS VERIFICATION' ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' :
              report.assessment === 'INCONCLUSIVE' ? 'bg-slate-500/10 border-slate-500/40 text-slate-300' :
              'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2 text-sm font-bold">
                <span>Assessment:</span>
                <span className="font-extrabold tracking-wider">{report.assessment}</span>
              </div>
              <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                {report.explanation}
              </p>
            </div>
          </div>

          {/* Evidence Locker Component */}
          <EvidenceLocker evidence={report.evidence_locker} />

          {/* Audit Trace Component */}
          <AuditTrace trace={report.audit_trace} />
        </div>
      )}

      {/* Full Verification Report Modal */}
      <VerificationReportModal
        report={report}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
};
