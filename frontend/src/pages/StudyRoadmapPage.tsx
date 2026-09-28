import React, { useState } from 'react';
import { 
  GraduationCap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  RotateCcw, 
  Save, 
  Layers,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { PersonalizedStudyPlan, StudyPlanDay, SubjectId } from '../types/chsl';
import { CHSLStorageService } from '../services/chslStorage';

export function StudyRoadmapPage() {
  const [existingPlan, setExistingPlan] = useState<PersonalizedStudyPlan | null>(() => {
    return CHSLStorageService.getStudyPlan();
  });

  // Wizard state
  const [durationDays, setDurationDays] = useState<30 | 45 | 60 | 90>(60);
  const [prepLevel, setPrepLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [dailyHours, setDailyHours] = useState<number>(3);
  const [strongSubjects, setStrongSubjects] = useState<SubjectId[]>(['reasoning']);
  const [weakSubjects, setWeakSubjects] = useState<SubjectId[]>(['quantitative_aptitude', 'english']);
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Hinglish'>('English');
  const [activeDayView, setActiveDayView] = useState<number>(0);

  const generateNewPlan = () => {
    const days: StudyPlanDay[] = [];
    const subjectsCycle: SubjectId[] = ['quantitative_aptitude', 'reasoning', 'english', 'general_awareness'];

    for (let i = 1; i <= durationDays; i++) {
      const isBuffer = i % 7 === 0; // Every 7th day is a dedicated Buffer Day
      const isMockDay = i % 10 === 0;

      if (isBuffer) {
        days.push({
          dayNumber: i,
          isBufferDay: true,
          isCompleted: false,
          tasks: [
            {
              id: `task_${i}_buffer_1`,
              title: 'Graceful Catch-up on Unfinished Practice Drills',
              type: 'buffer',
              estimatedMinutes: 60,
              isCompleted: false,
              priority: 'high'
            },
            {
              id: `task_${i}_buffer_2`,
              title: 'Review Unresolved Questions in Mistake Notebook',
              type: 'buffer',
              estimatedMinutes: 45,
              isCompleted: false,
              priority: 'medium'
            }
          ]
        });
      } else if (isMockDay) {
        days.push({
          dayNumber: i,
          isBufferDay: false,
          isCompleted: false,
          tasks: [
            {
              id: `task_${i}_mock_1`,
              title: 'Full-Length Tier 1 CBE Mock Test (60 Mins Simulation)',
              type: 'mock_test',
              estimatedMinutes: 60,
              isCompleted: false,
              priority: 'high'
            },
            {
              id: `task_${i}_mock_2`,
              title: 'Detailed Forensic Review of All Incorrect Questions',
              type: 'revision',
              estimatedMinutes: 45,
              isCompleted: false,
              priority: 'high'
            }
          ]
        });
      } else {
        const subj = subjectsCycle[(i - 1) % subjectsCycle.length];
        days.push({
          dayNumber: i,
          isBufferDay: false,
          isCompleted: false,
          tasks: [
            {
              id: `task_${i}_1`,
              title: `Concept Lesson & 10-Second Shortcuts in ${subj.replace('_', ' ').toUpperCase()}`,
              type: 'concept',
              subjectId: subj,
              estimatedMinutes: 45,
              isCompleted: false,
              priority: 'high'
            },
            {
              id: `task_${i}_2`,
              title: `Solve 20 Verified TCS PYQs in ${subj.replace('_', ' ').toUpperCase()}`,
              type: 'practice',
              subjectId: subj,
              estimatedMinutes: 40,
              isCompleted: false,
              priority: 'high'
            },
            {
              id: `task_${i}_3`,
              title: 'Spaced Formula & High-Yield Vocab Deck Flashcards',
              type: 'revision',
              estimatedMinutes: 20,
              isCompleted: false,
              priority: 'medium'
            }
          ]
        });
      }
    }

    const newPlan: PersonalizedStudyPlan = {
      id: 'plan_' + Date.now(),
      studentName: 'Aspirant',
      targetExam: 'SSC CHSL 2026',
      durationDays,
      level: prepLevel,
      dailyHours,
      strongSubjects,
      weakSubjects,
      preferredLanguage,
      createdAt: Date.now(),
      days
    };

    CHSLStorageService.saveStudyPlan(newPlan);
    setExistingPlan(newPlan);
    setActiveDayView(0);
  };

  const handleToggleTask = (dayIdx: number, taskId: string) => {
    const updated = CHSLStorageService.togglePlanTask(dayIdx, taskId);
    if (updated) setExistingPlan({ ...updated });
  };

  const currentDay = existingPlan?.days[activeDayView] || existingPlan?.days[0];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Personalized Study Roadmap Planner
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            SSC CHSL 2026 Daily & Weekly Study Plan
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Auto-adjusts for missed days without overloading. Includes structured buffer days and spaced mocks.
          </p>
        </div>

        {existingPlan && (
          <button
            onClick={() => setExistingPlan(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reconfigure Roadmap
          </button>
        )}
      </div>

      {/* Plan Configuration Wizard if No Plan or Reconfiguring */}
      {!existingPlan ? (
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-indigo-500/30 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Configure Your Target Roadmap
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* Target Duration */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold block">Target Preparation Duration:</label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map(d => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDurationDays(d as any)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      durationDays === d
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {d} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Preparation Level */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold block">Current Preparation Level:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'beginner', label: 'Beginner (Zero)' },
                  { id: 'intermediate', label: 'Intermediate' },
                  { id: 'advanced', label: 'Exam Ready' }
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setPrepLevel(l.id as any)}
                    className={`py-2 px-1 text-center rounded-xl font-bold border transition ${
                      prepLevel === l.id
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Study Time */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold block">Daily Available Study Commitment:</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={dailyHours}
                  onChange={(e) => setDailyHours(parseInt(e.target.value))}
                  className="flex-1 accent-indigo-500"
                />
                <span className="font-mono text-base font-bold text-amber-400 min-w-[60px] text-right">
                  {dailyHours} Hours / Day
                </span>
              </div>
            </div>

            {/* Preferred Language */}
            <div className="space-y-2">
              <label className="text-slate-300 font-bold block">Explanation Language:</label>
              <div className="grid grid-cols-2 gap-2">
                {['English', 'Hinglish'].map(lang => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPreferredLanguage(lang as any)}
                    className={`py-2 rounded-xl font-bold border transition ${
                      preferredLanguage === lang
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={generateNewPlan}
              className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition flex items-center gap-2"
            >
              Generate Scientific Plan <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Active Plan View */
        <div className="space-y-6">
          
          {/* Day Selector Ribbon */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {existingPlan.days.map((d, idx) => (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDayView(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition border flex flex-col items-center min-w-[70px] ${
                  activeDayView === idx
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                    : d.isBufferDay
                      ? 'bg-amber-950/30 border-amber-500/30 text-amber-300'
                      : d.isCompleted
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>Day {d.dayNumber}</span>
                <span className="text-[10px] font-normal opacity-80">
                  {d.isBufferDay ? 'Buffer' : d.isCompleted ? '✓ Done' : `${d.tasks.length} tasks`}
                </span>
              </button>
            ))}
          </div>

          {/* Current Day Task Breakdown Card */}
          {currentDay && (
            <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-indigo-500/30 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-indigo-400">
                      Day {currentDay.dayNumber} Schedule
                    </span>
                    {currentDay.isBufferDay && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Buffer Day (Uncluttered Recovery)
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {currentDay.isBufferDay 
                      ? 'Catch-up & Notebook Review Day' 
                      : `Day ${currentDay.dayNumber}: Concepts, Practice & Revision`}
                  </h2>
                </div>

                <span className="text-xs text-slate-400 font-mono">
                  Target Study: <strong className="text-amber-400">{existingPlan.dailyHours} hrs</strong>
                </span>
              </div>

              {/* Task Checklist */}
              <div className="space-y-3">
                {currentDay.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleTask(activeDayView, task.id)}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      task.isCompleted
                        ? 'bg-slate-900/40 border-emerald-500/30 opacity-75'
                        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition border ${
                        task.isCompleted
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-700 bg-slate-800'
                      }`}>
                        {task.isCompleted && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                            {task.type}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {task.estimatedMinutes} mins
                          </span>
                        </div>
                        <h4 className={`text-sm font-semibold mt-0.5 ${
                          task.isCompleted ? 'line-through text-slate-500' : 'text-white'
                        }`}>
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    <span className="text-xs text-indigo-400 font-medium shrink-0">
                      {task.isCompleted ? 'Completed' : 'Click to Mark Done'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed">
                💡 <strong>Adaptive Cushion Principle:</strong> If you miss a task or day, it is automatically absorbed into Day 7 / Day 14 buffer slots without overloading tomorrow's schedule.
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
