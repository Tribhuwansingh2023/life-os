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
  Users,
  Eye,
  EyeOff,
  Cpu,
  Radio,
  Zap,
  Check
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
    <div className="max-w-6xl mx-auto space-y-8 pb-16 font-sans select-none">
      {/* Hero Header & Holographic Security HUD */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#060911] via-[#0b1021] to-[#120d29] border border-cyan-500/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.12)] backdrop-blur-xl"
      >
        {/* Glowing top line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-violet-500 to-amber-400 shadow-[0_0_15px_#00f0ff]" />

        {/* Ambient background glow orb */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>NEURAL IDENTITY & SECURITY MATRIX</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-mono font-extrabold text-white tracking-wider">
              AUTHENTICATION & DATA GUARDIAN
            </h1>

            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your real-world quests, level progression, and stats are protected by AES-256 cloud document isolation. Only authenticated session tokens can query or update your character ledger.
            </p>
          </div>

          {/* HUD Telemetry Bar */}
          <div className="grid grid-cols-2 gap-3 shrink-0 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-[#07090f]/90 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>CLOUD SYNC NODE</span>
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1 text-sm">
                <span className={`w-2 h-2 rounded-full ${syncStatus === 'synced' ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`} />
                {syncStatus === 'synced' ? 'FIRESTORE ACTIVE' : 'DEMO MODE'}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#07090f]/90 border border-cyan-500/20 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>ACTIVE SESSION</span>
              </div>
              <div className="text-cyan-300 font-bold text-sm truncate">
                {user ? callsign : 'UNAUTHENTICATED'}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Grid: Auth Form vs Security Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Auth Hub */}
        <motion.div
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 space-y-6"
        >
          {user ? (
            /* Active Authenticated Profile HUD Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#07090f]/95 border border-cyan-500/30 text-slate-100 shadow-2xl shadow-cyan-950/30 space-y-6 font-mono backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                    <UserIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase block">SESSION ACTIVE</span>
                    <h3 className="text-xl font-bold text-white tracking-wider">{callsign}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{user.email || (user.isAnonymous ? 'Guest Agent Session' : 'Google Authentication')}</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse" />
                  VERIFIED
                </span>
              </div>

              {/* Stats Matrix */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Active Character</span>
                  <span className="text-cyan-300 font-bold text-sm block truncate">{player.username}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Level & Class</span>
                  <span className="text-slate-200 font-bold text-sm block truncate">Lvl {player.level} {player.characterClass}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Profiles Saved</span>
                  <span className="text-amber-300 font-bold text-sm block">{profiles.length} Character Slots</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cloud Firestore Path</span>
                  <span className="text-slate-300 font-bold text-sm block truncate">users/{user.uid.slice(0, 10)}</span>
                </div>
              </div>

              {/* Logout Button */}
              <div className="pt-2">
                <Button
                  onClick={() => signOut()}
                  className="w-full py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-rose-950/40"
                >
                  <LogOut className="w-4 h-4 mr-2 inline text-rose-400" /> DISCONNECT SESSION PROTOCOL
                </Button>
              </div>
            </div>
          ) : (
            /* Unauthenticated Login / Register Form Card */
            <div className="p-6 sm:p-8 rounded-3xl bg-[#07090f]/95 border border-cyan-500/30 text-slate-100 shadow-2xl shadow-cyan-950/30 space-y-6 backdrop-blur-md relative overflow-hidden">
              {/* Corner accent glow */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Form Title & Switcher */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold font-mono text-cyan-400 tracking-wider uppercase">
                      {mode === 'signin' ? 'OPERATOR AUTHENTICATION' : 'RECRUIT NEW OPERATOR'}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {mode === 'signin' ? 'Access your cloud character ledger & tasks' : 'Establish a new LIFE//OS account in Firebase'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Segmented Mode Selector */}
              <div className="grid grid-cols-2 gap-1.5 p-1.5 bg-black/40 rounded-2xl border border-white/10 text-xs font-mono">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    clearError();
                  }}
                  className={`py-2.5 rounded-xl font-bold tracking-wider transition-all duration-200 ${
                    mode === 'signin'
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
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
                  className={`py-2.5 rounded-xl font-bold tracking-wider transition-all duration-200 ${
                    mode === 'signup'
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/25 scale-[1.02]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  CREATE ACCOUNT
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="flex items-center justify-center w-full py-3 px-4 rounded-2xl bg-white/[0.04] border border-white/15 hover:border-cyan-500/50 hover:bg-white/[0.08] text-sm font-semibold transition-all group shadow-md"
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
                  Authenticate with Google
                </span>
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-white/10 w-full" />
                <span className="bg-[#07090f] px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">
                  OR CREDENTIAL SIGN IN
                </span>
              </div>

              {/* Email / Password Form */}
              <form onSubmit={handleSubmit} className="space-y-4 font-mono">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1.5 font-bold">
                      Operator Callsign Name
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
                    Security Password
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
                      className="absolute right-3.5 top-3 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 mt-2 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-extrabold font-mono tracking-widest text-xs uppercase shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01]"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" /> TRANSMITTING...
                    </span>
                  ) : mode === 'signin' ? (
                    <span className="flex items-center justify-center gap-2">
                      <LogIn className="w-4 h-4" /> INITIATE OPERATOR SESSION
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <UserPlus className="w-4 h-4" /> ENLIST NEW OPERATOR
                    </span>
                  )}
                </Button>
              </form>

              {/* Instant Guest Demo Card */}
              <div className="pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleGuestSignIn}
                  disabled={isSubmitting}
                  className="w-full p-3 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
                  <span>INSTANT GUEST AGENT ACCESS (DEMO SESSION)</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Right Column: Cyberpunk Security Specifications & Cloud Live Status */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-6 space-y-6 font-mono"
        >
          {/* Card 1: Data Security Architecture */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#07090f]/95 border border-white/10 space-y-5 shadow-2xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5 text-cyan-400 font-bold text-base tracking-wider uppercase">
                <Database className="w-5 h-5 text-cyan-400" />
                <span>CLOUD DATA GUARDIAN MATRIX</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">AES-256</span>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Strict Document Isolation</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Every user receives an isolated Firestore document at <code className="text-cyan-300">users/{'{userId}'}</code>. Other operators cannot read or alter your tasks or statistics.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Real-Time Cloud Socket Sync</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Completed quests, gold earnings, momentum, and item equips are instantly broadcast to Firestore. Your state is preserved seamlessly across devices.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Multi-Profile Callsign Matrix</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Create and switch multiple character names under your main account. Each character retains independent XP curves, classes, and quest ledgers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Security & Privacy Compliance Callout */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-950/30 via-[#07090f] to-violet-950/30 border border-cyan-500/30 text-xs text-cyan-200/90 space-y-2 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold uppercase tracking-wider text-xs">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>ZERO-KNOWLEDGE CREDENTIAL PROTOCOL</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Passwords and OAuth tokens are processed directly by Firebase Authentication standards. Plaintext credentials never touch client storage or local memory buffers.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
