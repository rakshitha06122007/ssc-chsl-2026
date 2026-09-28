import React, { useState, useEffect } from 'react';
import { CHSLNavbar } from './components/CHSLNavbar';
import { FocusTimer } from './components/FocusTimer';
import { DashboardOverview } from './pages/DashboardOverview';
import { SyllabusTrackerPage } from './pages/SyllabusTrackerPage';
import { ConceptLessonPage } from './pages/ConceptLessonPage';
import { AdaptivePracticePage } from './pages/AdaptivePracticePage';
import { MockTestLabPage } from './pages/MockTestLabPage';
import { MistakeNotebookPage } from './pages/MistakeNotebookPage';
import { SpacedRevisionPage } from './pages/SpacedRevisionPage';
import { StudyRoadmapPage } from './pages/StudyRoadmapPage';
import { SubjectToolsPage } from './pages/SubjectToolsPage';
import { AIAssistantPage } from './pages/AIAssistantPage';
import { AdminContentPage } from './pages/AdminContentPage';
import { AuthModal } from './components/AuthModal';
import { ExamTier } from './types/chsl';
import { CHSLStorageService } from './services/chslStorage';
import { getAuthSession } from './services/api';
import { User } from './types';

const GUEST_USER: User = {
  email: 'student@chslmastery.free',
  is_verified: true,
  domain_analysis: {
    email: 'student@chslmastery.free',
    domain: 'chslmastery.free',
    domain_type: 'Free Guest Mode',
    is_free_provider: false,
    explanation: '100% Free Access enabled without mandatory login.'
  }
};

function normalizeTab(rawHash: string): string {
  const clean = rawHash.replace('#', '').trim();
  const validTabs = [
    'dashboard',
    'syllabus',
    'lessons',
    'practice',
    'mock-tests',
    'mistakes',
    'revision',
    'planner',
    'tools',
    'ai-tutor',
    'admin'
  ];
  if (validTabs.includes(clean)) return clean;
  if (['mock', 'test', 'tests', 'cbe'].includes(clean)) return 'mock-tests';
  if (['lesson', 'concept', 'concepts'].includes(clean)) return 'lessons';
  if (['roadmap', 'plan'].includes(clean)) return 'planner';
  if (['notebook', 'errors'].includes(clean)) return 'mistakes';
  if (['typing', 'speed'].includes(clean)) return 'tools';
  return 'dashboard';
}

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    return normalizeTab(window.location.hash);
  });

  const [activeTier, setActiveTier] = useState<ExamTier>(() => {
    return CHSLStorageService.getActiveTier();
  });

  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('chsl_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return GUEST_USER;
      }
    }
    return GUEST_USER;
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);
  const [navPayload, setNavPayload] = useState<any>(null);

  // Sync auth session on load
  useEffect(() => {
    getAuthSession().then((res) => {
      if (res.authenticated && res.user) {
        setUser(res.user);
        localStorage.setItem('chsl_user', JSON.stringify(res.user));
      }
    }).catch(() => {});
  }, []);

  // Sync hash routing
  useEffect(() => {
    const onHashChange = () => {
      const normalized = normalizeTab(window.location.hash);
      setCurrentTab(normalized);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelectTab = (tab: string, payload?: any) => {
    setCurrentTab(tab);
    window.location.hash = `#${tab}`;
    if (payload) {
      setNavPayload(payload);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleTier = (tier: ExamTier) => {
    setActiveTier(tier);
    CHSLStorageService.setActiveTier(tier);
  };

  const isCloudSynced = user.email !== GUEST_USER.email;

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* Top Navbar */}
      <CHSLNavbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        activeTier={activeTier}
        onToggleTier={handleToggleTier}
        onOpenTimer={() => setIsTimerOpen(!isTimerOpen)}
        isLoggedIn={isCloudSynced}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Floating Focus Timer Drawer if opened */}
      {isTimerOpen && (
        <div className="fixed top-20 right-4 z-50 max-w-sm w-full shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <FocusTimer onClose={() => setIsTimerOpen(false)} />
        </div>
      )}

      {/* Main Body Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentTab === 'dashboard' && (
          <DashboardOverview
            activeTier={activeTier}
            onSelectTier={handleToggleTier}
            onNavigate={handleSelectTab}
          />
        )}

        {currentTab === 'syllabus' && (
          <SyllabusTrackerPage
            activeTier={activeTier}
            onSelectTier={handleToggleTier}
            onNavigateToLesson={(topicId) => handleSelectTab('lessons', { topicId })}
            onNavigateToPractice={(topicId) => handleSelectTab('practice', { topicId })}
          />
        )}

        {currentTab === 'lessons' && (
          <ConceptLessonPage
            initialTopicId={navPayload?.topicId || 'quant_percentage_profit'}
            onNavigateToPractice={(topicId) => handleSelectTab('practice', { topicId })}
            onNavigateToRevision={() => handleSelectTab('revision')}
          />
        )}

        {currentTab === 'practice' && (
          <AdaptivePracticePage
            initialTopicId={navPayload?.topicId}
            onNavigateToMistakes={() => handleSelectTab('mistakes')}
          />
        )}

        {currentTab === 'mock-tests' && (
          <MockTestLabPage
            activeTier={activeTier}
            onNavigateToLessons={(topicId) => handleSelectTab('lessons', { topicId })}
            onNavigateToRevision={() => handleSelectTab('revision')}
          />
        )}

        {currentTab === 'mistakes' && (
          <MistakeNotebookPage
            onNavigateToLessons={(topicId) => handleSelectTab('lessons', { topicId })}
          />
        )}

        {currentTab === 'revision' && (
          <SpacedRevisionPage />
        )}

        {currentTab === 'planner' && (
          <StudyRoadmapPage />
        )}

        {currentTab === 'tools' && (
          <SubjectToolsPage />
        )}

        {currentTab === 'ai-tutor' && (
          <AIAssistantPage />
        )}

        {currentTab === 'admin' && (
          <AdminContentPage />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-[#090d16] py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <span className="font-extrabold text-slate-300">
              CHSL Mastery — SSC CHSL 2026 Complete Preparation Platform
            </span>
            <span className="hidden sm:inline">•</span>
            <span>Free Public Access • Zero Mandatory Login</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => handleSelectTab('syllabus')} className="hover:text-slate-300 transition">Official Syllabus</button>
            <button onClick={() => handleSelectTab('mock-tests')} className="hover:text-slate-300 transition">Mock Test Lab</button>
            <button onClick={() => handleSelectTab('tools')} className="hover:text-slate-300 transition">35 WPM Typing Test</button>
            <button onClick={() => handleSelectTab('admin')} className="hover:text-slate-300 transition">Admin Tools</button>
          </div>
        </div>
      </footer>

      {/* Cloud Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(loggedUser) => {
          setUser(loggedUser);
          localStorage.setItem('chsl_user', JSON.stringify(loggedUser));
          setIsAuthModalOpen(false);
        }}
      />

    </div>
  );
}
export default App;
