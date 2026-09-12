import React from 'react';
import { ActiveTab, PlayerProfile } from '../../types';
import {
  LayoutDashboard,
  Swords,
  User,
  Globe2,
  Sparkles,
  History,
  ShoppingBag,
  Settings,
  Shield,
  Coins,
  Flame,
  Volume2,
  VolumeX,
  Compass
} from 'lucide-react';
import { audioService } from '../../services/audioService';

interface SidebarProps {
  currentTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  player: PlayerProfile;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

interface NavItem {
  tab: ActiveTab;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  player,
  soundEnabled,
  onToggleSound
}) => {
  const navItems: NavItem[] = [
    {
      tab: 'landing',
      label: 'Landing & Story',
      icon: <Compass className="w-4 h-4" />,
      badge: 'STORY'
    },
    {
      tab: 'dashboard',
      label: 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      tab: 'quests',
      label: 'Quests',
      icon: <Swords className="w-4 h-4" />
    },
    {
      tab: 'character',
      label: 'Character & Build',
      icon: <User className="w-4 h-4" />
    },
    {
      tab: 'world',
      label: 'World Map',
      icon: <Globe2 className="w-4 h-4" />
    },
    {
      tab: 'oracle',
      label: 'Oracle (AI GM)',
      icon: <Sparkles className="w-4 h-4" />,
      badge: 'LIVE'
    },
    {
      tab: 'replay',
      label: 'Weekly Replay',
      icon: <History className="w-4 h-4" />
    },
    {
      tab: 'inventory',
      label: 'Inventory & Armory',
      icon: <ShoppingBag className="w-4 h-4" />
    },
    {
      tab: 'settings',
      label: 'System Settings',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen bg-[#07090e] border-r border-white/[0.08] p-4 select-none shrink-0 sticky top-0">
      {/* Brand Header */}
      <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/[0.06]">
        <div
          onClick={() => {
            audioService.playTactileClick();
            onSelectTab('landing');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Return to Landing Page & Overview"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-black font-mono font-black text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:scale-105 transition-transform">
            //
          </div>
          <div>
            <h1 className="font-mono font-extrabold text-white tracking-widest text-base group-hover:text-cyan-300 transition-colors">
              LIFE<span className="text-cyan-400">//OS</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-mono tracking-wider">
              VER 2.4 // OVERVIEW
            </p>
          </div>
        </div>

        {/* Tactile Audio Mute Toggle */}
        <button
          onClick={onToggleSound}
          title={soundEnabled ? 'Disable Audio Synthesizer' : 'Enable Audio Synthesizer'}
          className={`p-1.5 rounded-lg border transition-colors ${
            soundEnabled
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
              : 'bg-slate-900 border-white/10 text-slate-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Stack */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        <span className="px-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
          NAVIGATION PROTOCOLS
        </span>

        {navItems.map((item) => {
          const isActive = currentTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => {
                audioService.playTactileClick();
                onSelectTab(item.tab);
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-mono text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.15)] translate-x-1'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04] border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-cyan-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[9px] bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded border border-violet-500/30 font-bold animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Player Compact Footer Card */}
      <div
        onClick={() => {
          audioService.playTactileClick();
          onSelectTab('character');
        }}
        className="mt-4 pt-3 border-t border-white/[0.08] bg-[#0c1017] hover:bg-[#111724] border border-white/[0.06] rounded-xl p-3 cursor-pointer transition-colors"
      >
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-[#07090e] border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shrink-0">
            {player.level}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-mono font-bold text-white truncate">
              {player.username}
            </h4>
            <span className="text-[10px] text-slate-400 truncate block">
              {player.characterClass}
            </span>
          </div>
        </div>

        {/* Mini XP progress */}
        <div className="w-full bg-[#07090e] rounded-full h-1.5 overflow-hidden border border-white/[0.04] mb-2">
          <div
            className="h-full bg-cyan-400"
            style={{ width: `${Math.round((player.currentXp / player.nextLevelXp) * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1 text-amber-300">
            <Coins className="w-3 h-3 text-amber-400" />
            {player.gold}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Flame className="w-3 h-3" />
            {player.streakDays}d
          </span>
          <span className="text-cyan-400 font-bold">
            {player.momentum}%
          </span>
        </div>
      </div>
    </aside>
  );
};
