import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  LogOut,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { audioService } from '../../services/audioService';

interface InlineAuthCardProps {
  onEnterApp?: () => void;
}

export const InlineAuthCard: React.FC<InlineAuthCardProps> = ({ onEnterApp }) => {
  const {
    user,
    callsign: activeCallsign,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    signOut,
    error,
    clearError
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [callsignInput, setCallsignInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    setSuccessMsg(null);
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
        audioService.playLevelUp();
        setSuccessMsg('Session Authenticated');
      } else {
        await signUpWithEmail(email, password, callsignInput);
        audioService.playLevelUp();
        setSuccessMsg('Operator Profile Registered');
      }
    } catch {
      audioService.playBossHit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearError();
    setSuccessMsg(null);
    try {
      await signInWithGoogle();
      audioService.playLevelUp();
      setSuccessMsg('Google Identity Bound');
      if (onEnterApp) {
        onEnterApp();
      }
    } catch {
      audioService.playBossHit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsSubmitting(true);
    clearError();
    setSuccessMsg(null);
    try {
      await signInAsGuest();
      audioService.playTactileClick();
      setSuccessMsg('Guest Session Initialized');
    } catch {
      audioService.playBossHit();
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already authenticated, display active status card with Launch CTA
  if (user) {
    return (
      <div className="relative rounded-2xl bg-[#0a0e16]/95 border border-cyan-500/40 p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-slate-100 font-mono backdrop-blur-xl space-y-5">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 shadow-[0_0_10px_#00f0ff]" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-mono font-bold text-base shadow-[0_0_12px_rgba(0,240,255,0.2)]">
              {activeCallsign ? activeCallsign[0].toUpperCase() : 'O'}
            </div>
            <div>
              <span className="text-[10px] text-cyan-400 tracking-widest block uppercase">
                AUTHENTICATED OPERATOR
              </span>
              <h3 className="text-base font-bold text-white tracking-wide">
                {activeCallsign || user.displayName || user.email?.split('@')[0] || 'Pilot'}
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              audioService.playTactileClick();
              signOut();
            }}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs flex items-center gap-1 transition-all cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>

        <div className="bg-[#05080e] p-3.5 rounded-xl border border-white/[0.08] space-y-2 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Identity Protocol:</span>
            <span className="text-cyan-300 font-semibold">{user.isAnonymous ? 'Guest Pilot' : 'Cloud Account'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Session ID:</span>
            <span className="text-slate-300 font-mono text-[11px] truncate max-w-[170px]">{user.uid}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Cloud Isolation:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> ACTIVE
            </span>
          </div>
        </div>

        {onEnterApp && (
          <button
            onClick={() => {
              audioService.playLevelUp();
              onEnterApp();
            }}
            className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_25px_rgba(0,240,255,0.3)] hover:shadow-[0_0_35px_rgba(0,240,255,0.5)] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>LAUNCH COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div id="auth-card" className="relative rounded-2xl bg-[#0a0e16]/95 border border-cyan-500/30 p-5 sm:p-6 shadow-[0_0_40px_rgba(0,240,255,0.15)] text-slate-100 font-mono backdrop-blur-xl text-left">
      {/* Top ambient glowing accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-400 to-amber-400 shadow-[0_0_10px_#00f0ff]" />

      {/* Card Header & Mode Switcher */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block leading-tight">
              OPERATOR ACCESS
            </span>
            <span className="text-xs font-bold text-white tracking-wide">
              {mode === 'signin' ? 'Sign In to Account' : 'Create New Account'}
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-lg bg-[#05080e] p-1 border border-white/10 text-[11px]">
          <button
            type="button"
            onClick={() => {
              audioService.playTactileClick();
              setMode('signin');
              clearError();
              setSuccessMsg(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'signin'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            SIGN IN
          </button>
          <button
            type="button"
            onClick={() => {
              audioService.playTactileClick();
              setMode('signup');
              clearError();
              setSuccessMsg(null);
            }}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              mode === 'signup'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            REGISTER
          </button>
        </div>
      </div>

      {/* Error & Feedback Messages */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Google Quick Auth */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isSubmitting}
        className="w-full py-2.5 px-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white font-sans text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
      >
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#EA4335"
            d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
          />
          <path
            fill="#4285F4"
            d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
          />
          <path
            fill="#FBBC05"
            d="M5.6 14.8c-.3-.8-.4-1.8-.4-2.8s.1-2 .4-2.8L1.9 6.3C.7 8.7 0 10.3 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
          />
          <path
            fill="#34A853"
            d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Divider */}
      <div className="relative my-4 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/[0.08]" />
        </div>
        <span className="relative px-3 bg-[#0a0e16] text-[10px] uppercase font-mono text-slate-500">
          OR EMAIL CREDENTIALS
        </span>
      </div>

      {/* Credential Form */}
      <form onSubmit={handleSubmit} className="space-y-3 font-sans">
        {mode === 'signup' && (
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              OPERATOR CALLSIGN / NAME
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={callsignInput}
                onChange={(e) => setCallsignInput(e.target.value)}
                placeholder="e.g. Commander Nova"
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#05080e] border border-white/10 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            EMAIL ADDRESS
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pilot@lifeos.app"
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#05080e] border border-white/10 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-mono text-slate-400 mb-1">
            PASSWORD
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2 rounded-xl bg-[#05080e] border border-white/10 focus:border-cyan-400 text-xs text-slate-100 placeholder-slate-600 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-[#07090e] font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.25)] hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] active:scale-98 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-black" />
              <span>AUTHENTICATING...</span>
            </>
          ) : mode === 'signin' ? (
            <>
              <LogIn className="w-4 h-4" />
              <span>SIGN IN TO ACCOUNT</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>CREATE OPERATOR ACCOUNT</span>
            </>
          )}
        </button>
      </form>

      {/* Guest Mode Direct CTA */}
      <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between">
        <span className="text-[10px] text-slate-500 font-mono">No account yet?</span>
        <button
          type="button"
          onClick={handleGuestSignIn}
          disabled={isSubmitting}
          className="text-xs font-mono text-cyan-300 hover:text-cyan-200 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Zap className="w-3 h-3 text-amber-400" />
          <span>Quick Guest Mode →</span>
        </button>
      </div>
    </div>
  );
};
