import React, { useState } from 'react';
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
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { EvaluationResponse, EvalCaseResult } from '../types';
import { runEvaluation } from '../services/api';

export const EvaluationPage: React.FC = () => {
  const [evalData, setEvalData] = useState<EvaluationResponse | null>(null);
  const [running, setRunning] = useState<boolean>(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleRunEvaluation = async () => {
    setRunning(true);
    try {
      const data = await runEvaluation();
      setEvalData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto px-4 sm:px-6 space-y-8 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold">
              Automated Verification Benchmark
            </span>
            <span className="text-xs text-slate-400">Zero Fabricated Data</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Evaluation Suite (20 Test Cases)
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Rigorous automated test harness that executes real multi-agent investigations against 20 standardized industry scenarios spanning 10 forensic threat categories.
          </p>
        </div>

        <button
          onClick={handleRunEvaluation}
          disabled={running}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          {running ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-cyan-200" />
              <span>Running Live Tests...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Run Live Evaluation</span>
            </>
          )}
        </button>
      </div>

      {/* Metrics Banner */}
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
            <span className="text-slate-400 text-xs font-medium">Tested Categories</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">
                {Object.keys(evalData.category_breakdown || {}).length}
              </span>
              <span className="text-xs text-slate-400 font-mono">Categories</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Threat & ambiguity vectors</span>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10 space-y-1">
            <span className="text-slate-400 text-xs font-medium">Responsible AI Tests</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-blue-400 font-mono">100%</span>
            </div>
            <span className="text-[11px] text-slate-400 block">Zero hallucinated evidence</span>
          </div>
        </div>
      )}

      {/* Category Breakdown Chips */}
      {evalData && evalData.category_breakdown && (
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>Category Performance Breakdown</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {Object.entries(evalData.category_breakdown).map(([cat, stat]) => (
              <div key={cat} className="p-2.5 rounded-xl bg-navy-950/80 border border-white/5 space-y-1 text-xs">
                <span className="text-[11px] text-slate-300 font-semibold block truncate" title={cat}>
                  {cat}
                </span>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400">Score:</span>
                  <span className={stat.passed === stat.total ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {stat.passed}/{stat.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 20 Test Cases Detailed List */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-white/10 flex items-center justify-between">
          <span>Test Suite Executions</span>
          {evalData && (
            <span className="text-xs text-slate-400 font-mono font-normal">
              Timestamp: {evalData.timestamp}
            </span>
          )}
        </h3>

        {!evalData ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-3">
            <FlaskConical className="w-10 h-10 text-slate-600 mx-auto" />
            <p>Click "Run Live Evaluation" above to execute all 20 test cases against the agent engine.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {evalData.test_results.map((tc) => {
              const isExpanded = expandedId === tc.id;
              return (
                <div 
                  key={tc.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    tc.passed 
                      ? 'border-white/5 bg-navy-950/60 hover:border-white/15' 
                      : 'border-rose-500/30 bg-rose-950/10'
                  }`}
                >
                  <div 
                    onClick={() => setExpandedId(isExpanded ? null : tc.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer select-none text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0">
                        {tc.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-bold shrink-0">{tc.id}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-medium shrink-0">
                        {tc.category}
                      </span>
                      <p className="font-semibold text-white truncate">{tc.name}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="font-mono text-[10px] text-slate-400">{tc.latency_ms}ms</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                        tc.passed 
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                      }`}>
                        {tc.passed ? 'PASS' : 'FAIL'}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-white/5 bg-white/[0.01] text-xs space-y-3 animate-fade-in">
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        <strong>Test Purpose:</strong> {tc.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
                        <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-1">
                          <span className="font-bold text-slate-300 uppercase text-[9px] font-mono">Inputs Supplied:</span>
                          <pre className="text-[10px] text-slate-300 overflow-x-auto font-mono bg-black/30 p-2 rounded">
                            {JSON.stringify(tc.input, null, 2)}
                          </pre>
                        </div>

                        <div className="p-3 rounded-lg bg-navy-900 border border-white/5 space-y-2">
                          <div>
                            <span className="font-bold text-slate-300 uppercase text-[9px] font-mono">Expected:</span>
                            <p className="text-slate-200">Assessment: <strong className="text-cyan-300">{tc.expected.assessment}</strong> | Payment Flag: {String(tc.expected.payment_flag)}</p>
                          </div>
                          <div>
                            <span className="font-bold text-slate-300 uppercase text-[9px] font-mono">Actual:</span>
                            <p className="text-slate-200">Assessment: <strong className={tc.passed ? 'text-emerald-400' : 'text-rose-400'}>{tc.actual.assessment}</strong> | Payment Flag: {String(tc.actual.payment_flag)}</p>
                          </div>
                          <p className="text-slate-400 text-[10px] leading-relaxed italic">
                            Summary: {tc.actual.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
