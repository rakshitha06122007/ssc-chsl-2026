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
import { User, VerificationReport } from './types';
import { getAuthSession, logout } from './services/api';

const DEFAULT_USER: User = {
  email: 'user@trusthire.ai',
  is_verified: true,
  domain_analysis: {
    email: 'user@trusthire.ai',
    domain: 'trusthire.ai',
    domain_type: 'Direct Platform Access',
    is_free_provider: false,
    explanation: 'Direct platform access enabled without login requirement.'
  }
};

export function App() {
  const [currentTab, setCurrentTab] = useState<string>(() => {
    const raw = window.location.hash.replace('#', '').trim();
    if (['dashboard', 'verify-job', 'history', 'company-verify', 'recruiter-email', 'website-analyze', 'message-analyze', 'demo', 'evaluation', 'guides', 'landing'].includes(raw)) {
      return raw;
    }
    return 'dashboard';
  });
  const [user, setUser] = useState<User>(() => {
    const saved = localStorage.getItem('trusthire_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [selectedReport, setSelectedReport] = useState<VerificationReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [jobInitialPayload, setJobInitialPayload] = useState<Record<string, any> | undefined>(undefined);

  // PWA installation prompt event state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState<boolean>(false);

  // 1. Sync session on load
  useEffect(() => {
    getAuthSession().then((res) => {
      if (res.authenticated && res.user) {
        setUser(res.user);
        localStorage.setItem('trusthire_user', JSON.stringify(res.user));
      } else {
        setUser(DEFAULT_USER);
        localStorage.setItem('trusthire_user', JSON.stringify(DEFAULT_USER));
      }
    }).catch(() => {
      setUser(DEFAULT_USER);
    });
  }, []);

  // 2. Hash listener & navigation syncing (no login gate)
  useEffect(() => {
    const onHashChange = () => {
      const raw = window.location.hash.replace('#', '').trim();
      if (['login', 'create-account', 'register', 'verify-email'].includes(raw)) {
        setCurrentTab('dashboard');
        window.location.hash = '#dashboard';
      } else if (raw) {
        setCurrentTab(raw);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // 4. Capture PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('TrustHire PWA was successfully installed.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstallable(false);
        setDeferredPrompt(null);
      }
    } catch (e) {
      console.error('PWA install prompt error:', e);
    }
  };

  const handleLoginSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    localStorage.setItem('trusthire_user', JSON.stringify(authenticatedUser));
    setAuthModalOpen(false);
    setCurrentTab('dashboard');
    window.location.hash = '#dashboard';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    localStorage.removeItem('trusthire_user');
    setCurrentTab('landing');
    window.location.hash = '#landing';
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
    window.location.hash = `#${tab}`;
  };

  const handleTabSelect = (tab: string) => {
    if (tab === 'analyzers') {
      setCurrentTab('company-verify');
      window.location.hash = '#company-verify';
      return;
    }
    if (['login', 'create-account', 'register'].includes(tab)) {
      setCurrentTab('dashboard');
      window.location.hash = '#dashboard';
      return;
    }
    setCurrentTab(tab);
    window.location.hash = `#${tab}`;
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans pb-16 md:pb-0">
      {/* Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={handleTabSelect}
        user={user}
        onOpenAuth={() => setCurrentTab('login')}
        onLogout={handleLogout}
        isInstallable={isInstallable}
        onInstall={handleInstallClick}
      />

      {/* Sub-navigation bar for Standalone Analyzers */}
      {['company-verify', 'recruiter-email', 'website-analyze', 'message-analyze'].includes(currentTab) && (
        <div className="bg-navy-950/60 border-b border-white/5 py-2.5 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-500 font-mono uppercase text-[10px] mr-2">Analyzers:</span>
            <button
              onClick={() => handleTabSelect('company-verify')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'company-verify' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Verify Company
            </button>
            <button
              onClick={() => handleTabSelect('recruiter-email')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'recruiter-email' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Recruiter Email
            </button>
            <button
              onClick={() => handleTabSelect('website-analyze')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                currentTab === 'website-analyze' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Website & Domain
            </button>
            <button
              onClick={() => handleTabSelect('message-analyze')}
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
            onStartVerification={() => handleTabSelect('verify-job')}
            onExploreDemo={() => handleTabSelect('demo')}
            onSelectTab={handleTabSelect}
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
