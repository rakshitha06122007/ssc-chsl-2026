import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mail, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck,
  Lock
} from 'lucide-react';
import { sendOtp, verifyOtp, login } from '../services/api';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onOpenFullPage?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onOpenFullPage }) => {
  const [tab, setTab] = useState<'login' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer: any;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection failed. Please check backend server.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerification = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await sendOtp(email);
      if (res.success) {
        setTab('verify');
        setCooldown(60);
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Connection failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Please enter the 6-digit code.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await verifyOtp(email, otpCode);
      if (res.success && res.user) {
        onSuccess(res.user);
        onClose();
      } else {
        setError(res.message);
      }
    } catch (err) {
      setError('Failed to verify code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d1322] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">TrustHire AI Authentication</h3>
            <p className="text-xs text-slate-400">Verified identity security portal</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-950 border border-white/15 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-white/10 text-center flex items-center justify-between text-xs text-slate-400">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenFullPage) {
                    onOpenFullPage();
                  } else {
                    window.location.hash = '#create-account';
                  }
                }}
                className="text-cyan-400 hover:underline"
              >
                Create Account
              </button>
              <button
                type="button"
                onClick={handleSendVerification}
                className="hover:text-white underline"
              >
                Verify Email via OTP
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="text-center mb-2">
              <span className="text-xs text-slate-400">Check inbox for 6-digit code: <strong className="text-cyan-300">{email}</strong></span>
            </div>

            <div>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                placeholder="------"
                className="w-full text-center tracking-[0.5em] font-mono text-2xl py-3 rounded-xl bg-navy-950 border border-white/20 text-white outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            <div className="flex justify-between items-center text-xs text-slate-400 pt-3">
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={cooldown > 0 || loading}
                className="hover:text-white"
              >
                {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
              </button>
              <button
                type="button"
                onClick={() => setTab('login')}
                className="text-cyan-400 hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
