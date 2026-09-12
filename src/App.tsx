import React, { useState } from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameStateProvider } from './context/GameStateContext';
import { SoundProvider } from './context/SoundContext';
import { router } from './router';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { NeuralLinkLoader } from './components/auth/NeuralLinkLoader';

function ApplicationRouter() {
  const { authState } = useAuth();
  const [showLandingShowcase, setShowLandingShowcase] = useState(false);

  // State 1: Loading & Cloud Hydration
  if (authState === 'AUTH_LOADING') {
    return <NeuralLinkLoader />;
  }

  // State 2: Unauthenticated Operator Access
  if (authState === 'UNAUTHENTICATED') {
    if (showLandingShowcase) {
      return (
        <LandingPage
          onEnterApp={() => setShowLandingShowcase(false)}
        />
      );
    }
    return (
      <AuthPage
        onViewLanding={() => setShowLandingShowcase(true)}
      />
    );
  }

  // State 3: Authenticated Operator Session (Render Full LIFE//OS App)
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AuthProvider>
      <GameStateProvider>
        <SoundProvider>
          <ApplicationRouter />
        </SoundProvider>
      </GameStateProvider>
    </AuthProvider>
  );
}
