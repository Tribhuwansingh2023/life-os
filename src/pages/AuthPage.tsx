import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  Sparkles,
  AlertCircle,
  LogOut,
  Eye,
  EyeOff,
  RefreshCw,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameStateContext';
import { audioService } from '../services/audioService';
import { Button } from '../components/ui/Button';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    callsign,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
    signOut,
    error,
    clearError
  } = useAuth();
  const { syncStatus, player, getProfiles } = useGame();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inputCallsign, setInputCallsign] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const profiles = getProfiles ? getProfiles() : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, inputCallsign);
      }
      audioService.playLevelUp();
      navigate({ to: '/command' });
    } catch {
      // Handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithGoogle();
      audioService.playLevelUp();
      navigate({ to: '/command' });
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestSignIn = async () => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInAsGuest();
      audioService.playLevelUp();
      navigate({ to: '/command' });
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 font-sans select-none relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md space-y-4"
      >
        {/* Back to landing page navigation link */}
        <div className="flex items-center justify-between px-1">
          <button
            onClick={() => {
              audioService.playTactileClick();
              navigate({ to: '/' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Landing Page</span>
          </button>
        </div>

        {user ? (
          /* Active Authenticated Session Card */
          <div className="relative overflow-hidden rounded-3xl bg-[#07090f]/95 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-slate-100 font-mono backdrop-blur-xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400" />

            <div className="flex items-center space-x-4 border-b border-white/10 pb-5">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <UserIcon className="w-7 h-7" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block">AUTHENTICATED OPERATOR</span>
                <h3 className="text-xl font-bold text-white truncate">{callsign}</h3>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user.email || (user.isAnonymous ? 'Guest Agent Session' : 'Google Authentication')}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Character</span>
                <span className="text-cyan-300 font-bold truncate block">{player.username}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Level & Class</span>
                <span className="text-slate-200 font-bold truncate block">Lvl {player.level} {player.characterClass}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Profiles Saved</span>
                <span className="text-amber-300 font-bold block">{profiles.length} Profiles</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cloud Status</span>
                <span className="text-emerald-400 font-bold block truncate">{syncStatus === 'synced' ? 'ACTIVE' : 'LOCAL'}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Button
                onClick={() => {
                  audioService.playLevelUp();
                  navigate({ to: '/command' });
                }}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LAUNCH COMMAND CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => {
                  audioService.playTactileClick();
                  signOut();
                }}
                className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4 mr-2 inline" /> DISCONNECT SESSION
              </Button>
            </div>
          </div>
        ) : (
          /* Unauthenticated Clean Auth Card */
          <div className="relative overflow-hidden rounded-3xl bg-[#07090f]/95 border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.15)] text-slate-100 backdrop-blur-xl space-y-6">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400" />

            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-1 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-extrabold font-mono text-white tracking-wider uppercase">
                {mode === 'signin' ? 'OPERATOR LOGIN' : 'RECRUIT OPERATOR'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'signin'
                  ? 'Sign in to access your cloud progression & inventory'
                  : 'Establish a new LIFE//OS account in Firebase'}
              </p>
            </div>

            {/* Segmented Mode Switcher */}
            <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-black/40 rounded-2xl border border-white/10 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  clearError();
                }}
                className={`py-2.5 rounded-xl font-bold tracking-wider transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                SIGN IN
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  clearError();
                }}
                className={`py-2.5 rounded-xl font-bold tracking-wider transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CREATE ACCOUNT
              </button>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
              className="flex items-center justify-center w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-cyan-500/50 hover:bg-white/[0.08] text-sm font-semibold transition-all group shadow-md cursor-pointer"
            >
              <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span className="font-mono text-xs uppercase tracking-wider text-slate-200 group-hover:text-cyan-300">
                Continue with Google
              </span>
            </button>

            <div className="relative flex items-center justify-center my-3">
              <div className="border-t border-white/10 w-full" />
              <span className="bg-[#07090f] px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                OR EMAIL CREDENTIALS
              </span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-mono">
              {mode === 'signup' && (
                <div>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                    Operator Callsign
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={inputCallsign}
                      onChange={(e) => setInputCallsign(e.target.value)}
                      placeholder="e.g. CYBER_NEXUS"
                      className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@lifeos.net"
                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-extrabold font-mono tracking-widest text-xs uppercase shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> TRANSMITTING...
                  </span>
                ) : mode === 'signin' ? (
                  <span className="flex items-center justify-center gap-2">
                    <LogIn className="w-4 h-4" /> INITIATE SESSION
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <UserPlus className="w-4 h-4" /> REGISTER OPERATOR
                  </span>
                )}
              </Button>
            </form>

            {/* Instant Guest Demo Link */}
            <div className="pt-4 border-t border-white/10 text-center">
              <button
                type="button"
                onClick={handleGuestSignIn}
                disabled={isSubmitting}
                className="w-full py-2.5 px-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                <span>INSTANT GUEST AGENT ACCESS (NO SIGN-UP)</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

