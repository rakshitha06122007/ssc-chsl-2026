import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  AlertTriangle, 
  Zap, 
  Award, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp,
  Brain,
  Layers,
  GraduationCap
} from 'lucide-react';
import { ConceptLesson, Question } from '../types/chsl';
import { CONCEPT_LESSONS } from '../data/conceptLessons';
import { CHSLStorageService } from '../services/chslStorage';

interface ConceptLessonPageProps {
  initialTopicId?: string;
  onNavigateToPractice: (topicId: string) => void;
  onNavigateToRevision: () => void;
}

export function ConceptLessonPage({
  initialTopicId = 'quant_percentage_profit',
  onNavigateToPractice,
  onNavigateToRevision
}: ConceptLessonPageProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopicId);
  const [learningMode, setLearningMode] = useState<'from_zero' | 'quick_revision'>('from_zero');
  const [expandedExample, setExpandedExample] = useState<number | null>(0);
  const [quizResponses, setQuizResponses] = useState<Record<string, 'A' | 'B' | 'C' | 'D'>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [comprehensionStatus, setComprehensionStatus] = useState<'understood' | 'partially_understood' | 'difficult' | 'none'>(() => {
    return CHSLStorageService.getTopicProgress(initialTopicId).comprehensionStatus;
  });

  const availableTopics = Object.values(CONCEPT_LESSONS);
  const lesson: ConceptLesson = CONCEPT_LESSONS[selectedTopicId] || CONCEPT_LESSONS['quant_percentage_profit'];

  const handleSelectOption = (questionId: string, optionId: 'A' | 'B' | 'C' | 'D') => {
    if (quizSubmitted) return;
    setQuizResponses(prev => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // If student gets >= 1 question correct, record progress
    CHSLStorageService.saveTopicProgress({
      topicId: selectedTopicId,
      comprehensionStatus: comprehensionStatus !== 'none' ? comprehensionStatus : 'understood',
      lessonRead: true,
      practiceSolvedCount: Object.keys(quizResponses).length,
      lastStudiedAt: Date.now()
    });
  };

  const handleUpdateComprehension = (status: 'understood' | 'partially_understood' | 'difficult') => {
    setComprehensionStatus(status);
    CHSLStorageService.saveTopicProgress({
      topicId: selectedTopicId,
      comprehensionStatus: status,
      lessonRead: true,
      practiceSolvedCount: Object.keys(quizResponses).length,
      lastStudiedAt: Date.now()
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Topic Switcher & Mode Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            13-Stage Pedagogical System
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            {lesson.topicName}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Structured for SSC CHSL from absolute zero foundational understanding to high-speed exam tricks.
          </p>
        </div>

        {/* Learning Mode Switch: Explain from Zero vs Quick Revision */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setLearningMode('from_zero')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              learningMode === 'from_zero'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Explain From Zero
          </button>
          <button
            onClick={() => setLearningMode('quick_revision')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              learningMode === 'quick_revision'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Revise Quickly
          </button>
        </div>
      </div>

      {/* Select Topic Dropdown */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {availableTopics.map(t => (
          <button
            key={t.topicId}
            onClick={() => {
              setSelectedTopicId(t.topicId);
              setQuizSubmitted(false);
              setQuizResponses({});
              setComprehensionStatus(CHSLStorageService.getTopicProgress(t.topicId).comprehensionStatus);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
              selectedTopicId === t.topicId
                ? 'bg-indigo-600/30 border-indigo-500/50 text-white shadow-sm'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {t.topicName}
          </button>
        ))}
      </div>

      {/* Quick Revision Condensed Mode */}
      {learningMode === 'quick_revision' ? (
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-amber-500/30 space-y-6">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-white">Express Cheat Sheet & Formula Deck</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.importantFormulas.map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1">
                <span className="text-xs font-mono font-bold text-amber-300 block">{f.formula}</span>
                <p className="text-xs text-slate-400">{f.description}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
            <h3 className="text-sm font-bold text-indigo-300 mb-2">Short Revision Notes:</h3>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lesson.shortRevisionNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => onNavigateToPractice(lesson.topicId)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2"
            >
              Solve Topic Test Questions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Full 13-Part Pedagogical Framework */
        <div className="space-y-6">
          
          {/* Part 1: Prerequisites */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-[10px]">1</span>
              Prerequisites & Foundation Needed
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {lesson.prerequisites.map((req, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Part 2: Simple English Explanation */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">2</span>
              Concept Explained in Simple English
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              {lesson.simpleExplanation}
            </p>
          </div>

          {/* Part 3: Definitions and Rules */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
              Core Definitions & Exam Rules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.definitionsAndRules.map((rule, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                  <span className="text-emerald-400 font-bold mr-1.5">Rule #{idx + 1}:</span>
                  {rule}
                </div>
              ))}
            </div>
          </div>

          {/* Part 4: Important Formulas */}
          <div className="glass-panel rounded-2xl p-6 border border-indigo-500/20 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">4</span>
              High-Yield SSC Formulas & Identities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.importantFormulas.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="font-mono text-xs font-bold text-amber-300 bg-amber-500/10 px-2 py-1 rounded inline-block">
                    {f.formula}
                  </div>
                  <p className="text-xs text-slate-400">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Part 5: Step-by-Step Solved Examples */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-800 text-indigo-400 flex items-center justify-center text-[10px]">5</span>
              Step-by-Step Solved Examples
            </h2>
            <div className="space-y-3">
              {lesson.stepByStepExamples.map((ex, idx) => (
                <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/80 overflow-hidden">
                  <button
                    onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:bg-slate-800/50 transition"
                  >
                    <span>{ex.title}</span>
                    {expandedExample === idx ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {expandedExample === idx && (
                    <div className="p-4 pt-0 border-t border-slate-800/80 space-y-3 text-xs">
                      <div className="p-3 rounded-lg bg-slate-950 text-slate-200 font-medium">
                        <strong>Problem:</strong> {ex.problem}
                      </div>
                      <div className="space-y-1.5 pl-2 text-slate-300">
                        {ex.steps.map((st, sIdx) => (
                          <div key={sIdx} className="leading-relaxed">{st}</div>
                        ))}
                      </div>
                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/20 text-emerald-300 font-semibold">
                        {ex.answer}
                      </div>
                      {ex.shortcut && (
                        <div className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 text-amber-300">
                          <Zap className="w-3.5 h-3.5 inline mr-1" />
                          <strong>10-Second Shortcut:</strong> {ex.shortcut}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Part 6 & 7: Shortcuts & Traps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> 6. Shortcuts & Speed Tricks
              </h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {lesson.shortcutsAndTechniques.map((sc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{sc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800">
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" /> 7. Common Traps & Mistakes
              </h2>
              <ul className="space-y-2 text-xs text-slate-300">
                {lesson.commonTrapsAndMistakes.map((tr, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-rose-400 font-bold">•</span>
                    <span>{tr}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Part 11: Verified PYQ Spotlight */}
          {lesson.verifiedPYQs.length > 0 && (
            <div className="glass-panel rounded-2xl p-5 border border-indigo-500/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                    11. Verified Official PYQ Spotlight
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lesson.verifiedPYQs[0].examShift}
                </span>
              </div>
              <p className="text-xs text-slate-200 mb-3 font-medium">
                {lesson.verifiedPYQs[0].questionText}
              </p>
              <div className="text-[11px] text-slate-400 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <strong className="text-slate-200">Official Solution:</strong> {lesson.verifiedPYQs[0].explanation.mainConcept}
              </div>
            </div>
          )}

          {/* Part 12: Interactive Topic Test */}
          <div className="glass-panel-elevated rounded-2xl p-6 border border-indigo-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <h3 className="text-base font-bold text-white">12. Topic Comprehension Test</h3>
              </div>
              <span className="text-xs text-slate-400">Answer to complete this lesson</span>
            </div>

            <div className="space-y-4">
              {lesson.easyPracticeQuestions.map((q) => (
                <div key={q.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
                  <p className="text-xs sm:text-sm font-medium text-slate-200">{q.questionText}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map(opt => {
                      const isSelected = quizResponses[q.id] === opt.id;
                      const isCorrect = opt.isCorrect;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectOption(q.id, opt.id)}
                          className={`p-2.5 rounded-xl text-xs text-left font-medium transition border flex items-center justify-between ${
                            isSelected
                              ? quizSubmitted
                                ? isCorrect
                                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                  : 'bg-rose-500/20 border-rose-500 text-rose-300'
                                : 'bg-indigo-600/30 border-indigo-500 text-white'
                              : quizSubmitted && isCorrect
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          <span><b className="mr-1.5">{opt.id}.</b> {opt.text}</span>
                          {quizSubmitted && isSelected && (
                            isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 mt-2">
                      <strong className="text-indigo-400 block mb-1">Detailed Explanation:</strong>
                      {q.explanation.stepByStep.join(' ')}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {!quizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(quizResponses).length === 0}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold transition shadow-lg"
              >
                Submit Topic Test
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <span>Quiz evaluated! Your progress has been updated in your profile.</span>
                <button
                  onClick={() => onNavigateToPractice(lesson.topicId)}
                  className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold"
                >
                  More Practice
                </button>
              </div>
            )}
          </div>

          {/* Student Self-Assessment Marker */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Self-Assessment Rating
              </span>
              <p className="text-xs text-slate-300 mt-0.5">
                How confident do you feel about <strong className="text-white">{lesson.topicName}</strong>?
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdateComprehension('understood')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  comprehensionStatus === 'understood'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ✓ Understood
              </button>
              <button
                onClick={() => handleUpdateComprehension('partially_understood')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  comprehensionStatus === 'partially_understood'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Partially Clear
              </button>
              <button
                onClick={() => handleUpdateComprehension('difficult')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border ${
                  comprehensionStatus === 'difficult'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚠ Difficult
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
