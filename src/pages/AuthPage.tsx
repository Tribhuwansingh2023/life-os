import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Lock,
  Mail,
  User as UserIcon,
  LogIn,
  UserPlus,
  Sparkles,
  AlertCircle,
  Cloud,
  CheckCircle2,
  LogOut,
  Key,
  Database,
  RefreshCw,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useGame } from '../context/GameStateContext';
import { Button } from '../components/ui/Button';

export const AuthPage: React.FC = () => {
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
    } catch {
      // Error handled in AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    clearError();
    try {
      await signInWithGoogle();
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
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12 font-sans">
      {/* Top Banner & Security Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#070b14] via-[#0b101f] to-[#120e24] border border-cyan-500/30 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-cyan-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-wider">
              <Key className="w-3.5 h-3.5 text-cyan-400" />
              <span>AUTHENTICATION & SECURITY PORTAL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-black text-white tracking-wider">
              USER IDENTITY & CLOUD ISOLATION
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Secure authentication, session persistence, and real-time per-user document isolation. Only you can view or modify your character progression, tasks, and inventory.
            </p>
          </div>

          {/* Cloud Sync Badge */}
          <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#07090e]/80 border border-white/10 font-mono text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-400 shadow-[0_0_8px_#10b981] animate-pulse'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-spin'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-200 font-bold">
                {syncStatus === 'synced' ? 'FIRESTORE CLOUD ACTIVE' : syncStatus === 'syncing' ? 'WRITING DELTAS...' : 'LOCAL EMBEDDED DEMO'}
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              {user ? `UID: ${user.uid.slice(0, 14)}...` : 'Status: Unauthenticated'}
            </span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Left Authentication Portal, Right Security Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form / Active Session Card */}
        <div className="lg:col-span-6 space-y-6">
          {user ? (
            /* Active Authenticated Session Card */
            <div className="p-6 rounded-2xl bg-[#0a0d14] border border-cyan-500/30 text-slate-100 shadow-xl space-y-5 font-mono">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <UserIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 uppercase tracking-widest block font-bold">AUTHENTICATED OPERATOR</span>
                    <h3 className="text-lg font-bold text-white">{callsign}</h3>
                    <p className="text-xs text-slate-400">{user.email || (user.isAnonymous ? 'Guest Anonymous Account' : 'Google Identity')}</p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Active Callsign</span>
                  <span className="text-cyan-300 font-bold text-sm truncate block">{player.username}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Level & Class</span>
                  <span className="text-slate-200 font-bold text-sm truncate block">Lvl {player.level} {player.characterClass}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Profiles Saved</span>
                  <span className="text-slate-200 font-bold text-sm block">{profiles.length} Profiles</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-slate-400 block uppercase">Cloud Sync Path</span>
                  <span className="text-slate-200 font-bold text-sm truncate block">users/{user.uid.slice(0, 8)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => signOut()}
                  className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-xs uppercase"
                >
                  <LogOut className="w-4 h-4 mr-2 inline" /> Sign Out Operator Session
                </Button>
              </div>
            </div>
          ) : (
            /* Unauthenticated Login / Register Form */
            <div className="p-6 rounded-2xl bg-[#0a0d14] border border-cyan-500/30 text-slate-100 shadow-xl space-y-5">
              {/* Header */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-mono text-cyan-400 tracking-wider uppercase">
                    {mode === 'signin' ? 'OPERATOR AUTHENTICATION' : 'RECRUIT NEW OPERATOR'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {mode === 'signin' ? 'Sign in to access your isolated cloud data' : 'Register a new LIFE//OS account in Firebase'}
                  </p>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/5 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    clearError();
                  }}
                  className={`py-2 rounded-lg font-semibold transition-all ${
                    mode === 'signin'
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
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
                  className={`py-2 rounded-lg font-semibold transition-all ${
                    mode === 'signup'
                      ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="flex items-center space-x-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/10 text-sm font-medium transition-all group"
              >
                <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
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
                <span className="group-hover:text-cyan-300">Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#0a0d14] px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">OR EMAIL LOGIN</span>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3.5 font-mono">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Callsign / Username
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={inputCallsign}
                        onChange={(e) => setInputCallsign(e.target.value)}
                        placeholder="e.g. CYBER_NEXUS"
                        className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="operator@lifeos.net"
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 mt-2 bg-cyan-500 hover:bg-cyan-400 text-black font-semibold font-mono tracking-wider text-xs uppercase"
                >
                  {isSubmitting ? (
                    'TRANSMITTING...'
                  ) : mode === 'signin' ? (
                    <>
                      <LogIn className="w-4 h-4 mr-2 inline" /> INITIATE SESSION
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4 mr-2 inline" /> REGISTER OPERATOR
                    </>
                  )}
                </Button>
              </form>

              {/* Guest Access Link */}
              <div className="pt-3 border-t border-white/5 text-center">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isSubmitting}
                  className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center space-x-1 font-mono"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Instant Guest Access (Demo Session)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Security Architecture & Specification */}
        <div className="lg:col-span-6 space-y-6 font-mono">
          <div className="p-6 rounded-2xl bg-[#0a0d14] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white tracking-wider flex items-center gap-2 border-b border-white/10 pb-3">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>DATA ISOLATION & SECURITY SPECIFICATION</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">1. Per-User UID Document Scoping</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    All tasks, character statistics, badges, inventory items, and profiles are mapped directly to your unique Firebase UID (<code className="text-cyan-300">users/{'{userId}'}</code>). No cross-user access or data leakage is possible.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <RefreshCw className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">2. Reactive Real-Time Cloud Sync</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Changes made to quests, levels, gold, or equipment are instantaneously pushed via encrypted web sockets to cloud Firestore, keeping your session synced across browsers and devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                <Users className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white mb-0.5">3. Multi-Profile Name Architecture</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Create multiple agent profile names (Callsigns) under a single authenticated account. Switch character builds on demand with state preservation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-xs text-cyan-200/80 leading-relaxed">
            <span className="font-bold text-cyan-400 block mb-1">⚡ SECURITY COMPLIANCE NOTE</span>
            LIFE//OS uses standard Firebase Identity Tokens (JWT) for session management. Passwords are never stored on client devices or plain-text servers.
          </div>
        </div>
      </div>
    </div>
  );
};
