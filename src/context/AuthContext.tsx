import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut as fbSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { gameService } from '../services/gameService';

export type AuthState = 'AUTH_LOADING' | 'AUTHENTICATED' | 'UNAUTHENTICATED';

export interface AuthContextValue {
  user: User | null;
  callsign: string;
  authState: AuthState;
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

function mapFirebaseError(err: any): string {
  if (!err) return 'An unknown authentication error occurred';
  const code = err.code || '';
  switch (code) {
    case 'auth/invalid-email':
      return 'OPERATOR_ID_INVALID: The provided email format is invalid.';
    case 'auth/user-not-found':
      return 'OPERATOR_NOT_FOUND: No neural profile found for this email identifier.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'AUTHENTICATION_FAILED: Invalid credentials or cipher key provided.';
    case 'auth/email-already-in-use':
      return 'ID_COLLISION: An operator account is already registered with this email address.';
    case 'auth/weak-password':
      return 'SECURITY_WARNING: Password cipher must be at least 6 characters.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'NEURAL_HANDSHAKE_CANCELLED: Authentication was cancelled before completion.';
    case 'auth/popup-blocked':
      return 'POPUP_BLOCKED: Please allow popups or try again — redirecting to Google login.';
    case 'auth/network-request-failed':
      return 'TELEMETRY_FAILURE: Network connection interrupted during authentication.';
    case 'auth/too-many-requests':
      return 'RATE_THROTTLED: Too many failed access attempts. System locked temporarily.';
    case 'auth/configuration-not-found':
      return 'AUTH_CONFIG_NOTICE: Firebase auth provider pending setup in Firebase Console. You can also launch guest protocol.';
    case 'auth/unauthorized-domain':
      return 'DOMAIN_NOT_AUTHORIZED: This app domain is not registered in Firebase Console → Authentication → Settings → Authorized Domains. Add your Vercel domain to fix this.';
    default:
      return err.message || 'Access synchronization failed.';
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [callsign, setCallsign] = useState<string>('Operator-01');
  const [authState, setAuthState] = useState<AuthState>('AUTH_LOADING');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const derivedCallsign =
          currentUser.displayName ||
          currentUser.email?.split('@')[0] ||
          (currentUser.isAnonymous ? 'Guest-Agent' : 'Operator');
        setCallsign(derivedCallsign);
        setAuthState('AUTHENTICATED');

        // Bind and strictly hydrate state from Firestore
        await gameService.bindUser(currentUser.uid, derivedCallsign);
      } else {
        // Check for active guest session
        const cachedGuestUid = typeof window !== 'undefined' ? sessionStorage.getItem('life_os_active_uid') : null;
        const cachedGuestCallsign = typeof window !== 'undefined' ? sessionStorage.getItem('life_os_active_callsign') : null;

        if (cachedGuestUid) {
          const guestCallsign = cachedGuestCallsign || 'Agent-Guest';
          setUser({
            uid: cachedGuestUid,
            displayName: guestCallsign,
            isAnonymous: true,
            email: null,
            emailVerified: false
          } as any);
          setCallsign(guestCallsign);
          setAuthState('AUTHENTICATED');
          await gameService.bindUser(cachedGuestUid, guestCallsign);
        } else {
          setUser(null);
          setCallsign('Operator-01');
          await gameService.bindUser(null, 'Operator-01');
          setAuthState('UNAUTHENTICATED');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle redirect result from Google Sign-In (fires after returning from Google OAuth)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user?.displayName) {
          setCallsign(result.user.displayName);
        }
      })
      .catch((err: any) => {
        if (err?.code !== 'auth/no-current-user') {
          console.error('Google redirect result error:', err);
          setError(mapFirebaseError(err));
        }
      });
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    setError(null);
    try {
      // Use redirect flow — works in all browsers, never blocked by popup blockers
      await signInWithRedirect(auth, googleProvider);
      // After redirect returns, onAuthStateChanged + getRedirectResult handle the result
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
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
      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
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
      const friendlyMsg = mapFirebaseError(err);
      setError(friendlyMsg);
      throw new Error(friendlyMsg);
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    const guestCallsign = `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await signInAnonymously(auth);
      await updateProfile(res.user, { displayName: guestCallsign });
      setCallsign(guestCallsign);
    } catch (err: any) {
      console.warn('Firebase anonymous auth fallback notice:', err);
      const fallbackUid = `guest_${Date.now()}`;
      const guestUser = {
        uid: fallbackUid,
        displayName: guestCallsign,
        isAnonymous: true,
        email: null,
        emailVerified: false
      } as any;
      setUser(guestUser);
      setCallsign(guestCallsign);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('life_os_active_uid', fallbackUid);
        sessionStorage.setItem('life_os_active_callsign', guestCallsign);
      }
      setAuthState('AUTHENTICATED');
      await gameService.bindUser(fallbackUid, guestCallsign);
    }
  };

  const signOut = async () => {
    setError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('life_os_active_uid');
      sessionStorage.removeItem('life_os_active_callsign');
    }
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.warn('Sign-out notice:', err);
    }
    setUser(null);
    setCallsign('Operator-01');
    await gameService.bindUser(null, 'Operator-01');
    setAuthState('UNAUTHENTICATED');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        callsign,
        authState,
        loading: authState === 'AUTH_LOADING',
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
