import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  RotateCcw, 
  Maximize2, 
  Send,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { ExamTier, Question, MockTestConfig, TestAttemptResult } from '../types/chsl';
import { QUESTION_BANK } from '../data/questionBank';
import { TestPerformanceAnalyser } from '../components/TestPerformanceAnalyser';
import { CHSLStorageService } from '../services/chslStorage';

interface MockTestLabPageProps {
  activeTier: ExamTier;
  onNavigateToLessons: (topicId?: string) => void;
  onNavigateToRevision: () => void;
}

export function MockTestLabPage({
  activeTier,
  onNavigateToLessons,
  onNavigateToRevision
}: MockTestLabPageProps) {
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestAttemptResult | null>(null);

  // Active Test State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(60 * 60);
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);

  // Define Tests for Tier 1 and Tier 2
  const mockConfigs: MockTestConfig[] = [
    {
      id: 'tier1_full_mock_01',
      title: 'SSC CHSL 2026 Tier 1 Official Pattern Full Mock 1',
      tier: 'tier1',
      type: 'full_length',
      durationMinutes: 60,
      totalMarks: 200,
      markingScheme: { correct: 2, incorrect: 0.50 },
      sections: [
        { subjectId: 'quantitative_aptitude', title: 'Quantitative Aptitude', questionCount: 25, totalMarks: 50 },
        { subjectId: 'reasoning', title: 'General Intelligence', questionCount: 25, totalMarks: 50 },
        { subjectId: 'english', title: 'English Language', questionCount: 25, totalMarks: 50 },
        { subjectId: 'general_awareness', title: 'General Awareness', questionCount: 25, totalMarks: 50 }
      ],
      questions: QUESTION_BANK.filter(q => q.tier === 'tier1' || q.tier === 'both'),
      description: 'Official 100-Question CBE simulation with exact TCS interface, 60-min timer, +2 / -0.50 negative marking.',
      isOfficialPattern: true
    },
    {
      id: 'tier2_mains_mock_01',
      title: 'SSC CHSL 2026 Tier 2 Mains CBE Mock (Session I)',
      tier: 'tier2',
      type: 'full_length',
      durationMinutes: 135,
      totalMarks: 360,
      markingScheme: { correct: 3, incorrect: 1.0 },
      sections: [
        { subjectId: 'quantitative_aptitude', title: 'Mathematical Abilities', questionCount: 30, totalMarks: 90 },
        { subjectId: 'reasoning', title: 'Reasoning & Intelligence', questionCount: 30, totalMarks: 90 },
        { subjectId: 'english', title: 'English & Comprehension', questionCount: 40, totalMarks: 120 },
        { subjectId: 'general_awareness', title: 'General Awareness', questionCount: 20, totalMarks: 60 },
        { subjectId: 'computer_knowledge', title: 'Computer Knowledge Module', questionCount: 15, totalMarks: 45 }
      ],
      questions: QUESTION_BANK.filter(q => q.tier === 'tier2' || q.tier === 'both'),
      description: 'Tier 2 Session I exam simulator. Section I & II +3 / -1 marks, and mandatory qualifying Computer Module.',
      isOfficialPattern: true
    }
  ];

  const currentConfig = mockConfigs.find(m => m.id === selectedTestId) || mockConfigs[0];
  const testQuestions = currentConfig.questions;
  const currentQ = testQuestions[currentQuestionIndex] || testQuestions[0];

  // Timer Hook
  useEffect(() => {
    let interval: any = null;
    if (isTestActive && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds(prev => prev - 1);
        if (currentQ) {
          setQuestionTimeSpent(prev => ({
            ...prev,
            [currentQ.id]: (prev[currentQ.id] || 0) + 1
          }));
        }
      }, 1000);
    } else if (isTestActive && timeLeftSeconds === 0) {
      handleSubmitTest();
    }
    return () => clearInterval(interval);
  }, [isTestActive, timeLeftSeconds, currentQ]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!isTestActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['1', '2', '3', '4'].includes(e.key)) {
        const optionMap: Record<string, 'A' | 'B' | 'C' | 'D'> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
        handleSelectOption(optionMap[e.key]);
      } else if (e.key.toLowerCase() === 'n' || e.key === 'ArrowRight') {
        handleSaveAndNext();
      } else if (e.key.toLowerCase() === 'p' || e.key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
      } else if (e.key.toLowerCase() === 'm') {
        handleMarkForReview();
      } else if (e.key.toLowerCase() === 'c') {
        handleClearResponse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTestActive, currentQuestionIndex, currentQ]);

  const handleStartTest = (configId: string) => {
    setSelectedTestId(configId);
    const cfg = mockConfigs.find(m => m.id === configId) || mockConfigs[0];
    setTimeLeftSeconds(cfg.durationMinutes * 60);
    setUserAnswers({});
    setMarkedForReview({});
    setQuestionTimeSpent({});
    setCurrentQuestionIndex(0);
    setIsTestActive(true);
    setTestResult(null);
  };

  const handleSelectOption = (optId: 'A' | 'B' | 'C' | 'D') => {
    if (!currentQ) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.id]: optId }));
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setUserAnswers(prev => {
      const copy = { ...prev };
      delete copy[currentQ.id];
      return copy;
    });
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleSubmitTest = () => {
    setIsTestActive(false);
    setShowSubmitModal(false);

    // Calculate real score and analytics
    let correctCount = 0;
    let incorrectCount = 0;
    let attemptedCount = 0;
    const userResponses: TestAttemptResult['userResponses'] = {};
    const subjectBreakdown: TestAttemptResult['subjectBreakdown'] = {
      quantitative_aptitude: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0, accuracy: 0 },
      reasoning: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0, accuracy: 0 },
      english: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0, accuracy: 0 },
      general_awareness: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0, accuracy: 0 },
      computer_knowledge: { total: 0, attempted: 0, correct: 0, incorrect: 0, marks: 0, accuracy: 0 }
    };

    const timeSinkQuestions: string[] = [];

    testQuestions.forEach(q => {
      const selected = userAnswers[q.id] || null;
      const isAttempted = selected !== null;
      const isCorrect = selected === q.correctOptionId;
      const timeSpent = questionTimeSpent[q.id] || 0;

      if (timeSpent > 120) {
        timeSinkQuestions.push(q.id);
      }

      userResponses[q.id] = {
        selectedOptionId: selected,
        timeSpentSeconds: timeSpent,
        isCorrect,
        markedForReview: !!markedForReview[q.id]
      };

      if (subjectBreakdown[q.subjectId]) {
        subjectBreakdown[q.subjectId].total += 1;
        if (isAttempted) {
          subjectBreakdown[q.subjectId].attempted += 1;
          if (isCorrect) {
            subjectBreakdown[q.subjectId].correct += 1;
            subjectBreakdown[q.subjectId].marks += currentConfig.markingScheme.correct;
          } else {
            subjectBreakdown[q.subjectId].incorrect += 1;
            subjectBreakdown[q.subjectId].marks -= currentConfig.markingScheme.incorrect;
          }
        }
      }

      if (isAttempted) {
        attemptedCount += 1;
        if (isCorrect) correctCount += 1;
        else {
          incorrectCount += 1;
          // Auto add to Mistake Notebook
          CHSLStorageService.addMistake({
            questionId: q.id,
            questionText: q.questionText,
            topicName: q.topicName,
            subjectId: q.subjectId,
            selectedOptionId: selected,
            correctOptionId: q.correctOptionId,
            explanation: q.explanation.stepByStep.join(' '),
            mistakeCategory: 'concept_not_understood'
          });
        }
      }
    });

    Object.keys(subjectBreakdown).forEach(s => {
      const sb = subjectBreakdown[s as any];
      if (sb && sb.attempted > 0) {
        sb.accuracy = (sb.correct / sb.attempted) * 100;
      }
    });

    const totalMarksScored = Math.max(0, (correctCount * currentConfig.markingScheme.correct) - (incorrectCount * currentConfig.markingScheme.incorrect));
    const accuracyPercentage = attemptedCount > 0 ? (correctCount / attemptedCount) * 100 : 0;
    const totalTimeSpent = (currentConfig.durationMinutes * 60) - timeLeftSeconds;

    const resultObj: TestAttemptResult = {
      attemptId: 'att_' + Date.now(),
      testId: currentConfig.id,
      testTitle: currentConfig.title,
      tier: currentConfig.tier,
      timestamp: Date.now(),
      timeSpentSeconds: totalTimeSpent,
      totalQuestions: testQuestions.length,
      attemptedCount,
      correctCount,
      incorrectCount,
      unattemptedCount: testQuestions.length - attemptedCount,
      accuracyPercentage,
      totalMarksScored,
      maxMarks: currentConfig.totalMarks,
      subjectBreakdown,
      topicAccuracy: {},
      userResponses,
      timeSinkQuestions,
      patternDiagnosis: {
        speedVsAccuracyNote: `${accuracyPercentage.toFixed(1)}% accuracy across ${attemptedCount} attempts.`,
        weakestTopic: 'Quantitative Aptitude & Time-Sink Questions',
        actionableAdvice: ['Review your incorrect attempts in the Mistake Notebook.']
      }
    };

    CHSLStorageService.saveTestResult(resultObj);
    setTestResult(resultObj);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // If viewing test performance result
  if (testResult) {
    return (
      <TestPerformanceAnalyser
        result={testResult}
        allQuestions={testQuestions}
        onReviewQuestion={(qId) => {
          const idx = testQuestions.findIndex(q => q.id === qId);
          if (idx !== -1) setCurrentQuestionIndex(idx);
        }}
        onRetakeTest={() => handleStartTest(testResult.testId)}
        onNavigateToLessons={onNavigateToLessons}
        onNavigateToRevision={onNavigateToRevision}
      />
    );
  }

  // If Test is NOT running -> Show Test Selection Dashboard
  if (!isTestActive) {
    return (
      <div className="space-y-8 max-w-6xl mx-auto pb-16">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            TCS Computer Based Exam Simulator
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            SSC CHSL 2026 Mock Test Lab
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Experience the exact countdown timer, official question palette, section navigation, and marking scheme.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mockConfigs.map(test => (
            <div 
              key={test.id}
              className="glass-panel-elevated rounded-3xl p-6 sm:p-7 border border-indigo-500/30 flex flex-col justify-between space-y-4 hover:border-indigo-400/50 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                    {test.tier.toUpperCase()} Official Pattern
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> {test.durationMinutes} Mins
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{test.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{test.description}</p>

                <div className="grid grid-cols-3 gap-2 text-center text-xs py-3 border-y border-slate-800">
                  <div className="bg-slate-900/60 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Total Qs</span>
                    <strong className="text-white text-sm">{test.questions.length} Qs</strong>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Max Marks</span>
                    <strong className="text-amber-400 text-sm">{test.totalMarks}</strong>
                  </div>
                  <div className="bg-slate-900/60 p-2 rounded-xl">
                    <span className="text-slate-400 block text-[10px]">Marking</span>
                    <strong className="text-rose-400 text-sm">+{test.markingScheme.correct} / -{test.markingScheme.incorrect}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(test.id)}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/25 transition active:scale-95 flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4" /> Start Official Mock Examination
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ================= ACTIVE EXAM CBE SIMULATOR =================
  const answeredCount = Object.keys(userAnswers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const notAnsweredCount = testQuestions.length - answeredCount;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col -m-4 sm:-m-6 lg:-m-8">
      
      {/* Top CBE Bar */}
      <div className="bg-[#0b0f19] border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-300 block truncate max-w-xs sm:max-w-md">
            {currentConfig.title}
          </span>
          <span className="text-[11px] text-slate-400">Section: <strong>{currentQ?.subjectId.replace('_', ' ').toUpperCase()}</strong></span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-sm font-bold text-amber-400">
            <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Time Left: {formatTimer(timeLeftSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Main Examination Grid: Question Window + Right Palette */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Question Pane */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-800">
            <span className="font-bold text-indigo-400">
              Question {currentQuestionIndex + 1} of {testQuestions.length}
            </span>
            <span className="text-slate-400">
              Marks: <strong className="text-emerald-400">+{currentConfig.markingScheme.correct}</strong>, Negative: <strong className="text-rose-400">-{currentConfig.markingScheme.incorrect}</strong>
            </span>
          </div>

          <div className="text-base sm:text-lg font-medium text-slate-100 leading-relaxed whitespace-pre-line">
            {currentQ.questionText}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = userAnswers[currentQ.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`w-full p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition border flex items-center gap-3 ${
                    isSelected
                      ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <span className={`w-7 h-7 rounded-lg font-bold flex items-center justify-center text-xs shrink-0 ${
                    isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {opt.id}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Action Bar: Save & Next, Mark for Review, Clear Response */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkForReview}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                  markedForReview[currentQ.id]
                    ? 'bg-violet-600/30 border-violet-500 text-violet-300'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                {markedForReview[currentQ.id] ? 'Marked for Review' : 'Mark for Review'}
              </button>
              <button
                onClick={handleClearResponse}
                className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs font-semibold transition"
              >
                Clear Response
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1); }}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 disabled:opacity-30 text-white text-xs font-semibold transition"
              >
                Previous
              </button>
              <button
                onClick={handleSaveAndNext}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-lg"
              >
                Save & Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Official Question Palette */}
        <div className="w-full lg:w-80 bg-[#090d16] border-t lg:border-t-0 lg:border-l border-slate-800 p-4 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Official Question Palette
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 mb-4 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Answered ({answeredCount})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500" /> Not Answered ({notAnsweredCount})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-violet-500" /> Marked for Review ({markedCount})
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-700" /> Not Visited
              </div>
            </div>

            {/* Palette Buttons */}
            <div className="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto pr-1">
              {testQuestions.map((q, idx) => {
                const isSelected = userAnswers[q.id] !== undefined;
                const isMarked = markedForReview[q.id];
                const isCurrent = idx === currentQuestionIndex;

                let colorStyle = 'bg-slate-800 text-slate-400 border-slate-700';
                if (isSelected && isMarked) colorStyle = 'bg-violet-600 text-white border-violet-400';
                else if (isSelected) colorStyle = 'bg-emerald-600 text-white border-emerald-400';
                else if (isMarked) colorStyle = 'bg-violet-800 text-violet-200 border-violet-600';
                else if (idx <= currentQuestionIndex) colorStyle = 'bg-rose-700/80 text-white border-rose-600';

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-9 rounded-xl text-xs font-bold flex items-center justify-center transition border ${colorStyle} ${
                      isCurrent ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-slate-900' : ''
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={() => setShowSubmitModal(true)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg"
            >
              Submit Full Test
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal Before Submission */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-white">Confirm Mock Test Submission</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to conclude the examination? You will not be able to change your responses after submitting.
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 bg-slate-900 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-400 block text-[10px]">Attempted</span>
                <strong className="text-emerald-400 text-base">{answeredCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Marked</span>
                <strong className="text-violet-400 text-base">{markedCount}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Unanswered</span>
                <strong className="text-rose-400 text-base">{notAnsweredCount}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Return to Test
              </button>
              <button
                onClick={handleSubmitTest}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg"
              >
                Yes, Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
