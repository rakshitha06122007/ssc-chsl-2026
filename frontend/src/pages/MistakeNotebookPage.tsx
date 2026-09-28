import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Edit3, 
  Save, 
  Filter,
  Check,
  Calendar,
  Zap
} from 'lucide-react';
import { MistakeNotebookEntry, MistakeCategory } from '../types/chsl';
import { CHSLStorageService } from '../services/chslStorage';

interface MistakeNotebookPageProps {
  onNavigateToLessons: (topicId?: string) => void;
}

export function MistakeNotebookPage({ onNavigateToLessons }: MistakeNotebookPageProps) {
  const [mistakes, setMistakes] = useState<MistakeNotebookEntry[]>(CHSLStorageService.getMistakes());
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unresolved' | 'resolved'>('unresolved');
  const [selectedCategory, setSelectedCategory] = useState<MistakeCategory | 'all'>('all');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  
  // "Fix your mistakes" Drill State
  const [isDrillActive, setIsDrillActive] = useState<boolean>(false);
  const [drillIndex, setDrillIndex] = useState<number>(0);
  const [drillAnswer, setDrillAnswer] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [drillEvaluated, setDrillEvaluated] = useState<boolean>(false);

  const filteredMistakes = mistakes.filter(m => {
    if (selectedFilter === 'unresolved' && m.isResolved) return false;
    if (selectedFilter === 'resolved' && !m.isResolved) return false;
    if (selectedCategory !== 'all' && m.mistakeCategory !== selectedCategory) return false;
    return true;
  });

  const unresolvedCount = mistakes.filter(m => !m.isResolved).length;
  const resolvedCount = mistakes.filter(m => m.isResolved).length;

  const handleSaveNote = (mistakeId: string) => {
    CHSLStorageService.updateMistakeNotes(mistakeId, noteText);
    setMistakes(CHSLStorageService.getMistakes());
    setEditingNoteId(null);
  };

  const handleStartDrill = () => {
    if (filteredMistakes.length === 0) return;
    setIsDrillActive(true);
    setDrillIndex(0);
    setDrillAnswer(null);
    setDrillEvaluated(false);
  };

  const handleResolveInDrill = (mistakeId: string) => {
    CHSLStorageService.resolveMistake(mistakeId);
    setMistakes(CHSLStorageService.getMistakes());
    setDrillEvaluated(true);
  };

  const currentDrillItem = filteredMistakes[drillIndex];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            Automated Error Diagnostics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Smart Mistake Notebook
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Every incorrect attempt in tests and practice is recorded here with category classification and follow-up drills.
          </p>
        </div>

        {unresolvedCount > 0 && !isDrillActive && (
          <button
            onClick={handleStartDrill}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 transition active:scale-95 flex items-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Zap className="w-4 h-4 fill-white" />
            Launch "Fix Your Mistakes" Drill ({unresolvedCount})
          </button>
        )}
      </div>

      {/* Stats and Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedFilter('unresolved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedFilter === 'unresolved'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Unresolved ({unresolvedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('resolved')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedFilter === 'resolved'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({resolvedCount})
          </button>
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition ${
              selectedFilter === 'all'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({mistakes.length})
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1.5 text-white font-medium focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="concept_not_understood">Concept Not Understood</option>
            <option value="formula_forgotten">Formula Forgotten</option>
            <option value="calculation_error">Calculation Error</option>
            <option value="question_misread">Question Misread</option>
            <option value="guessing">Guessing</option>
            <option value="time_pressure">Time Pressure</option>
          </select>
        </div>
      </div>

      {/* Drill Mode View */}
      {isDrillActive && currentDrillItem ? (
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-rose-500/30 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <span className="text-xs font-bold text-rose-400 uppercase">
              Fix Your Mistake Drill • Question {drillIndex + 1} of {filteredMistakes.length}
            </span>
            <button
              onClick={() => setIsDrillActive(false)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Exit Drill
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-xs text-indigo-400 font-bold">{currentDrillItem.topicName}</span>
            <p className="text-base font-semibold text-white">{currentDrillItem.questionText}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
            <span className="text-slate-400 block mb-1">Your Previous Mistake:</span>
            You selected <strong className="text-rose-400">Option {currentDrillItem.selectedOptionId}</strong>. The correct answer is <strong className="text-emerald-400">Option {currentDrillItem.correctOptionId}</strong>.
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-slate-200 leading-relaxed">
            <strong className="text-indigo-300 block mb-1">Concept Solution:</strong>
            {currentDrillItem.explanation}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={() => handleResolveInDrill(currentDrillItem.id)}
              disabled={drillEvaluated}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              {drillEvaluated ? 'Marked Resolved!' : 'I Understand This Now (Mark Resolved)'}
            </button>

            <button
              onClick={() => {
                if (drillIndex < filteredMistakes.length - 1) {
                  setDrillIndex(prev => prev + 1);
                  setDrillEvaluated(false);
                } else {
                  setIsDrillActive(false);
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Next Question →
            </button>
          </div>
        </div>
      ) : (
        /* Mistake Cards List */
        <div className="space-y-4">
          {filteredMistakes.length === 0 ? (
            <div className="glass-panel rounded-3xl p-12 text-center max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">No mistakes in this queue!</h3>
              <p className="text-xs text-slate-400">
                Any questions answered incorrectly during practice or mock tests will automatically appear here.
              </p>
            </div>
          ) : (
            filteredMistakes.map(m => (
              <div 
                key={m.id}
                className={`glass-panel rounded-2xl p-5 border transition ${
                  m.isResolved ? 'border-emerald-500/30 bg-emerald-950/5' : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300">
                      {m.topicName}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">
                      {m.mistakeCategory.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {new Date(m.attemptedAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm font-semibold text-white mb-3">
                  {m.questionText}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300">
                    <span className="text-slate-400 block text-[10px]">Your Answer:</span>
                    <strong>Option {m.selectedOptionId} (Incorrect)</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
                    <span className="text-slate-400 block text-[10px]">Correct Answer:</span>
                    <strong>Option {m.correctOptionId}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mb-3">
                  <strong className="text-indigo-300 block mb-1">Detailed Explanation:</strong>
                  {m.explanation}
                </div>

                {/* Student Personal Notes */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  {editingNoteId === m.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        placeholder="Add your personal memory reminder..."
                        className="flex-1 bg-slate-900 border border-indigo-500/40 rounded-lg px-2.5 py-1 text-white text-xs focus:outline-none"
                      />
                      <button
                        onClick={() => handleSaveNote(m.id)}
                        className="px-2.5 py-1 bg-indigo-600 rounded-lg text-white font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs flex items-center gap-1.5">
                      <span>Note: <em className="text-slate-200">{m.studentNotes || 'No custom note added'}</em></span>
                      <button
                        onClick={() => { setEditingNoteId(m.id); setNoteText(m.studentNotes || ''); }}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {!m.isResolved && (
                    <button
                      onClick={() => {
                        CHSLStorageService.resolveMistake(m.id);
                        setMistakes(CHSLStorageService.getMistakes());
                      }}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 text-xs font-semibold self-start sm:self-auto"
                    >
                      ✓ Mark Resolved
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
