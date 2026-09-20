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
  EyeOff,
  Sparkles
} from 'lucide-react';
import { sendOtp, verifyOtp, login, register, forgotPassword, resetPassword } from '../services/api';
import { User } from '../types';

interface LoginPageProps {
  initialMode?: 'email-otp' | 'verify-otp' | 'password-login';
  onLoginSuccess: (user: User) => void;
  onNavigateLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ 
  initialMode = 'email-otp', 
  onLoginSuccess, 
  onNavigateLanding 
}) => {
  const [mode, setMode] = useState<'email-otp' | 'verify-otp' | 'password-login' | 'forgot-password' | 'reset-password'>(() => {
    if (window.location.hash === '#verify-email') return 'verify-otp';
    if (window.location.hash === '#password-login') return 'password-login';
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

  // Sync with browser hash changes
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#verify-email') {
        setMode('verify-otp');
      } else if (window.location.hash === '#password-login') {
        setMode('password-login');
      } else if (window.location.hash === '#login' || window.location.hash === '#email-otp') {
        setMode('email-otp');
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

  // 1. Step 1: Send OTP to Email
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailClean = (email || '').trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(emailClean);
      if (res.success) {
        setMode('verify-otp');
        window.location.hash = '#verify-email';
        setCooldown(60);
        setOtpCode('');
        setSuccessMessage(res.message || 'A verification code has been sent to your email.');
      } else {
        setError(res.message || 'Unable to send verification email. Please try again.');
      }
    } catch (err: any) {
      setError('Network connection error. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Step 2: Verify OTP & Direct Full Website Access
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailClean = (email || '').trim().toLowerCase();
    const codeClean = (otpCode || '').trim();

    if (!codeClean || codeClean.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOtp(emailClean, codeClean);
      if (res.success && res.user) {
        setSuccessMessage('Email verified successfully! Opening website...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 500);
      } else {
        setError(res.message || 'Invalid verification code. Please check and try again.');
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
      const res = await sendOtp(email.trim().toLowerCase());
      if (res.success) {
        setCooldown(60);
        setSuccessMessage('A verification code has been sent to your email.');
      } else {
        setError(res.message || 'Unable to send verification email. Please try again.');
      }
    } catch (err: any) {
      setError('Could not resend code. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Optional: Handle Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailClean = (email || '').trim().toLowerCase();
    const passwordClean = (password || '').trim();

    if (!emailClean || !passwordClean) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await login(emailClean, passwordClean);
      if (res.success && res.user) {
        setSuccessMessage('Signed in successfully! Opening website...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
        }, 500);
      } else {
        setError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Handle Forgot Password Request
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const emailClean = (email || '').trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(emailClean);
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

    const emailClean = (email || '').trim().toLowerCase();
    const codeClean = (otpCode || '').trim();

    if (!codeClean || codeClean.length !== 6) {
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
      const res = await resetPassword(emailClean, codeClean, password);
      if (res.success) {
        setSuccessMessage('Password reset successfully! Redirecting...');
        setTimeout(() => {
          setMode('email-otp');
          window.location.hash = '#login';
          setSuccessMessage('Your password was updated. You can now verify with OTP or password.');
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
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide flex items-center gap-1.5">
                TrustHire AI
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">PWA</span>
              </h1>
              <span className="text-[11px] text-cyan-400 font-medium">Instant Email &amp; OTP Access</span>
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
            VIEW 1: EMAIL ACCESS (DEFAULT - ENTER EMAIL)
           ==================================================== */}
        {mode === 'email-otp' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-semibold mb-2">
                <Sparkles className="w-3 h-3" />
                <span>Works with Any Email Address</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1.5">Sign In with Email &amp; OTP</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter any personal, student, or corporate email address. We'll generate a secure 6-digit verification code to unlock the full platform.
              </p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Your Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email.trim() || !email.includes('@')}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Sending Verification Code...' : 'Send Verification Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>Have a saved password?</span>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('password-login');
                  window.location.hash = '#password-login';
                }}
                className="font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Password Sign In
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 2: ENTER OTP & UNLOCK WEBSITE
           ==================================================== */}
        {mode === 'verify-otp' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto mb-3 shadow-inner">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Enter Verification Code</h2>
              <p className="text-xs text-slate-400">
                A verification code has been sent to <br />
                <span className="font-mono text-cyan-300 font-semibold">{maskEmail(email)}</span>
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Please check your email inbox and enter the 6-digit code below.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider text-center">
                  6-Digit Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={otpCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    setOtpCode(val);
                  }}
                  placeholder="------"
                  className="w-full text-center tracking-[0.6em] font-mono text-3xl py-3.5 rounded-xl bg-navy-950 border border-cyan-500/40 focus:border-cyan-400 text-cyan-300 outline-none transition-all shadow-inner"
                  required
                />
                <p className="text-[11px] text-slate-500 text-center mt-2">
                  Valid for 10 minutes &bull; Single-use only
                </p>
              </div>

              <button
                id="btn-verify-otp"
                type="submit"
                disabled={loading || otpCode.length !== 6}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-bold text-xs shadow-lg shadow-emerald-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Verifying Code...' : 'Verify & Access Website'}
                <CheckCircle2 className="w-4 h-4 text-black" />
              </button>
            </form>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('email-otp');
                  window.location.hash = '#login';
                }}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Change Email
              </button>

              <button
                type="button"
                disabled={cooldown > 0 || loading}
                onClick={handleResendCode}
                className="text-cyan-400 hover:text-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer font-medium"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>{cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ====================================================
            VIEW 3: PASSWORD LOGIN (OPTIONAL ALTERNATIVE)
           ==================================================== */}
        {mode === 'password-login' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <h2 className="text-xl font-bold text-white mb-1.5">Sign In with Password</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enter your verified email and password to sign in.
              </p>
            </div>

            <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                {loading ? 'Signing In...' : 'Sign In with Password'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('email-otp');
                  window.location.hash = '#login';
                }}
                className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
              >
                Switch to Direct Email &amp; OTP Access
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
                {loading ? 'Sending Code...' : 'Send Reset Code'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setSuccessMessage(null);
                  setMode('email-otp');
                  window.location.hash = '#login';
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Back to Email &amp; OTP Access
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
                  setMode('email-otp');
                  window.location.hash = '#login';
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Cancel and return to Email Access
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
