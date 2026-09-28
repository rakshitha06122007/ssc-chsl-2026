import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Target, 
  AlertTriangle, 
  ArrowRight, 
  BarChart2, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { TestAttemptResult, Question } from '../types/chsl';

interface PerformanceAnalyserProps {
  result: TestAttemptResult;
  allQuestions: Question[];
  onReviewQuestion: (questionId: string) => void;
  onRetakeTest: () => void;
  onNavigateToLessons: (topicId?: string) => void;
  onNavigateToRevision: () => void;
}

export function TestPerformanceAnalyser({
  result,
  allQuestions,
  onReviewQuestion,
  onRetakeTest,
  onNavigateToLessons,
  onNavigateToRevision
}: PerformanceAnalyserProps) {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}m ${remaining}s`;
  };

  const avgTimePerQuestion = result.attemptedCount > 0 
    ? Math.round(result.timeSpentSeconds / result.attemptedCount) 
    : 0;

  // Real Pattern Identification (No invented statistics)
  const isHighAccuracySlowSpeed = result.accuracyPercentage >= 85 && avgTimePerQuestion > 75;
  const isFastLowAccuracy = result.accuracyPercentage < 65 && avgTimePerQuestion < 35;
  const hasHighUnattempted = (result.unattemptedCount / result.totalQuestions) > 0.35;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Banner: Score & Accuracy */}
      <div className="glass-panel-elevated rounded-3xl p-6 md:p-8 border border-indigo-500/30 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {result.tier.toUpperCase()} Official Evaluation
              </span>
              <span className="text-xs text-slate-400">
                {new Date(result.timestamp).toLocaleDateString()} at {new Date(result.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {result.testTitle}
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Realistic forensic scoring based on the official SSC CHSL marking scheme.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-inner">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-3xl md:text-4xl font-extrabold text-amber-400 font-mono">
                {result.totalMarksScored.toFixed(1)}
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">
                Marks / {result.maxMarks}
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono">
                {result.accuracyPercentage.toFixed(1)}%
              </div>
              <div className="text-[11px] text-slate-400 uppercase font-semibold mt-0.5">
                Accuracy
              </div>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Correct Answers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              {result.correctCount} <span className="text-xs text-slate-400 font-normal">/ {result.totalQuestions}</span>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Incorrect Answers</span>
              <XCircle className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-black text-rose-400 font-mono">
              {result.incorrectCount}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Unattempted</span>
              <HelpCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-300 font-mono">
              {result.unattemptedCount}
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Total Time Spent</span>
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-black text-indigo-300 font-mono">
              {formatTime(result.timeSpentSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Pattern Diagnosis & Actionable Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wide">
              Attempt Pattern Diagnosis
            </h2>
          </div>

          <div className="space-y-3 text-sm">
            {isHighAccuracySlowSpeed && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-amber-300">High Accuracy, but Slow Pace:</strong>
                  Your precision is high ({result.accuracyPercentage.toFixed(1)}%), but average time per question ({avgTimePerQuestion}s) leaves questions untouched. Try speed calculation drills in Subject Tools.
                </div>
              </div>
            )}

            {isFastLowAccuracy && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-rose-300">Fast Attempts with Low Accuracy:</strong>
                  You answered quickly ({avgTimePerQuestion}s/Q), but lost marks to negative penalty ({result.incorrectCount} wrong). Focus on reading all options before clicking.
                </div>
              </div>
            )}

            {hasHighUnattempted && (
              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-indigo-300">High Unattempted Count:</strong>
                  {result.unattemptedCount} questions remained unattempted. Ensure you skip difficult questions in the first pass and sweep easy questions first.
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs leading-relaxed">
              <strong className="text-slate-100 block mb-1">Average Question Timing:</strong>
              Average time per attempted question was <span className="text-indigo-400 font-bold">{avgTimePerQuestion} seconds</span>. 
              Target for SSC CHSL Tier 1 is approx 36 seconds per question (100 Qs in 60 mins).
            </div>
          </div>
        </div>

        {/* Specific Next Actions */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wide">
                Targeted Next Actions
              </h2>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold shrink-0">1</span>
                <span>Review all <strong className="text-rose-400">{result.incorrectCount} incorrect questions</strong> in the Mistake Notebook and tag their mistake category.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold shrink-0">2</span>
                <span>Weakest area identified: <strong className="text-amber-300">{result.patternDiagnosis.weakestTopic || 'Advanced Mathematics & Reasoning'}</strong>. Complete the 13-part concept lesson.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center font-bold shrink-0">3</span>
                <span>Run a 10-minute Spaced Revision session on the formulas you forgot during this test.</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-slate-800">
            <button
              onClick={() => onNavigateToLessons()}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition"
            >
              Learn Weak Topic <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onNavigateToRevision}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              Open Revision Deck
            </button>
            <button
              onClick={onRetakeTest}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition ml-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake Test
            </button>
          </div>
        </div>
      </div>

      {/* Subject-Wise Real Breakdown */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Subject-Wise Performance</h2>
          </div>
          <span className="text-xs text-slate-400">Actual attempt breakdown</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {Object.entries(result.subjectBreakdown).map(([subjectId, stats]) => {
            const subjectLabels: Record<string, string> = {
              quantitative_aptitude: 'Quantitative Aptitude',
              reasoning: 'General Intelligence',
              english: 'English Language',
              general_awareness: 'General Awareness',
              computer_knowledge: 'Computer Knowledge'
            };
            return (
              <div key={subjectId} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-300 truncate mb-2">
                  {subjectLabels[subjectId] || subjectId}
                </div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xl font-bold text-white font-mono">{stats.marks.toFixed(1)}</span>
                  <span className="text-xs font-semibold text-emerald-400">{stats.accuracy.toFixed(0)}% acc</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
                  <div 
                    className="bg-indigo-500 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(0, stats.accuracy))}%` }} 
                  />
                </div>
                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>Correct: <b className="text-emerald-400">{stats.correct}</b></span>
                  <span>Wrong: <b className="text-rose-400">{stats.incorrect}</b></span>
                  <span>Skipped: <b className="text-slate-300">{stats.total - stats.attempted}</b></span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question by Question Review Trigger */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h2 className="text-base font-bold text-white mb-4">Question Review Palette</h2>
        <div className="flex flex-wrap gap-2">
          {allQuestions.map((q, idx) => {
            const response = result.userResponses[q.id];
            const isCorrect = response?.isCorrect;
            const isAttempted = response?.selectedOptionId !== null && response?.selectedOptionId !== undefined;
            return (
              <button
                key={q.id}
                onClick={() => onReviewQuestion(q.id)}
                className={`w-9 h-9 rounded-xl text-xs font-bold flex items-center justify-center transition border ${
                  !isAttempted
                    ? 'bg-slate-800/80 border-slate-700 text-slate-400 hover:border-slate-500'
                    : isCorrect
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-rose-500/20 border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
