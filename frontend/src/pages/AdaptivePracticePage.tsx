import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Clock, 
  RotateCcw, 
  Filter, 
  Sparkles, 
  ArrowRight, 
  AlertTriangle,
  Award,
  Zap,
  Tag
} from 'lucide-react';
import { Question, SubjectId, DifficultyLevel, MistakeCategory } from '../types/chsl';
import { QUESTION_BANK } from '../data/questionBank';
import { CHSLStorageService } from '../services/chslStorage';

interface AdaptivePracticePageProps {
  initialTopicId?: string;
  onNavigateToMistakes: () => void;
}

export function AdaptivePracticePage({
  initialTopicId,
  onNavigateToMistakes
}: AdaptivePracticePageProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [practiceMode, setPracticeMode] = useState<'learning' | 'test'>('learning');
  const [showOnlyPYQ, setShowOnlyPYQ] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState<boolean>(false);
  const [mistakeLoggedId, setMistakeLoggedId] = useState<string | null>(null);
  const [mistakeCategory, setMistakeCategory] = useState<MistakeCategory>('concept_not_understood');

  // Filter pool of questions
  const questions = QUESTION_BANK.filter(q => {
    if (initialTopicId && q.topicId !== initialTopicId) return false;
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    if (selectedDifficulty !== 'all' && q.difficulty !== selectedDifficulty) return false;
    if (showOnlyPYQ && q.sourceType !== 'verified_pyq') return false;
    return true;
  });

  const currentQ: Question | undefined = questions[currentIndex] || questions[0];

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswerRevealed && practiceMode === 'learning') return;
    setSelectedOption(optId);

    if (practiceMode === 'learning') {
      setIsAnswerRevealed(true);
      const isCorrect = optId === currentQ?.correctOptionId;
      if (!isCorrect && currentQ) {
        // Automatically save to mistake notebook!
        const entry = CHSLStorageService.addMistake({
          questionId: currentQ.id,
          questionText: currentQ.questionText,
          topicName: currentQ.topicName,
          subjectId: currentQ.subjectId,
          selectedOptionId: optId,
          correctOptionId: currentQ.correctOptionId,
          explanation: currentQ.explanation.stepByStep.join(' '),
          mistakeCategory: mistakeCategory
        });
        setMistakeLoggedId(entry.id);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setMistakeLoggedId(null);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setMistakeLoggedId(null);
    }
  };

  if (!currentQ) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center max-w-xl mx-auto space-y-4">
        <HelpCircle className="w-12 h-12 text-slate-500 mx-auto" />
        <h2 className="text-xl font-bold text-white">No questions match the selected filters</h2>
        <p className="text-xs text-slate-400">Try switching filters to 'All Subjects' or 'All Difficulties'.</p>
        <button
          onClick={() => { setSelectedSubject('all'); setSelectedDifficulty('all'); setShowOnlyPYQ(false); }}
          className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Reset All Filters
        </button>
      </div>
    );
  }

  const isCurrentCorrect = selectedOption === currentQ.correctOptionId;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Page Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Adaptive Practice Engine
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Question Drill & Distractor Analysis
          </h1>
        </div>

        {/* Learning Mode vs Test Mode */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => { setPracticeMode('learning'); setIsAnswerRevealed(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              practiceMode === 'learning'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Learning Mode (Instant)
          </button>
          <button
            onClick={() => { setPracticeMode('test'); setIsAnswerRevealed(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
              practiceMode === 'test'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Mode (Submit First)
          </button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubject}
            onChange={(e) => { setSelectedSubject(e.target.value as any); setCurrentIndex(0); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="all">All Subjects</option>
            <option value="quantitative_aptitude">Quantitative Aptitude</option>
            <option value="reasoning">General Intelligence</option>
            <option value="english">English Language</option>
            <option value="general_awareness">General Awareness</option>
            <option value="computer_knowledge">Computer Knowledge</option>
          </select>

          <select
            value={selectedDifficulty}
            onChange={(e) => { setSelectedDifficulty(e.target.value as any); setCurrentIndex(0); }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="all">All Difficulties</option>
            <option value="easy">Easy (Foundational)</option>
            <option value="medium">Medium (Standard)</option>
            <option value="difficult">Difficult (Advanced)</option>
          </select>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 font-semibold px-2">
            <input
              type="checkbox"
              checked={showOnlyPYQ}
              onChange={(e) => { setShowOnlyPYQ(e.target.checked); setCurrentIndex(0); }}
              className="rounded bg-slate-900 border-slate-700 text-indigo-500 focus:ring-0"
            />
            <span>Only Verified PYQs</span>
          </label>
        </div>

        <div className="text-slate-400 font-medium">
          Question <strong className="text-white">{currentIndex + 1}</strong> of <strong className="text-white">{questions.length}</strong>
        </div>
      </div>

      {/* Main Question Card */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-indigo-500/30 space-y-6">
        
        {/* Question Metadata Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentQ.topicName}
            </span>
            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-lg border ${
              currentQ.difficulty === 'easy'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : currentQ.difficulty === 'medium'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}>
              {currentQ.difficulty}
            </span>
          </div>

          {currentQ.sourceType === 'verified_pyq' && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-500/10 px-2.5 py-0.5 rounded-lg border border-amber-500/20">
              <Award className="w-3.5 h-3.5" />
              <span>{currentQ.examShift || 'Verified SSC PYQ'}</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <div className="text-base sm:text-lg font-semibold text-white leading-relaxed whitespace-pre-line">
          {currentQ.questionText}
        </div>

        {/* Option Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {currentQ.options.map((opt) => {
            const isSelected = selectedOption === opt.id;
            const isCorrect = opt.isCorrect;

            let btnStyle = 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-600';
            if (isAnswerRevealed) {
              if (isCorrect) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300';
              } else if (isSelected && !isCorrect) {
                btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300';
              }
            } else if (isSelected) {
              btnStyle = 'bg-indigo-600/30 border-indigo-500 text-white';
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleSelectOption(opt.id)}
                className={`p-4 rounded-2xl text-left text-xs sm:text-sm font-medium transition border flex items-center justify-between ${btnStyle}`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-slate-800/80 font-bold flex items-center justify-center text-xs shrink-0">
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </div>
                {isAnswerRevealed && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                {isAnswerRevealed && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Test Mode Evaluation Button */}
        {practiceMode === 'test' && !isAnswerRevealed && (
          <button
            onClick={() => {
              if (selectedOption) {
                setIsAnswerRevealed(true);
                if (selectedOption !== currentQ.correctOptionId) {
                  CHSLStorageService.addMistake({
                    questionId: currentQ.id,
                    questionText: currentQ.questionText,
                    topicName: currentQ.topicName,
                    subjectId: currentQ.subjectId,
                    selectedOptionId: selectedOption,
                    correctOptionId: currentQ.correctOptionId,
                    explanation: currentQ.explanation.stepByStep.join(' '),
                    mistakeCategory: mistakeCategory
                  });
                }
              }
            }}
            disabled={!selectedOption}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-slate-950 font-bold text-xs transition"
          >
            Submit Answer for Evaluation
          </button>
        )}

        {/* Detailed Distractor Breakdown & Solution */}
        {isAnswerRevealed && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            {/* Auto-Mistake Saved Notification */}
            {!isCurrentCorrect && (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>Incorrect! Logged into your <strong>Smart Mistake Notebook</strong>.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Tag error type:</span>
                  <select
                    value={mistakeCategory}
                    onChange={(e) => setMistakeCategory(e.target.value as any)}
                    className="bg-slate-900 border border-rose-500/40 rounded-lg px-2 py-1 text-[11px] text-white"
                  >
                    <option value="concept_not_understood">Concept Not Understood</option>
                    <option value="formula_forgotten">Formula Forgotten</option>
                    <option value="calculation_error">Calculation Error</option>
                    <option value="question_misread">Question Misread</option>
                    <option value="guessing">Guessing</option>
                    <option value="time_pressure">Time Pressure</option>
                  </select>
                </div>
              </div>
            )}

            {/* Option Traps & Distractor Analysis */}
            <div className="glass-panel p-4 rounded-2xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Why Are Other Options Traps? (Distractor Analysis)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {currentQ.options.map(opt => (
                  <div key={opt.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="font-bold text-slate-200">Option {opt.id}: </span>
                    <span className="text-slate-400">{opt.distractorExplanation || (opt.isCorrect ? 'Correct Answer' : 'Distractor')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
              <strong className="text-indigo-400 block text-sm">Step-by-Step Solution:</strong>
              <div className="space-y-1 text-slate-300 leading-relaxed">
                {currentQ.explanation.stepByStep.map((s, idx) => (
                  <div key={idx}>{s}</div>
                ))}
              </div>
              {currentQ.explanation.shortcutOrTrick && (
                <div className="mt-2 pt-2 border-t border-slate-800 text-amber-300">
                  <Zap className="w-3 h-3 inline mr-1" />
                  <strong>Exam Shortcut:</strong> {currentQ.explanation.shortcutOrTrick}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Next/Prev Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-white text-xs font-semibold transition"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === questions.length - 1}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md"
          >
            Next Question →
          </button>
        </div>

      </div>
    </div>
  );
}
