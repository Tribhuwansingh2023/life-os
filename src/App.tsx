import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GameStateProvider } from './context/GameStateContext';
import { SoundProvider } from './context/SoundContext';
import { router } from './router';
import { NeuralLinkLoader } from './components/auth/NeuralLinkLoader';

function ApplicationRouter() {
  const { authState } = useAuth();

  // State 1: Loading & Cloud Hydration
  if (authState === 'AUTH_LOADING') {
    return <NeuralLinkLoader />;
  }

  // Render full application router — Landing page is rendered by default at '/'
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

