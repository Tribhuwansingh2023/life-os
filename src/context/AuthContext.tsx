import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { gameService } from '../services/gameService';

export interface AuthContextValue {
  user: User | null;
  callsign: string;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, callsign: string) => Promise<void>;
  signInAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [callsign, setCallsign] = useState<string>('Operator-01');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const derivedCallsign =
          currentUser.displayName ||
          currentUser.email?.split('@')[0] ||
          (currentUser.isAnonymous ? 'Guest-Agent' : 'Operator');
        setCallsign(derivedCallsign);
        // Bind player game service to this user's isolated cloud document
        await gameService.bindUser(currentUser.uid, derivedCallsign);
      } else {
        setCallsign('Operator-01');
        // Unbind / fallback to local demo
        gameService.bindUser(null, 'Operator-01');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user.displayName) {
        setCallsign(result.user.displayName);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setError(err.message || 'Google authentication failed');
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      if (res.user.displayName) {
        setCallsign(res.user.displayName);
      }
    } catch (err: any) {
      console.error('Email sign-in failed:', err);
      setError(err.message || 'Invalid email or password');
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, desiredCallsign: string) => {
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      const cleanCallsign = desiredCallsign.trim() || 'Operator';
      await updateProfile(res.user, { displayName: cleanCallsign });
      setCallsign(cleanCallsign);
    } catch (err: any) {
      console.error('Email sign-up failed:', err);
      setError(err.message || 'Account registration failed');
      throw err;
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    try {
      const res = await signInAnonymously(auth);
      const guestCallsign = `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
      await updateProfile(res.user, { displayName: guestCallsign });
      setCallsign(guestCallsign);
    } catch (err: any) {
      console.warn('Firebase anonymous auth not yet enabled in console, deploying resilient local guest agent:', err);
      const fallbackUid = `guest_${Date.now()}`;
      const guestCallsign = `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
      setCallsign(guestCallsign);
      setUser({
        uid: fallbackUid,
        displayName: guestCallsign,
        isAnonymous: true,
        email: null,
        emailVerified: false
      } as any);
      await gameService.bindUser(fallbackUid, guestCallsign);
    }
  };

  const signOut = async () => {
    setError(null);
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.warn('Sign-out notice:', err);
    }
    setUser(null);
    setCallsign('Operator-01');
    gameService.bindUser(null, 'Operator-01');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        callsign,
        loading,
        error,
        clearError,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signInAsGuest,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
