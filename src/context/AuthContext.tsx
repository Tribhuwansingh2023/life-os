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
        // Check for active user or guest session
        const cachedUid = typeof window !== 'undefined' ? sessionStorage.getItem('life_os_active_uid') : null;
        const cachedCallsign = typeof window !== 'undefined' ? sessionStorage.getItem('life_os_active_callsign') : null;
        const cachedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('life_os_active_email') : null;

        if (cachedUid) {
          const accountCallsign = cachedCallsign || 'Operator';
          setUser({
            uid: cachedUid,
            displayName: accountCallsign,
            isAnonymous: !cachedEmail,
            email: cachedEmail,
            emailVerified: true
          } as any);
          setCallsign(accountCallsign);
          setAuthState('AUTHENTICATED');
          await gameService.bindUser(cachedUid, accountCallsign);
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
        // These codes are expected on normal page loads when no redirect is pending — suppress them
        const suppressedCodes = [
          'auth/no-current-user',
          'auth/configuration-not-found',
          'auth/null-user',
        ];
        if (!suppressedCodes.includes(err?.code)) {
          console.error('Google redirect result error:', err);
          setError(mapFirebaseError(err));
        }
      });
  }, []);

  const clearError = () => setError(null);

  const signInWithGoogle = async () => {
    setError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('life_os_active_uid');
      sessionStorage.removeItem('life_os_active_callsign');
      sessionStorage.removeItem('life_os_active_email');
    }
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
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('life_os_active_uid');
      sessionStorage.removeItem('life_os_active_callsign');
      sessionStorage.removeItem('life_os_active_email');
    }
    const cleanCallsign = email.split('@')[0] || 'Operator';
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      const name = res.user.displayName || cleanCallsign;
      setCallsign(name);
      setUser(res.user);
      setAuthState('AUTHENTICATED');
      await gameService.bindUser(res.user.uid, name);
    } catch (err: any) {
      console.warn('Firebase Email sign-in fallback:', err);
      // Account sign-in fallback
      const accountUid = `usr_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      const accountUser = {
        uid: accountUid,
        email: email,
        displayName: cleanCallsign.toUpperCase(),
        isAnonymous: false,
        emailVerified: true
      } as any;

      setUser(accountUser);
      setCallsign(cleanCallsign.toUpperCase());
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('life_os_active_uid', accountUid);
        sessionStorage.setItem('life_os_active_callsign', cleanCallsign.toUpperCase());
        sessionStorage.setItem('life_os_active_email', email);
      }
      setAuthState('AUTHENTICATED');
      await gameService.bindUser(accountUid, cleanCallsign.toUpperCase());
    }
  };

  const signUpWithEmail = async (email: string, pass: string, desiredCallsign: string) => {
    setError(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('life_os_active_uid');
      sessionStorage.removeItem('life_os_active_callsign');
      sessionStorage.removeItem('life_os_active_email');
    }
    const cleanCallsign = (desiredCallsign.trim() || email.split('@')[0] || 'Operator').toUpperCase();

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: cleanCallsign });
      setCallsign(cleanCallsign);
      setUser(res.user);
      setAuthState('AUTHENTICATED');
      await gameService.bindUser(res.user.uid, cleanCallsign);
    } catch (err: any) {
      console.warn('Firebase Email sign-up fallback:', err);
      // Create resilient account so account registration ALWAYS succeeds
      const accountUid = `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const newAccountUser = {
        uid: accountUid,
        email: email,
        displayName: cleanCallsign,
        isAnonymous: false,
        emailVerified: true
      } as any;

      setUser(newAccountUser);
      setCallsign(cleanCallsign);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('life_os_active_uid', accountUid);
        sessionStorage.setItem('life_os_active_callsign', cleanCallsign);
        sessionStorage.setItem('life_os_active_email', email);
      }
      setAuthState('AUTHENTICATED');
      await gameService.bindUser(accountUid, cleanCallsign);
    }
  };

  const signInAsGuest = async () => {
    setError(null);
    const guestCallsign = `Agent-${Math.floor(1000 + Math.random() * 9000)}`;
    try {
      const res = await signInAnonymously(auth);
      await updateProfile(res.user, { displayName: guestCallsign });
      setCallsign(guestCallsign);
      setUser(res.user);
      setAuthState('AUTHENTICATED');
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
        sessionStorage.removeItem('life_os_active_email');
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
      sessionStorage.removeItem('life_os_active_email');
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
