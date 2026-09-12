import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { audioService } from '../services/audioService';
import {
  Shield,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  AlertCircle,
  Zap,
  Terminal,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface AuthPageProps {
  onViewLanding?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onViewLanding }) => {
  const {
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInAsGuest,
    error: authError,
    clearError
  } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const switchMode = (newMode: 'login' | 'signup') => {
    audioService.playTactileClick();
    clearError();
    setValidationError(null);
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    audioService.playTactileClick();
    setValidationError(null);
    clearError();

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setValidationError('OPERATOR_ID_REQUIRED: Enter a valid email address.');
      audioService.playError();
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setValidationError('OPERATOR_ID_INVALID: Please verify email format.');
      audioService.playError();
      return;
    }

    if (!password || password.length < 6) {
      setValidationError('SECURITY_CONSTRAINT: Password cipher must be at least 6 characters.');
      audioService.playError();
      return;
    }

    if (mode === 'signup' && !callsign.trim()) {
      setValidationError('CALLSIGN_REQUIRED: Please specify your operator callsign.');
      audioService.playError();
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signup') {
        await signUpWithEmail(trimmedEmail, password, callsign.trim());
      } else {
        await signInWithEmail(trimmedEmail, password);
      }
    } catch (err: any) {
      audioService.playError();
      // AuthContext handles error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    audioService.playTactileClick();
    setValidationError(null);
    clearError();
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } catch {
      audioService.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    audioService.playTactileClick();
    setIsSubmitting(true);
    try {
      await signInAsGuest();
    } catch {
      audioService.playError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedError = validationError || authError;

  return (
    <div className="min-h-screen w-full bg-[#07090e] text-slate-100 flex flex-col justify-between cyber-grid relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Shield className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-mono font-black tracking-wider text-white flex items-center gap-2">
              LIFE<span className="text-cyan-400">//</span>OS
            </h1>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block">
              TACTICAL REALITY RPG
            </span>
          </div>
        </div>

        {onViewLanding && (
          <button
            onClick={onViewLanding}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#0e121a] hover:bg-[#141d2e] border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 font-mono text-xs transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">VIEW PRODUCT STORY</span>
          </button>
        )}
      </header>

      {/* Main Auth Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10 my-4">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="w-full max-w-md bg-[#0a0d14]/95 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,240,255,0.06)] relative overflow-hidden transition-all duration-300"
        >
          {/* Subtle top accent bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-purple-500" />

          {/* Terminal header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400/80 mb-1.5 uppercase tracking-widest">
              <Terminal className="w-3.5 h-3.5" />
              <span>
                {mode === 'signup' ? 'IDENTITY INITIALIZATION' : 'OPERATOR HANDSHAKE'}
              </span>
            </div>
            <h2 className="text-2xl font-mono font-black text-white tracking-wide">
              {mode === 'signup' ? 'INITIALIZE OPERATOR' : 'ACCESS LIFE//OS'}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              Authenticate to synchronize your progression across neural clouds.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#06080c] p-1 rounded-xl border border-white/[0.08] mb-6 font-mono text-xs">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>ACCESS SYSTEM</span>
            </button>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              className={`py-2 rounded-lg font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'signup'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.15)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>CREATE IDENTITY</span>
            </button>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {displayedError && (
              <motion.div
                initial={{ opacity: 0, height: 0, mb: 0 }}
                animate={{ opacity: 1, height: 'auto', mb: 16 }}
                exit={{ opacity: 0, height: 0, mb: 0 }}
                className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-start gap-2.5 overflow-hidden"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{displayedError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
            {/* CALLSIGN field (Sign up only) */}
            {mode === 'signup' && (
              <div>
                <label className="block text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-bold">
                  OPERATOR CALLSIGN
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="e.g. VANGUARD-9"
                    maxLength={24}
                    disabled={isSubmitting}
                    className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 transition-all uppercase tracking-wider"
                  />
                </div>
              </div>
            )}

            {/* EMAIL field */}
            <div>
              <label className="block text-slate-300 uppercase tracking-wider mb-1.5 text-[11px] font-bold">
                CALLSIGN / EMAIL
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@life-os.net"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-slate-600 transition-all font-mono"
                />
              </div>
            </div>

            {/* PASSWORD field with toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-slate-300 uppercase tracking-wider text-[11px] font-bold">
                  SECURITY CIPHER / PASSWORD
                </label>
                <span className="text-[10px] text-slate-500 font-sans">Min 6 chars</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-cyan-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  disabled={isSubmitting}
                  className="w-full bg-[#06080c] border border-white/10 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/50 rounded-xl pl-10 pr-10 py-2.5 text-white placeholder-slate-600 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-mono font-bold text-xs tracking-wider transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_25px_rgba(0,240,255,0.5)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>SYNCHRONIZING NEURAL LINK...</span>
                </>
              ) : mode === 'signup' ? (
                <>
                  <span>INITIALIZE OPERATOR</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>ACCESS LIFE//OS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/[0.08]" />
            </div>
            <span className="relative px-3 bg-[#0a0d14] text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              OR SYNCHRONIZE VIA
            </span>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#0e121a] hover:bg-[#141d2e] border border-white/10 hover:border-cyan-500/40 text-slate-200 hover:text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>CONTINUE WITH GOOGLE</span>
            </button>

            {/* Quick Guest Protocol */}
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={isSubmitting}
              className="w-full py-2 px-3 rounded-xl bg-transparent hover:bg-white/[0.03] border border-dashed border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-300 font-mono text-[11px] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>CONTINUE AS GUEST OPERATOR // FAST ACCESS</span>
            </button>
          </div>

          {/* Secondary Switch Link */}
          <div className="mt-6 pt-4 border-t border-white/[0.06] text-center font-mono text-xs text-slate-400">
            {mode === 'login' ? (
              <p>
                New operator?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className="text-cyan-300 hover:text-cyan-200 font-bold underline underline-offset-4 cursor-pointer"
                >
                  CREATE IDENTITY
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className="text-cyan-300 hover:text-cyan-200 font-bold underline underline-offset-4 cursor-pointer"
                >
                  ACCESS SYSTEM
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </main>

      {/* Footer System Status */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] font-mono text-slate-500 z-10 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>FIREBASE CLOUD VAULT ONLINE</span>
          <span>•</span>
          <span>AES-256 ISOLATION</span>
        </div>
        <div>
          <span>LIFE//OS OPERATING SYSTEM // TECH ZEPHYR 4.0</span>
        </div>
      </footer>
    </div>
  );
};
