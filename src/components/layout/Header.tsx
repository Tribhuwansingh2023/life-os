import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ActiveTab, PlayerProfile } from '../../types';
import { Plus, Coins, Zap, Volume2, VolumeX, Keyboard, Compass, Shield, LogOut, Users, UserPlus, Check, ChevronDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useGame } from '../../context/GameStateContext';
import { AuthModal } from '../auth/AuthModal';

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
  },
  auth: {
    title: 'OPERATOR AUTHENTICATION',
    subtitle: 'Sign in, register, or sync your LIFE//OS cloud progression.'
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
  const { user, callsign, signOut } = useAuth();
  const { syncStatus, getProfiles, switchProfile, createNewProfile } = useGame();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileClass, setNewProfileClass] = useState('Quantum Architect');

  const currentInfo = TAB_TITLES[currentTab] || { title: 'COMMAND CENTER', subtitle: 'LIFE//OS' };
  const profiles = getProfiles ? getProfiles() : [];

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfileName.trim()) return;
    if (createNewProfile) {
      createNewProfile(newProfileName.trim(), newProfileClass);
    }
    setNewProfileName('');
    setIsCreateProfileModalOpen(false);
    setIsProfileMenuOpen(false);
  };

  return (
    <>
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
          {/* Cloud Sync Status Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0a0d14] border border-white/10 text-[11px] font-mono"
            title={
              syncStatus === 'synced'
                ? 'All progress is synchronized with Firebase Firestore'
                : syncStatus === 'syncing'
                ? 'Writing state deltas to Firebase Firestore...'
                : 'Offline demo state'
            }
          >
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-emerald-400 shadow-[0_0_6px_#10b981] animate-pulse'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-400 shadow-[0_0_6px_#f59e0b] animate-spin'
                  : syncStatus === 'error'
                  ? 'bg-rose-500 shadow-[0_0_6px_#f43f5e]'
                  : 'bg-slate-500'
              }`}
            />
            <span className="hidden xl:inline text-slate-300">
              {syncStatus === 'synced' ? 'CLOUD SYNCED' : syncStatus === 'syncing' ? 'SYNCING...' : 'LOCAL'}
            </span>
          </div>

          {/* Operator Auth & Profile Switcher Dropdown */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0e121a] hover:bg-[#141c2b] border border-cyan-500/30 font-mono text-xs transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#00f0ff]" />
                <span className="text-cyan-300 font-bold max-w-[110px] truncate">
                  {player.username || callsign}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                  Lvl {player.level}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 p-2 rounded-xl bg-[#0a0d14] border border-cyan-500/30 shadow-2xl z-50 font-mono text-xs text-slate-200">
                  <div className="px-2 py-1.5 border-b border-white/10 text-[10px] uppercase text-cyan-400 font-bold flex items-center justify-between">
                    <span>ACCOUNT PROFILES ({profiles.length})</span>
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                  </div>

                  <div className="my-1.5 max-h-48 overflow-y-auto space-y-1">
                    {profiles.map((p) => {
                      const isActive = p.id === player.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            if (switchProfile) switchProfile(p.id);
                            setIsProfileMenuOpen(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg flex items-center justify-between transition-all ${
                            isActive
                              ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300'
                              : 'hover:bg-white/5 border border-transparent text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              {isActive && <Check className="w-3 h-3 text-cyan-400" />}
                              <span>{p.username}</span>
                            </div>
                            <div className="text-[10px] text-slate-400">{p.characterClass} • Lvl {p.level}</div>
                          </div>
                          {isActive && <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-400/20 text-cyan-300 font-bold">ACTIVE</span>}
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-1 border-t border-white/10 space-y-1">
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        setIsCreateProfileModalOpen(true);
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-left flex items-center gap-1.5 transition-colors"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>+ Create Profile Name</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        signOut();
                      }}
                      className="w-full py-1.5 px-2 rounded-lg hover:bg-rose-500/10 text-rose-400 text-left flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out Operator</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono text-xs tracking-wider transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>SIGN IN</span>
            </button>
          )}

          {/* Quick link to Landing Page */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0e121a] hover:bg-[#141d2e] border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 transition-colors font-mono text-xs"
            title="Open Landing Page & Story"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">Landing</span>
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

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Create Profile Name Modal */}
      {isCreateProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-sm p-5 rounded-2xl bg-[#0a0d14] border border-cyan-500/30 text-slate-100 font-mono shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <UserPlus className="w-4 h-4" />
                <span>CREATE PROFILE NAME</span>
              </div>
              <button
                onClick={() => setIsCreateProfileModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProfile} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                  Profile / Callsign Name
                </label>
                <input
                  type="text"
                  required
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="e.g. CYBER_SHAMAN"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-cyan-500 focus:outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                  Character Class
                </label>
                <select
                  value={newProfileClass}
                  onChange={(e) => setNewProfileClass(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d121d] border border-white/10 rounded-xl text-sm focus:border-cyan-500 focus:outline-none text-slate-100"
                >
                  <option value="Quantum Architect">Quantum Architect</option>
                  <option value="Neural Specialist">Neural Specialist</option>
                  <option value="Cyber Shaman">Cyber Shaman</option>
                  <option value="Bio-Hacker">Bio-Hacker</option>
                  <option value="Void Vanguard">Void Vanguard</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateProfileModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-xs text-slate-400 hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold uppercase"
                >
                  Create Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

