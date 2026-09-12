import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameStateContext';
import { useSound } from '../../context/SoundContext';
import { audioService } from '../../services/audioService';
import { ActiveTab } from '../../types';

// Layout Subcomponents
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ShortcutsModal } from './ShortcutsModal';

// Modals
import { CreateQuestModal } from '../quest/CreateQuestModal';
import { LevelUpModal } from '../rpg/LevelUpModal';
import { QuestCompleteModal } from '../quest/QuestCompleteModal';

interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const navigate = useNavigate();

  const {
    player,
    pendingLevelUp,
    dismissLevelUp,
    createQuest,
    lastCompletionEvent,
    dismissCompletionModal,
    rateQuestDifficulty
  } = useGame();

  const { soundEnabled, toggleSound } = useSound();
  const [isCreateQuestOpen, setIsCreateQuestOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Hash migration fallback for existing bookmarked sessions
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.startsWith('#/')) {
      const target = window.location.hash.slice(1);
      if (target && target !== '/') {
        navigate({ to: target as any });
      }
    }
  }, [navigate]);

  // Keyboard navigation & quick shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.key === '0') navigate({ to: '/' });
      if (e.key === '1') navigate({ to: '/command' });
      if (e.key === '2') navigate({ to: '/quests' });
      if (e.key === '3') navigate({ to: '/character' });
      if (e.key === '4') navigate({ to: '/world' });
      if (e.key === '5') navigate({ to: '/oracle' });
      if (e.key === '6') navigate({ to: '/replay' });
      if (e.key === '7') navigate({ to: '/inventory' });
      if (e.key === '8') navigate({ to: '/settings' });
      if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setIsCreateQuestOpen(true);
      }
      if (e.key === 'm' || e.key === 'M') {
        toggleSound();
      }
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate, toggleSound]);

  const isLandingPage = pathname === '/' || pathname === '/landing' || pathname === '' || pathname === '/#';

  // Map route path to active navigation tab
  const currentTab: ActiveTab = pathname === '/quests'
    ? 'quests'
    : pathname === '/character'
    ? 'character'
    : pathname === '/world'
    ? 'world'
    : pathname === '/oracle'
    ? 'oracle'
    : pathname === '/replay'
    ? 'replay'
    : pathname === '/inventory'
    ? 'inventory'
    : pathname === '/settings'
    ? 'settings'
    : isLandingPage
    ? 'landing'
    : 'dashboard';

  const navigateToTab = (tab: ActiveTab) => {
    const pathMap: Record<ActiveTab, string> = {
      landing: '/',
      dashboard: '/command',
      quests: '/quests',
      character: '/character',
      world: '/world',
      oracle: '/oracle',
      replay: '/replay',
      inventory: '/inventory',
      settings: '/settings',
      auth: '/auth'
    };
    navigate({ to: pathMap[tab] || '/command' });
  };

  // Full-bleed landing page bypass
  if (isLandingPage || currentTab === 'landing') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full min-h-screen"
        >
          {children || <Outlet />}
          <LevelUpModal levelUpEvent={pendingLevelUp} onDismiss={dismissLevelUp} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col lg:flex-row cyber-grid relative overflow-x-hidden" id="app-root-layout">
      {/* Subtle top ambient quantum scan indicator */}
      <motion.div
        key={`scan-${pathname}`}
        initial={{ scaleX: 0, opacity: 0.8 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-50 origin-left pointer-events-none"
      />

      {/* 1. Persistent Desktop Sidebar with subtle entrance */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex-shrink-0"
      >
        <Sidebar
          currentTab={currentTab}
          onSelectTab={navigateToTab}
          player={player}
          soundEnabled={soundEnabled}
          onToggleSound={toggleSound}
        />
      </motion.aside>

      {/* 2. Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        {/* Persistent Top Header with entrance */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          <Header
            currentTab={currentTab}
            player={player}
            onOpenCreateQuest={() => setIsCreateQuestOpen(true)}
            onOpenShortcuts={() => setIsShortcutsOpen(true)}
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
          />
        </motion.div>

        {/* Animated Screen Transition Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto" role="main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8, filter: 'blur(2px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
              transition={{
                duration: 0.2,
                ease: [0.25, 1, 0.5, 1]
              }}
              className="w-full h-full"
            >
              {children || <Outlet />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* 3. Mobile Bottom Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="lg:hidden"
      >
        <MobileNav
          currentTab={currentTab}
          onSelectTab={navigateToTab}
        />
      </motion.div>

      {/* Global Action Modals */}
      <CreateQuestModal
        isOpen={isCreateQuestOpen}
        onClose={() => setIsCreateQuestOpen(false)}
        onCreateQuest={(qData) => createQuest(qData)}
      />

      <LevelUpModal
        levelUpEvent={pendingLevelUp}
        onDismiss={dismissLevelUp}
      />

      <QuestCompleteModal
        isOpen={Boolean(lastCompletionEvent)}
        quest={lastCompletionEvent?.quest || null}
        xpEarned={lastCompletionEvent?.xpGained}
        goldEarned={lastCompletionEvent?.goldGained}
        momentumEarned={lastCompletionEvent?.momentumGained}
        bossDamageDealt={lastCompletionEvent?.bossDamageDealt}
        levelUpEvent={lastCompletionEvent?.leveledUp}
        onClose={dismissCompletionModal}
        onConfirmRating={(questId, rating, adjustments) => {
          rateQuestDifficulty(questId, rating, adjustments);
        }}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  );
};
