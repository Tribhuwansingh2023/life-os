import React from 'react';
import { RouterProvider } from '@tanstack/react-router';
import { GameStateProvider } from './context/GameStateContext';
import { SoundProvider } from './context/SoundContext';
import { router } from './router';

export default function App() {
  return (
    <GameStateProvider>
      <SoundProvider>
        <RouterProvider router={router} />
      </SoundProvider>
    </GameStateProvider>
  );
}
