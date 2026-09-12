import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ActiveTab, PlayerProfile } from '../../types';
import { Plus, Coins, Zap, Flame, Volume2, VolumeX, Keyboard, Compass } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  currentTab: ActiveTab;
  player: PlayerProfile;
  onOpenCreateQuest: () => void;
  onOpenShortcuts: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

const TAB_TITLES: Record<ActiveTab, { title: string; subtitle: string }> = {
  landing: {
    title: 'LANDING & PRODUCT STORY',
    subtitle: 'Turn progress into a world worth returning to — Life RPG showcase'
  },
  dashboard: {
    title: 'COMMAND CENTER',
    subtitle: 'High-leverage operations & life biospheric equilibrium'
  },
  quests: {
    title: 'QUEST MATRIX',
    subtitle: 'Turn real-life goals into quests, rewards, and progression.'
  },
  character: {
    title: 'CHARACTER & BUILD',
    subtitle: 'Attributes, skill mastery trees, class evolutions & equipped relics'
  },
  world: {
    title: 'YOUR WORLD',
    subtitle: 'Every quest changes something. Your real-life progress shapes the world around you.'
  },
  oracle: {
    title: 'ORACLE AI GAME MASTER',
    subtitle: 'Your progress, analyzed. Your next move, recommended.'
  },
  replay: {
    title: 'WEEKLY REPLAY',
    subtitle: 'See what changed this week.'
  },
  inventory: {
    title: 'INVENTORY & ARMORY',
    subtitle: 'Your earned relics, equipment and progression rewards.'
  },
  settings: {
    title: 'SYSTEM CONFIGURATION',
    subtitle: 'Audio, accessibility, profile parameters and progress management.'
  }
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  player,
  onOpenCreateQuest,
  onOpenShortcuts,
  soundEnabled,
  onToggleSound
}) => {
  const navigate = useNavigate();
  const currentInfo = TAB_TITLES[currentTab] || { title: 'COMMAND CENTER', subtitle: 'LIFE//OS' };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#07090e]/90 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Title & context */}
      <div>
        <h2 className="text-base sm:text-lg font-mono font-bold text-white tracking-wider flex items-center gap-2">
          <span className="w-1.5 h-3.5 bg-cyan-400 rounded-xs shadow-[0_0_8px_#00f0ff]" />
          {currentInfo.title}
        </h2>
        <p className="hidden sm:block text-xs text-slate-400 font-sans mt-0.5">
          {currentInfo.subtitle}
        </p>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick link to Landing Page / Overview */}
        <button
          onClick={() => navigate({ to: '/' })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e121a] hover:bg-[#141d2e] border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors font-mono text-xs"
          title="Open Landing Page & Story"
        >
          <Compass className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Landing Page</span>
        </button>
        {/* Quick Gold display */}
        <div className="hidden md:flex items-center gap-1.5 bg-[#0e121a] border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-mono">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-amber-300 font-bold tabular-nums">
            {player.gold.toLocaleString()}
          </span>
          <span className="text-[10px] text-amber-500">G</span>
        </div>

        {/* Quick Momentum display */}
        <div className="hidden sm:flex items-center gap-1.5 bg-[#0e121a] border border-cyan-500/30 px-3 py-1.5 rounded-lg text-xs font-mono">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-cyan-300 font-bold tabular-nums">
            {player.momentum}%
          </span>
        </div>

        {/* Mobile sound toggle */}
        <button
          onClick={onToggleSound}
          className="lg:hidden p-2 rounded-lg bg-[#0e121a] border border-white/10 text-slate-400 hover:text-white"
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Keyboard shortcut trigger */}
        <button
          onClick={onOpenShortcuts}
          title="Keyboard shortcuts (?)"
          className="hidden sm:flex items-center gap-1 p-2 rounded-lg bg-[#0e121a] border border-white/10 text-slate-400 hover:text-white font-mono text-xs"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard className="w-4 h-4" />
          <kbd className="text-[10px] bg-black/40 px-1 rounded border border-white/10">?</kbd>
        </button>

        {/* Create quest button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={onOpenCreateQuest}
        >
          <span className="hidden sm:inline">CREATE</span> QUEST
        </Button>
      </div>
    </header>
  );
};
