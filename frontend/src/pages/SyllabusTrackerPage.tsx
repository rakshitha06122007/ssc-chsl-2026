import React, { useState } from 'react';
import { 
  Layers, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  BookOpen, 
  ArrowRight, 
  Filter, 
  Search,
  Sparkles,
  Award
} from 'lucide-react';
import { ExamTier, SubjectId, SyllabusTopic } from '../types/chsl';
import { CHSL_SYLLABUS_TOPICS, CHSL_TIER1_STRUCTURE, CHSL_TIER2_STRUCTURE } from '../data/chslSyllabusData';
import { CHSLStorageService } from '../services/chslStorage';

interface SyllabusTrackerPageProps {
  activeTier: ExamTier;
  onSelectTier: (tier: ExamTier) => void;
  onNavigateToLesson: (topicId: string) => void;
  onNavigateToPractice: (topicId: string) => void;
}

export function SyllabusTrackerPage({
  activeTier,
  onSelectTier,
  onNavigateToLesson,
  onNavigateToPractice
}: SyllabusTrackerPageProps) {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'in_progress' | 'not_started' | 'needs_revision'>('all');
  
  const allTopicProgress = CHSLStorageService.getAllTopicProgress();

  // Filter topics by active tier:
  // Tier 1 shows Quantitative Aptitude, General Intelligence, English, General Awareness
  // Tier 2 shows all above + Computer Knowledge (Tier 2 specific)
  const filteredTopics = CHSL_SYLLABUS_TOPICS.filter(t => {
    if (activeTier === 'tier1' && t.tier === 'tier2') return false;
    if (selectedSubject !== 'all' && t.subjectId !== selectedSubject) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchDesc = t.description.toLowerCase().includes(q);
      const matchSub = t.subtopics.some(s => s.name.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchSub) return false;
    }
    return true;
  });

  const subjectsList: Array<{ id: SubjectId | 'all'; label: string }> = [
    { id: 'all', label: 'All Subjects' },
    { id: 'quantitative_aptitude', label: 'Quantitative Aptitude' },
    { id: 'reasoning', label: 'General Intelligence' },
    { id: 'english', label: 'English Language' },
    { id: 'general_awareness', label: 'General Awareness' },
    ...(activeTier === 'tier2' ? [{ id: 'computer_knowledge' as SubjectId, label: 'Computer Knowledge (Tier 2)' }] : [])
  ];

  // Calculate statistics
  const totalSubtopics = filteredTopics.reduce((acc, t) => acc + t.subtopics.length, 0);
  const completedSubtopics = filteredTopics.reduce((acc, t) => 
    acc + t.subtopics.filter(s => s.status === 'completed').length, 0
  );
  const inProgressSubtopics = filteredTopics.reduce((acc, t) => 
    acc + t.subtopics.filter(s => s.status === 'in_progress').length, 0
  );
  const needsRevisionSubtopics = filteredTopics.reduce((acc, t) => 
    acc + t.subtopics.filter(s => s.status === 'needs_revision').length, 0
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Official Notification Curriculum
            </span>
            <span className="text-xs text-slate-400">
              Updated for SSC CHSL 2026
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {activeTier.toUpperCase()} Official Syllabus Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Independent syllabus tracking for {activeTier === 'tier1' ? 'Tier 1 CBE Examination' : 'Tier 2 Mains Examination & Computer Module'}. Progress reflects active problem solving, not merely viewing.
          </p>
        </div>

        {/* Tier Selector */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl shrink-0 self-start md:self-auto">
          <button
            onClick={() => onSelectTier('tier1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTier === 'tier1'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier 1 Tracker
          </button>
          <button
            onClick={() => onSelectTier('tier2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTier === 'tier2'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tier 2 Tracker
          </button>
        </div>
      </div>

      {/* Official Exam Pattern Summary Callout */}
      <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
          Official Marking & Structure: {activeTier === 'tier1' ? CHSL_TIER1_STRUCTURE.examName : CHSL_TIER2_STRUCTURE.examName}
        </div>
        {activeTier === 'tier1' ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Total Questions:</span>
              <strong className="text-white text-sm">100 Questions (25 / Section)</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Total Marks:</span>
              <strong className="text-white text-sm">200 Marks (+2 per correct)</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Negative Marking:</span>
              <strong className="text-rose-400 text-sm">-0.50 marks per wrong</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Duration:</span>
              <strong className="text-emerald-400 text-sm">60 Minutes</strong>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Session I (Section I & II):</span>
              <strong className="text-white text-sm">120 Qs / 360 Marks (+3, -1)</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Section III (Computer):</span>
              <strong className="text-amber-400 text-sm">15 Qs / 45 Marks (Qualifying)</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Session II (Typing Test):</span>
              <strong className="text-emerald-400 text-sm">35 WPM Eng / 30 WPM Hindi</strong>
            </div>
            <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <span className="text-slate-400 block">Negative Marking:</span>
              <strong className="text-rose-400 text-sm">-1.00 marks in Sec I & II</strong>
            </div>
          </div>
        )}
      </div>

      {/* Progress Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Subtopics Tracked</span>
          <span className="text-2xl font-black text-white font-mono">{totalSubtopics}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Completed</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">{completedSubtopics}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">In Progress</span>
          <span className="text-2xl font-black text-amber-400 font-mono">{inProgressSubtopics}</span>
        </div>
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <span className="text-xs text-slate-400 block">Needing Revision</span>
          <span className="text-2xl font-black text-rose-400 font-mono">{needsRevisionSubtopics}</span>
        </div>
      </div>

      {/* Subject Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
          {subjectsList.map(subj => (
            <button
              key={subj.id}
              onClick={() => setSelectedSubject(subj.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedSubject === subj.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {subj.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search subtopic or rule..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Syllabus Topics Accordion / Grid */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const userProg = allTopicProgress[topic.id];
          const comprehension = userProg?.comprehensionStatus || 'none';

          return (
            <div key={topic.id} className="glass-panel rounded-2xl p-5 border border-slate-800 hover:border-slate-700 transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-lg border border-indigo-500/20">
                      {topic.subjectName}
                    </span>
                    <span className="text-xs text-slate-400">
                      {topic.weightageDescription}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {topic.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {topic.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigateToLesson(topic.id)}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Concept Lesson
                  </button>
                  <button
                    onClick={() => onNavigateToPractice(topic.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    Practise Questions
                  </button>
                </div>
              </div>

              {/* Subtopic Checklist */}
              <div className="pt-3 border-t border-slate-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                  Official Subtopics & Weightage
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {topic.subtopics.map(sub => (
                    <div 
                      key={sub.id} 
                      className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {sub.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : sub.status === 'in_progress' ? (
                          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : sub.status === 'needs_revision' ? (
                          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                        )}
                        <span className="text-xs text-slate-200 truncate font-medium">
                          {sub.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 text-[10px]">
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {sub.weightageTier1Questions}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-950/60 text-indigo-300 font-mono">
                          {sub.pyqCount} PYQs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
