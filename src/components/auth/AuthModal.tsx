import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, User as UserIcon, LogIn, UserPlus, Sparkles, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest, error, clearError } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [callsign, setCallsign] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    clearError();
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, callsign);
      }
      onClose();
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
      onClose();
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
      onClose();
    } catch {
      // Handled
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md p-6 overflow-hidden rounded-2xl bg-[#0a0d14] border border-cyan-500/30 shadow-2xl shadow-cyan-950/40 text-slate-100"
        >
          {/* Top glowing edge bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-400" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center space-x-3 mb-6">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-wider uppercase font-mono text-cyan-400">
                {mode === 'signin' ? 'OPERATOR LOGIN' : 'RECRUIT OPERATOR'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'signin'
                  ? 'Authenticate to sync cloud progression & inventory'
                  : 'Establish a new LIFE//OS player record in Firestore'}
              </p>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 mb-5 bg-white/5 rounded-xl border border-white/5 text-xs font-mono">
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

          {/* Error Banner */}
          {error && (
            <div className="flex items-center space-x-2 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="flex items-center justify-center w-full py-2.5 px-4 mb-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/40 hover:bg-white/10 text-sm font-medium transition-all group"
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

          <div className="relative flex items-center justify-center my-4">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-[#0a0d14] px-3 text-[10px] font-mono uppercase tracking-widest text-slate-400">OR EMAIL CREDENTIALS</span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
                  Operator Callsign
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={callsign}
                    onChange={(e) => setCallsign(e.target.value)}
                    placeholder="e.g. CYBER_NEXUS"
                    className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
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
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
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
                  className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
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
                  <UserPlus className="w-4 h-4 mr-2 inline" /> ENLIST OPERATOR
                </>
              )}
            </Button>
          </form>

          {/* Quick guest bypass for hackathon judges */}
          <div className="mt-4 pt-3 border-t border-white/5 text-center">
            <button
              type="button"
              onClick={handleGuestSignIn}
              disabled={isSubmitting}
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors inline-flex items-center space-x-1 font-mono"
            >
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>Instant Guest Agent Access (No Sign-Up)</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
