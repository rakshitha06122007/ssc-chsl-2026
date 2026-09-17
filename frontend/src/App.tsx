import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { VerificationReportModal } from './components/VerificationReportModal';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { VerifyJobPage } from './pages/VerifyJobPage';
import { CompanyVerifyPage } from './pages/CompanyVerifyPage';
import { RecruiterEmailPage } from './pages/RecruiterEmailPage';
import { WebsiteAnalyzePage } from './pages/WebsiteAnalyzePage';
import { MessageAnalyzePage } from './pages/MessageAnalyzePage';
import { HistoryPage } from './pages/HistoryPage';
import { DemoPage } from './pages/DemoPage';
import { EvaluationPage } from './pages/EvaluationPage';
import { SafetyGuidesPage } from './pages/SafetyGuidesPage';
import { LoginPage } from './pages/LoginPage';
import { User, VerificationReport } from './types';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    if (['#login', '#create-account', '#register', '#verify-email'].includes(window.location.hash)) return 'login';
    return localStorage.getItem('trusthire_user') ? 'dashboard' : 'landing';
  });
  const [user, setUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [jobInitialPayload, setJobInitialPayload] = useState<Record<string, any> | undefined>(undefined);

  // Load user session from localStorage & hash listener
  useEffect(() => {
    const saved = localStorage.getItem('trusthire_user');
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    const onHashChange = () => {
      if (['#login', '#create-account', '#register', '#verify-email'].includes(window.location.hash)) {
        setCurrentTab('login');
      } else if (window.location.hash === '#landing') {
        setCurrentTab('landing');
      } else if (window.location.hash === '#dashboard') {
        setCurrentTab('dashboard');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('trusthire_user', JSON.stringify(authenticatedUser));
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('trusthire_user');
  };

  const handleViewReport = (report: VerificationReport) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleNavigateWithPayload = (tab: string, payload?: any) => {
    if (payload && tab === 'verify-job') {
      setJobInitialPayload(payload);
    }
    setCurrentTab(tab);
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'analyzers') {
            setCurrentTab('company-verify');
          } else {
            setCurrentTab(tab);
          }
        }}
        user={user}
        onOpenAuth={() => setCurrentTab('login')}
        onLogout={handleLogout}
      />

      {/* Sub-navigation bar for Standalone Analyzers */}
      {['company-verify', 'recruiter-email', 'website-analyze', 'message-analyze'].includes(currentTab) && (
        <div className="bg-navy-950/60 border-b border-white/5 py-2.5 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-mono uppercase text-[10px] mr-2">Analyzers:</span>
            <button
              onClick={() => setCurrentTab('company-verify')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'company-verify' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verify Company
            </button>
            <button
              onClick={() => setCurrentTab('recruiter-email')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'recruiter-email' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recruiter Email
            </button>
            <button
              onClick={() => setCurrentTab('website-analyze')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'website-analyze' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Website & Domain
            </button>
            <button
              onClick={() => setCurrentTab('message-analyze')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'message-analyze' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Job Message
            </button>
          </div>
        </div>
      )}

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'dashboard' && (
          <DashboardPage
            user={user}
            onNavigate={handleNavigateWithPayload}
            onViewReport={handleViewReport}
          />
        )}

        {currentTab === 'landing' && (
          <LandingPage
            onStartVerification={() => setCurrentTab('verify-job')}
            onExploreDemo={() => setCurrentTab('demo')}
            onSelectTab={setCurrentTab}
          />
        )}

        {currentTab === 'login' && (
          <LoginPage
            onLoginSuccess={(u) => {
              handleLoginSuccess(u);
              setCurrentTab('dashboard');
            }}
            onNavigateLanding={() => setCurrentTab('landing')}
          />
        )}

        {currentTab === 'verify-job' && (
          <VerifyJobPage
            user={user}
            initialPayload={jobInitialPayload}
          />
        )}

        {currentTab === 'company-verify' && <CompanyVerifyPage />}
        {currentTab === 'recruiter-email' && <RecruiterEmailPage />}
        {currentTab === 'website-analyze' && <WebsiteAnalyzePage />}
        {currentTab === 'message-analyze' && <MessageAnalyzePage />}

        {currentTab === 'history' && (
          <HistoryPage onViewReport={handleViewReport} />
        )}

        {currentTab === 'demo' && <DemoPage />}
        {currentTab === 'evaluation' && <EvaluationPage />}
        {currentTab === 'guides' && <SafetyGuidesPage />}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      {/* Opportunity Verification Report Modal */}
      <VerificationReportModal
        report={selectedReport}
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </div>
  );
}

export default App;
