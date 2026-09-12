import React, { useState, useEffect } from 'react';
import {
  PlayerProfile,
  Quest,
  AttributeInfo,
  InventoryItem,
  Badge,
  WorldRegion,
  OracleInsight
} from '../types';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ShortcutsModal } from '../components/layout/ShortcutsModal';
import { ProfileManager } from '../components/profile/ProfileManager';
import { useSound } from '../context/SoundContext';
import {
  Volume2,
  VolumeX,
  Volume1,
  User,
  RotateCcw,
  Shield,
  Keyboard,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
  Ear,
  Activity,
  Play,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  X,
  Check,
  Award,
  Layers,
  Info,
  Server,
  Cpu,
  Database
} from 'lucide-react';

interface SettingsPageProps {
  player: PlayerProfile;
  quests?: Quest[];
  attributes?: Record<string, AttributeInfo>;
  inventory?: InventoryItem[];
  badges?: Badge[];
  regions?: WorldRegion[];
  oracle?: OracleInsight;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
  onUpdateUsername: (name: string) => void;
  onResetData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  player,
  quests = [] as Quest[],
  attributes = {} as Record<string, AttributeInfo>,
  inventory = [] as InventoryItem[],
  badges = [] as Badge[],
  regions = [] as WorldRegion[],
  oracle: _oracle,
  onUpdateUsername,
  onResetData
}) => {
  // Callsign state
  const [nameInput, setNameInput] = useState(player.username);
  const [isCallsignUpdated, setIsCallsignUpdated] = useState(false);

  // Audio advanced diagnostics toggle
  const [showAdvancedAudio, setShowAdvancedAudio] = useState(false);
  const [lastAuditioned, setLastAuditioned] = useState<string | null>(null);

  // Modals & confirmation dialogs
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isShortcutModalOpen, setIsShortcutModalOpen] = useState(false);

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  // Sound & sensory context
  const {
    soundEnabled,
    toggleSound,
    uiSoundsEnabled,
    toggleUiSounds,
    volume,
    setVolume,
    prefersReducedMotion,
    respectReducedMotion,
    toggleRespectReducedMotion,
    forceReducedMotionOverride,
    setForceReducedMotionOverride,
    isMotionReduced,
    playTactileClick,
    playQuestComplete,
    playLevelUp,
    playGoldPurchase,
    playBossHit,
    playTabSwitch,
    playToggle,
    playSuccess,
    playItemEquip,
    playNotification
  } = useSound();

  // Sync name input if player.username updates externally (e.g., reset)
  useEffect(() => {
    setNameInput(player.username);
  }, [player.username]);

  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 3800);
  };

  // Callsign update handler
  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    if (trimmed === player.username && isCallsignUpdated) return;

    onUpdateUsername(trimmed);
    setIsCallsignUpdated(true);
    showToast('✓ CALLSIGN UPDATED', 'success');
    setTimeout(() => setIsCallsignUpdated(false), 3500);
  };

  // Sound audition handler
  const handleAudition = (name: string, soundFn: () => void) => {
    soundFn();
    setLastAuditioned(name);
    setTimeout(() => {
      setLastAuditioned((prev) => (prev === name ? null : prev));
    }, 1200);
  };

  // Safe reset confirmation execution
  const handleConfirmReset = () => {
    onResetData();
    setIsResetModalOpen(false);
    showToast('Progress reset successfully.', 'success');
  };

  // Derived application stats for status & progress
  const activeQuestsCount = quests.filter((q: Quest) => q.status === 'active').length;
  const completedQuestsCount = quests.filter((q: Quest) => q.status === 'completed').length;
  const equippedRelicsCount = inventory.filter((i: InventoryItem) => i.equipped).length;
  const unlockedBadgesCount = badges.filter((b: Badge) => b.unlocked).length;
  const masteredTerritoriesCount = regions.filter((r: WorldRegion) => r.status === 'mastered' || (r.influenceScore ?? 0) >= 90).length;

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto px-1 sm:px-2 font-mono" id="system-settings-view">
      {/* Toast Feedback Notification */}
      {toastMessage && (
        <div
          role="alert"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl border backdrop-blur-md shadow-2xl transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
            toastMessage.type === 'success'
              ? 'bg-[#0a151b]/95 border-cyan-500/50 text-cyan-200 shadow-[0_0_25px_rgba(0,240,255,0.15)]'
              : toastMessage.type === 'warning'
              ? 'bg-[#181008]/95 border-amber-500/50 text-amber-200 shadow-[0_0_25px_rgba(245,158,11,0.15)]'
              : 'bg-[#10141f]/95 border-slate-600/50 text-slate-200'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-slate-400 shrink-0" />
          )}
          <span className="font-mono text-xs tracking-wide">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 p-1 rounded transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE HEADER & CONTROL ROOM BANNER                                         */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#0b1019] via-[#090d14] to-[#07090f] p-6 sm:p-7 rounded-2xl border border-white/[0.08] relative overflow-hidden shadow-xl">
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 right-32 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400 tracking-wider uppercase mb-1">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>LIFE//OS CONTROL ROOM</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white tracking-wider uppercase">
            SYSTEM SETTINGS
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1 max-w-xl leading-relaxed">
            Audio, accessibility, profile parameters and progress management.
          </p>
        </div>

        {/* Global Operational Status Pill */}
        <div className="relative z-10 flex items-center gap-3 bg-[#080d14] px-4 py-2.5 rounded-xl border border-white/[0.08] text-xs self-start sm:self-auto">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 block uppercase leading-none font-bold">
              STATUS
            </span>
            <span className="text-emerald-400 font-bold tracking-wide mt-0.5 block text-[11px]">
              ALL SYSTEMS OPERATIONAL
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 0. MULTI-PROFILE MANAGER                                                  */}
      {/* ========================================================================= */}
      <ProfileManager onShowToast={showToast} />

      {/* ========================================================================= */}
      {/* 1. SYSTEM SECTION (Audio, Accessibility, Keyboard Navigation)              */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            SYSTEM // AUDIO, ACCESSIBILITY & NAVIGATION
          </h2>
        </div>

        {/* 1.1 AUDIO & SOUND */}
        <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-5" id="audio-settings-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Volume2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AUDIO & SOUND
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Synthesizer audio engine and acoustic output levels.
                </p>
              </div>
            </div>

            <span
              className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
                soundEnabled
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-950/60 text-rose-400 border-rose-500/40'
              }`}
            >
              {soundEnabled ? 'ONLINE' : 'MUTED'}
            </span>
          </div>

          {/* Core Simple Audio Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Master Audio Toggle */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    Master Audio
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      soundEnabled
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900 text-slate-500 border border-white/10'
                    }`}
                  >
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Enable or mute all synthesized sound effects across LIFE//OS.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={toggleSound}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                    soundEnabled
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-sm'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  aria-pressed={soundEnabled}
                >
                  {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{soundEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
                </button>
              </div>
            </div>

            {/* Interaction Sounds Toggle */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    Interaction Sounds
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      uiSoundsEnabled && soundEnabled
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900 text-slate-500 border border-white/10'
                    }`}
                  >
                    {uiSoundsEnabled && soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Acoustic confirmation blips for clicks, switches, and cards.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={toggleUiSounds}
                  disabled={!soundEnabled}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all flex items-center justify-center gap-2 ${
                    !soundEnabled
                      ? 'bg-slate-900/40 border-white/5 text-slate-600 cursor-not-allowed'
                      : uiSoundsEnabled
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-sm'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  aria-pressed={uiSoundsEnabled}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{uiSoundsEnabled && soundEnabled ? 'INTERACTION: ON' : 'INTERACTION: OFF'}</span>
                </button>
              </div>
            </div>

            {/* Master Volume Gain Slider */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    Master Volume
                  </span>
                  <span className="text-cyan-400 font-mono font-bold text-xs">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Overall output gain across all synthesis channels (0–100%).
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center gap-2.5">
                  <Volume1 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    disabled={!soundEnabled}
                    className="w-full h-1.5 bg-[#121824] rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
                    aria-label="Master Volume 0 to 100%"
                  />
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                </div>

                <div className="flex justify-between gap-1 text-[9px] text-slate-400 font-mono">
                  {[0.25, 0.5, 0.75, 1.0].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => {
                        setVolume(step);
                        playTactileClick();
                      }}
                      disabled={!soundEnabled}
                      className={`px-2 py-0.5 rounded border transition-colors ${
                        Math.abs(volume - step) < 0.05
                          ? 'border-cyan-500/50 text-cyan-300 bg-cyan-950/50 font-bold'
                          : 'border-white/[0.06] hover:text-white hover:border-white/20'
                      } disabled:opacity-40 disabled:pointer-events-none`}
                    >
                      {Math.round(step * 100)}%
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible: Advanced Audio Diagnostics */}
          <div className="pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={() => setShowAdvancedAudio((prev) => !prev)}
              className="flex items-center justify-between w-full py-2 text-xs text-slate-400 hover:text-cyan-300 transition-colors font-mono"
              aria-expanded={showAdvancedAudio}
            >
              <div className="flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                <span className="font-bold uppercase tracking-wider text-slate-300">
                  ADVANCED AUDIO DIAGNOSTICS
                </span>
                <span className="text-[10px] text-slate-500 font-normal">
                  (Audition procedural synthesizers)
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-cyan-400">
                <span>{showAdvancedAudio ? 'COLLAPSE' : 'EXPAND'}</span>
                {showAdvancedAudio ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </div>
            </button>

            {showAdvancedAudio && (
              <div className="mt-3 p-4 rounded-xl bg-[#080c13] border border-white/[0.06] space-y-3 animate-in fade-in duration-200">
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                  Audition each real-time synthesizer waveform directly through your audio interface:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleAudition('click', playTactileClick)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'click'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-cyan-400 font-bold block mb-1">
                      TACTILE CLICK
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      {isMotionReduced && respectReducedMotion ? '440Hz Mellow Sine' : '800Hz–400Hz Ramp'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('quest', playQuestComplete)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'quest'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-emerald-400 font-bold block mb-1">
                      QUEST COMPLETE
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Ascending C-Maj Chime
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('level', playLevelUp)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'level'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-violet-400 font-bold block mb-1">
                      LEVEL UP
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      6-Note Filtered Arpeggio
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('gold', playGoldPurchase)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'gold'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-amber-400 font-bold block mb-1">
                      TREASURY GOLD
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Dual High-Sine Clink
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('boss', playBossHit)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'boss'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-rose-400 font-bold block mb-1">
                      BOSS STRIKE
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      {isMotionReduced && respectReducedMotion ? 'Low-Pass Sine' : 'Sub-bass Drop'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('tab', playTabSwitch)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'tab'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-sky-400 font-bold block mb-1">
                      TAB SWITCH
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Cybernetic Frequency Chirp
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('toggle', () => playToggle(true))}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'toggle'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-teal-400 font-bold block mb-1">
                      STATE TOGGLE
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Dual-State Active Pip
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('success', playSuccess)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'success'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-emerald-300 font-bold block mb-1">
                      SUCCESS CHORD
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Major Triad Affirmation
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('equip', () => playItemEquip(true))}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'equip'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-indigo-400 font-bold block mb-1">
                      ITEM EQUIP
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Metallic Latch & Shimmer
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAudition('notification', playNotification)}
                    disabled={!soundEnabled}
                    className={`p-3 rounded-xl border text-left transition-all font-mono ${
                      lastAuditioned === 'notification'
                        ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.3)]'
                        : 'bg-[#06090f] border-white/[0.06] hover:border-cyan-500/30'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="text-[10px] text-pink-400 font-bold block mb-1">
                      SYSTEM ALERT
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans block leading-tight">
                      Crystal Two-Tone Ping
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 1.2 ACCESSIBILITY */}
        <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-5" id="accessibility-settings-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Ear className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  ACCESSIBILITY
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Motion and acoustic sensory comfort options.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
              <span>SYSTEM MOTION:</span>
              <span className="text-cyan-300 font-bold">
                {prefersReducedMotion ? 'PREFERS REDUCED' : 'STANDARD'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Reduced Motion Toggle */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase">
                    Reduced Motion
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      isMotionReduced
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {isMotionReduced ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Minimize animations and motion effects across LIFE//OS.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/[0.04]">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForceReducedMotionOverride(!isMotionReduced);
                      playTactileClick();
                    }}
                    className={`flex-1 py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all ${
                      isMotionReduced
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                        : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                    aria-pressed={isMotionReduced}
                  >
                    {isMotionReduced ? 'REDUCED MOTION: ON' : 'REDUCED MOTION: OFF'}
                  </button>
                </div>

                {/* Sub-selector for manual mode */}
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1">
                  <span>DETECTION MODE:</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setForceReducedMotionOverride(null);
                        playTactileClick();
                      }}
                      className={`px-1.5 py-0.5 rounded border ${
                        forceReducedMotionOverride === null
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      AUTO
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForceReducedMotionOverride(true);
                        playTactileClick();
                      }}
                      className={`px-1.5 py-0.5 rounded border ${
                        forceReducedMotionOverride === true
                          ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      FORCE ON
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForceReducedMotionOverride(false);
                        playTactileClick();
                      }}
                      className={`px-1.5 py-0.5 rounded border ${
                        forceReducedMotionOverride === false
                          ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'border-white/[0.06] text-slate-400 hover:text-white'
                      }`}
                    >
                      FORCE OFF
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sound Sensitivity Toggle */}
            <div className="p-4 rounded-xl bg-[#080c13] border border-white/[0.06] flex flex-col justify-between gap-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-xs uppercase">
                    Sound Sensitivity
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      respectReducedMotion
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-900 text-slate-500 border border-white/10'
                    }`}
                  >
                    {respectReducedMotion ? 'ON' : 'OFF'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-sans mt-1 leading-relaxed">
                  Use softer interaction sounds and reduced acoustic intensity.
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.04]">
                <button
                  type="button"
                  onClick={toggleRespectReducedMotion}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-bold font-mono transition-all ${
                    respectReducedMotion
                      ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-sm'
                      : 'bg-slate-800/60 border-white/10 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                  aria-pressed={respectReducedMotion}
                >
                  {respectReducedMotion ? 'SOUND SENSITIVITY: ON' : 'SOUND SENSITIVITY: OFF'}
                </button>
                <span className="text-[9px] text-slate-500 font-mono block mt-1.5">
                  {respectReducedMotion
                    ? 'Non-jarring soft harmonic sines active for UI clicks.'
                    : 'Full dynamic range audio synthesis active.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 1.3 KEYBOARD NAVIGATION */}
        <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-4" id="keyboard-navigation-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Keyboard className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  KEYBOARD NAVIGATION
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Direct hotkeys for rapid workspace control.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsShortcutModalOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 text-xs font-mono flex items-center gap-1 transition-colors"
            >
              <span>VIEW GUIDE</span>
              <kbd className="bg-[#080c13] px-1.5 py-0.5 rounded border border-white/10 text-[10px] text-cyan-300">
                ?
              </kbd>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Command Center</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                1
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Quest Matrix</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                2
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Character & Build</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                3
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">World Map</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                4
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Oracle AI</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                5
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Toggle Sound</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                M
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Create Quest</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                Q
              </kbd>
            </div>
            <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.04] flex items-center justify-between">
              <span className="text-slate-300 font-sans text-xs">Shortcut Guide</span>
              <kbd className="bg-[#04060a] px-2.5 py-1 rounded-md border border-white/10 text-cyan-400 font-bold shadow-sm">
                ?
              </kbd>
            </div>
          </div>

          {/* Subtle Shortcut Guide Footer */}
          <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="text-cyan-400 font-bold">PRESS ?</span> TO VIEW SHORTCUT GUIDE
            </span>
            <button
              type="button"
              onClick={() => setIsShortcutModalOpen(true)}
              className="text-slate-400 hover:text-cyan-300 transition-colors self-start sm:self-auto underline decoration-dotted"
            >
              Open Interactive Hotkey Overlay
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PROFILE SECTION (Callsign & Identity)                                  */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
          <User className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            PROFILE // CALLSIGN & IDENTITY
          </h2>
        </div>

        <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-4" id="profile-settings-card">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  CALLSIGN & IDENTITY
                </h3>
                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                  Your designated operator identity across all game systems and telemetry.
                </p>
              </div>
            </div>

            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              RANK: {player.title || 'OPERATOR'}
            </span>
          </div>

          <form onSubmit={handleSaveName} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end">
              <div className="flex-1">
                <label
                  htmlFor="callsign-input"
                  className="block text-slate-400 text-[10px] uppercase mb-1.5 font-bold tracking-wider"
                >
                  CALLSIGN IDENTIFIER
                </label>
                <div className="relative">
                  <input
                    id="callsign-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      setIsCallsignUpdated(false);
                    }}
                    placeholder="ENTER CALLSIGN"
                    maxLength={24}
                    className="w-full bg-[#080c13] border border-white/[0.1] focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400/30 rounded-xl px-4 py-2.5 text-white font-mono text-sm uppercase tracking-wider transition-all placeholder-slate-600"
                  />
                  {nameInput.trim() !== player.username && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-amber-400 font-mono">
                      UNSAVED
                    </span>
                  )}
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                size="md"
                disabled={!nameInput.trim() || nameInput.trim() === player.username}
                className="font-mono text-xs px-5 py-2.5"
              >
                UPDATE CALLSIGN
              </Button>
            </div>

            {/* Inline Confirmation */}
            {isCallsignUpdated && (
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono pt-1 animate-in fade-in duration-150">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="font-bold">✓ CALLSIGN UPDATED</span>
                <span className="text-slate-400 font-sans text-[11px]">
                  — Synchronized across all headers, profile stats, and directives.
                </span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. DATA & PROGRESS SECTION (Progress Status & Safe Reset)                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
          <Database className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            DATA & PROGRESS // ARCHIVE & LIFECYCLE
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Progress Status Card */}
          <div className="lg:col-span-2 bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4" id="progress-status-card">
            <div>
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      PROGRESS STATUS
                    </h3>
                    <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                      Overview of current character advancement and world achievements.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 font-bold">
                  LEVEL {player.level}
                </span>
              </div>

              {/* Progress Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] text-slate-500 block uppercase">EXPERIENCE</span>
                  <span className="text-white font-bold text-sm block mt-0.5">
                    {(player?.currentXp ?? 0).toLocaleString()} <span className="text-[10px] text-slate-400">/ {(player?.nextLevelXp ?? 0).toLocaleString()}</span>
                  </span>
                  <span className="text-[9px] text-cyan-400 block mt-1">XP ACCUMULATED</span>
                </div>

                <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] text-slate-500 block uppercase">TREASURY</span>
                  <span className="text-amber-300 font-bold text-sm block mt-0.5">
                    {(player?.gold ?? 0).toLocaleString()} <span className="text-[10px] text-amber-500">G</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">GOLD RESERVES</span>
                </div>

                <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] text-slate-500 block uppercase">DIRECTIVES</span>
                  <span className="text-white font-bold text-sm block mt-0.5">
                    {completedQuestsCount} <span className="text-[10px] text-slate-400">COMPLETED</span>
                  </span>
                  <span className="text-[9px] text-cyan-400 block mt-1">{activeQuestsCount} ACTIVE NOW</span>
                </div>

                <div className="bg-[#080c13] p-3 rounded-xl border border-white/[0.05]">
                  <span className="text-[10px] text-slate-500 block uppercase">ARMORY & RELICS</span>
                  <span className="text-white font-bold text-sm block mt-0.5">
                    {equippedRelicsCount} <span className="text-[10px] text-slate-400">/ 4 EQUIPPED</span>
                  </span>
                  <span className="text-[9px] text-slate-400 block mt-1">{inventory.length} INDEXED</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-slate-500">
              <span>WORLD STATUS: {masteredTerritoriesCount} TERRITORIES MASTERED</span>
              <span>MILESTONES: {unlockedBadgesCount} BADGES VERIFIED</span>
            </div>
          </div>

          {/* Reset Progress Card (Safe & Restrained) */}
          <div className="bg-[#0c1017] border border-rose-500/20 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col justify-between space-y-4" id="reset-progress-card">
            <div>
              <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    RESET PROGRESS
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    Re-initialize experience and progress parameters.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Resets current level, XP, gold, quests, attributes, equipment, badges and world progression back to baseline parameters.
              </p>
            </div>

            <div className="pt-3 border-t border-white/[0.06]">
              <Button
                variant="danger"
                size="md"
                onClick={() => setIsResetModalOpen(true)}
                icon={<RotateCcw className="w-3.5 h-3.5" />}
                className="w-full font-mono text-xs"
              >
                RESET PROGRESS
              </Button>
              <span className="text-[9px] text-slate-500 font-mono block text-center mt-2">
                Requires explicit confirmation modal.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. SYSTEM STATUS SECTION (Operational Telemetry)                          */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b border-white/[0.06]">
          <Server className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
            SYSTEM STATUS // REAL-TIME SUBSYSTEM METRICS
          </h2>
        </div>

        <div className="bg-[#0c1017] border border-white/[0.08] rounded-xl p-5 sm:p-6 shadow-sm space-y-4" id="system-status-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                SYSTEM STATUS
              </h3>
              <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                Core runtime engine state verification and telemetry.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#080d14] px-3.5 py-1.5 rounded-lg border border-emerald-500/30 self-start sm:self-auto">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs text-emerald-400 font-bold font-mono tracking-wider">
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          {/* Compact System Subsystems Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs font-mono">
            {/* Audio Engine */}
            <div className="bg-[#080c13] p-3.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  AUDIO ENGINE
                </span>
                <span className="text-white font-bold block text-sm">
                  {soundEnabled ? 'ONLINE' : 'MUTED'}
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">OUTPUT GAIN</span>
                <span className="text-cyan-400 font-bold">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            {/* Quest Engine */}
            <div className="bg-[#080c13] p-3.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  QUEST ENGINE
                </span>
                <span className="text-emerald-400 font-bold block text-sm">
                  ONLINE
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">DIRECTIVES</span>
                <span className="text-cyan-400 font-bold">{quests.length} SYNCED</span>
              </div>
            </div>

            {/* Character Engine */}
            <div className="bg-[#080c13] p-3.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  CHARACTER ENGINE
                </span>
                <span className="text-emerald-400 font-bold block text-sm">
                  ONLINE
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">OPERATOR</span>
                <span className="text-cyan-400 font-bold">LVL {player.level}</span>
              </div>
            </div>

            {/* Oracle Engine */}
            <div className="bg-[#080c13] p-3.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  ORACLE ENGINE
                </span>
                <span className="text-emerald-400 font-bold block text-sm">
                  ONLINE
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">INTELLIGENCE</span>
                <span className="text-cyan-400 font-bold">CHRONOS</span>
              </div>
            </div>

            {/* Inventory Engine */}
            <div className="bg-[#080c13] p-3.5 rounded-xl border border-white/[0.06] flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block mb-1">
                  INVENTORY ENGINE
                </span>
                <span className="text-emerald-400 font-bold block text-sm">
                  ONLINE
                </span>
              </div>
              <div className="mt-3 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px]">
                <span className="text-slate-400">EQUIPPED</span>
                <span className="text-cyan-400 font-bold">{equippedRelicsCount} / 4</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. CONFIRMATION MODAL: RESET PROGRESS                                     */}
      {/* ========================================================================= */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        title="RESET LIFE//OS PROGRESS?"
        subtitle="Irreversible progression reset"
        maxWidth="md"
      >
        <div className="space-y-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-rose-950/25 border border-rose-500/40 text-rose-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="uppercase tracking-wider">CONFIRM DESTRUCTIVE ACTION</span>
            </div>
            <p className="text-xs font-sans text-slate-300 leading-relaxed">
              This will reset your current level, XP, gold, quests, attributes, equipment, badges and world progression.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#080c13] border border-white/[0.06] text-slate-400 text-[11px] font-sans leading-relaxed">
            All acquired armory relics, earned badges, completed habit directives, and territory influence scores will be restored to default seed parameters.
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsResetModalOpen(false)}
              className="font-mono text-xs"
            >
              CANCEL
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmReset}
              icon={<RotateCcw className="w-3.5 h-3.5" />}
              className="font-mono text-xs"
            >
              RESET PROGRESS
            </Button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. SHORTCUTS OVERLAY MODAL                                                */}
      {/* ========================================================================= */}
      <ShortcutsModal
        isOpen={isShortcutModalOpen}
        onClose={() => setIsShortcutModalOpen(false)}
      />
    </div>
  );
};
