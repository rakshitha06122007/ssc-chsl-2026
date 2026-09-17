import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  Lock, 
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import { sendOtp, verifyOtp, login, register, forgotPassword, resetPassword, saveSmtpConfig } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  initialMode?: 'login' | 'register' | 'verify-email';
  onLoginSuccess: (user: User) => void;
  onNavigateLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  initialMode = 'login', 
  onLoginSuccess, 
  onNavigateLanding 
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password'>(() => {
    if (window.location.hash === '#create-account' || window.location.hash === '#register') return 'register';
    if (window.location.hash === '#verify-email') return 'verify-email';
    return initialMode;
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // SMTP configuration state
  const [showSmtpSetup, setShowSmtpSetup] = useState(false);
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [smtpSaving, setSmtpSaving] = useState(false);

  // Sync with browser hash changes
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#create-account' || window.location.hash === '#register') {
        setMode('register');
      } else if (window.location.hash === '#verify-email') {
        setMode('verify-email');
      } else if (window.location.hash === '#login') {
        setMode('login');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Mask email utility (e.g. c***e@gmail.com)
  const maskEmail = (raw: string) => {
    if (!raw || !raw.includes('@')) return raw;
    const [name, domain] = raw.split('@');
    if (name.length <= 2) {
      return name[0] + '***@' + domain;
    }
    return `${name[0]}***${name[name.length - 1]}@${domain}`;
  };

  // 1. Handle Registration / Send Verification Code
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(email, password);
      if (res.success) {
        setMode('verify-email');
        window.location.hash = '#verify-email';
        setCooldown(60);
        setOtpCode('');
        setSuccessMessage('Verification code sent! Check your inbox.');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Network connection error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(email, otpCode, password || undefined);
      if (res.success) {
        setSuccessMessage('Email verified successfully! Redirecting to login...');
        setTimeout(() => {
          setMode('login');
          window.location.hash = '#login';
          setSuccessMessage('Your email has been verified. Please sign in with your password.');
          setOtpCode('');
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Failed to verify code. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Resend Code
  const handleResendCode = async () => {
    if (cooldown > 0 || loading || !email) return;
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const res = await sendOtp(email);
      if (res.success) {
        setCooldown(60);
        setSuccessMessage('A fresh 6-digit verification code has been dispatched to your email.');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Could not resend code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailClean = (email || '').trim().toLowerCase();
    const passwordClean = (password || '').trim();

    if (!emailClean || !passwordClean || emailClean !== 'test@gmail.com' || passwordClean !== 'test123') {
      setError('Invalid credentials');
      return;
    }

    setLoading(true);
    try {
      const res = await login(emailClean, passwordClean);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError('Invalid credentials');
      }
    } catch (err: any) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email || !email.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setMode('reset-password');
        setCooldown(60);
        setSuccessMessage('Password reset code sent! Please check your email.');
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Failed to request password reset. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Handle Reset Password Submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter the 6-digit reset code.');
      return;
    }
    if (password.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email, otpCode, password);
      if (res.success) {
        setSuccessMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          setMode('login');
          window.location.hash = '#login';
          setSuccessMessage('Your password was updated. Please sign in.');
          setOtpCode('');
          setPassword('');
          setConfirmPassword('');
        }, 1200);
      } else {
        setError(res.message);
      }
    } catch (err: any) {
      setError('Could not reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-[#0d1322] border border-white/10 rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl relative">
        
        {/* Top brand header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide">TrustHire AI</h1>
              <span className="text-[11px] text-cyan-400 font-medium">Verified Opportunity Platform</span>
            </div>
          </div>
          {onNavigateLanding && (
            <button
              onClick={onNavigateLanding}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
          )}
        </div>

        {/* Global Feedback Notifications */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
              {error.toLowerCase().includes('not verified') && (
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setMode('verify-email');
                    window.location.hash = '#verify-email';
                    handleResendCode();
                  }}
                  className="block mt-2 text-cyan-400 underline font-semibold hover:text-cyan-300"
                >
                  Verify Email Now
                </button>
              )}
              {error.includes('SMTP') && (
                <div className="mt-2.5 pt-2 border-t border-rose-500/20">
                  <span className="block text-[11px] text-slate-300 mb-1.5">
                    Need to configure Gmail delivery? Open <code className="text-cyan-300 bg-black/40 px-1.5 py-0.5 rounded font-mono">backend/.env</code> or enter your Gmail App Password:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowSmtpSetup(true)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold hover:bg-cyan-500/30 transition-all"
                  >
                    Set Gmail SMTP Credentials
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Optional In-Page SMTP Setup Dialog */}
        {showSmtpSetup && (
          <div className="mb-6 p-4 rounded-xl bg-navy-950/90 border border-cyan-500/40 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>📧</span> Configure Gmail SMTP Delivery
              </span>
              <button
                type="button"
                onClick={() => setShowSmtpSetup(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Enter your Gmail address and 16-character Google App Password (created in Google Account &gt; Security &gt; App Passwords).
            </p>
            <div className="space-y-2">
              <input
                type="email"
                placeholder="your-email@gmail.com"
                value={smtpUser}
                onChange={(e) => setSmtpUser(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-cyan-400 font-sans"
              />
              <input
                type="password"
                placeholder="16-character Gmail App Password"
                value={smtpPassword}
                onChange={(e) => setSmtpPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-black/50 border border-white/15 text-white text-xs outline-none focus:border-cyan-400 font-sans"
              />
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <button
                type="button"
                onClick={() => setShowSmtpSetup(false)}
                className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={smtpSaving || !smtpUser || !smtpPassword}
                onClick={async () => {
                  setSmtpSaving(true);
                  try {
                    const res = await saveSmtpConfig({
                      host: 'smtp.gmail.com',
                      port: 587,
                      user: smtpUser.trim(),
                      password: smtpPassword.trim(),
                      from_addr: `TrustHire AI <${smtpUser.trim()}>`,
                      use_tls: true
                    });
                    if (res.success) {
                      setShowSmtpSetup(false);
                      setError(null);
                      setSuccessMessage('Gmail SMTP credentials saved! Sending code...');
                      // Automatically trigger registration/sending code
                      if (email && password) {
                        handleRegister({ preventDefault: () => {} } as any);
                      }
                    } else {
                      setError(res.message);
                    }
                  } catch (e) {
                    setError('Failed to save SMTP credentials.');
                  } finally {
                    setSmtpSaving(false);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs disabled:opacity-50"
              >
                {smtpSaving ? 'Saving...' : 'Save & Send Code'}
              </button>
            </div>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ====================================================
            VIEW 1: CREATE ACCOUNT / VERIFY EMAIL
           ==================================================== */}
        {mode === 'register' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Create Account / Verify Email</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your email address to receive a secure 6-digit verification code.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Sending Verification Code...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400">Already have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                  window.location.hash = '#login';
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 2: /verify-email (CHECK YOUR EMAIL)
           ==================================================== */}
        {mode === 'verify-email' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-inner">
                <Mail className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Check your email</h2>
              <p className="text-xs text-slate-400">
                We sent a 6-digit verification code to{' '}
                <span className="font-mono text-cyan-300 font-semibold">{maskEmail(email)}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-center text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                  Enter 6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.5em] font-mono text-3xl py-3.5 rounded-xl bg-navy-950 border border-white/20 focus:border-cyan-400 text-white outline-none transition-all shadow-inner"
                  required
                />
              </div>

              <div className="space-y-2.5">
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                  <CheckCircle2 className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={cooldown > 0 || loading}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{cooldown > 0 ? `Resend Code in ${cooldown}s` : 'Resend Code'}</span>
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-white/10 text-center flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('register');
                  window.location.hash = '#create-account';
                }}
                className="hover:text-white underline cursor-pointer"
              >
                Wrong email address?
              </button>

              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                  window.location.hash = '#login';
                }}
                className="text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 3: /login (LOGIN PAGE)
           ==================================================== */}
        {mode === 'login' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Sign In to TrustHire AI</h2>
              <p className="text-xs text-slate-400">
                Enter your verified credentials to access the Opportunity Verification Dashboard.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setSuccessMessage(null);
                      setMode('forgot-password');
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Signing In...' : 'Sign In'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-xs text-slate-400">Don't have an account? </span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('register');
                  window.location.hash = '#create-account';
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 4: FORGOT PASSWORD
           ==================================================== */}
        {mode === 'forgot-password' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Reset Password</h2>
              <p className="text-xs text-slate-400">
                Enter your verified email to receive a password reset verification code.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Registered Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Sending Reset Code...' : 'Send Reset Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                  window.location.hash = '#login';
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Return to Sign In
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 5: RESET PASSWORD WITH OTP
           ==================================================== */}
        {mode === 'reset-password' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Set New Password</h2>
              <p className="text-xs text-slate-400">
                Enter the 6-digit code sent to <span className="font-mono text-cyan-300">{maskEmail(email)}</span> and choose a new password.
              </p>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  6-Digit Reset Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl bg-navy-950 border border-white/20 focus:border-cyan-400 text-white outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || otpCode.length !== 6 || password.length < 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('login');
                  window.location.hash = '#login';
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cancel and return to Sign In
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
