import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode
} from 'react';
import { audioService } from '../services/audioService';
import { GameStateContext } from './GameStateContext';

export type AudioCueType =
  | 'click'
  | 'quest_complete'
  | 'level_up'
  | 'tab_switch'
  | 'modal_open'
  | 'modal_close'
  | 'toggle'
  | 'success'
  | 'error'
  | 'equip'
  | 'purchase'
  | 'boss_hit'
  | 'notification'
  | 'slider';

export interface SoundContextValue {
  // Master audio state
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;

  // Subtle UI interaction sounds (clicks, taps, button feedback)
  uiSoundsEnabled: boolean;
  setUiSoundsEnabled: (enabled: boolean) => void;
  toggleUiSounds: () => void;

  // Master volume level (0.0 to 1.0)
  volume: number;
  setVolume: (volume: number) => void;

  // Reduced motion detection & coordination
  prefersReducedMotion: boolean; // OS system preference
  respectReducedMotion: boolean; // Preference to soften/mute audio on reduced motion
  setRespectReducedMotion: (respect: boolean) => void;
  toggleRespectReducedMotion: () => void;
  forceReducedMotionOverride: boolean | null; // null = use OS, true = force reduced, false = force normal
  setForceReducedMotionOverride: (override: boolean | null) => void;
  isMotionReduced: boolean; // Effective reduced motion state

  // Synthesizer trigger methods
  playTactileClick: () => void;
  playQuestComplete: (tierOrDifficulty?: string) => void;
  playLevelUp: (level?: number) => void;
  playTabSwitch: () => void;
  playModalOpen: () => void;
  playModalClose: () => void;
  playToggle: (state?: boolean) => void;
  playSuccess: () => void;
  playError: () => void;
  playItemEquip: (isEquipping?: boolean) => void;
  playGoldPurchase: () => void;
  playBossHit: () => void;
  playNotification: () => void;
  playSliderTick: () => void;
  triggerAudioCue: (type: AudioCueType, payload?: unknown) => void;
}

const STORAGE_KEYS = {
  SOUND_ENABLED: 'life_os_sound_enabled',
  UI_SOUNDS_ENABLED: 'life_os_ui_sounds_enabled',
  VOLUME: 'life_os_sound_volume',
  RESPECT_REDUCED_MOTION: 'life_os_respect_reduced_motion',
  MOTION_OVERRIDE: 'life_os_motion_override'
};

const safelyGetItem = (key: string, defaultValue: string): string => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const val = localStorage.getItem(key);
    return val !== null ? val : defaultValue;
  } catch {
    return defaultValue;
  }
};

const safelySetItem = (key: string, value: string): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore restricted localStorage in sandboxes
  }
};

const SoundContext = createContext<SoundContextValue | undefined>(undefined);

// Internal bridge that monitors GameState changes and fires matching audio cues
const GameStateAudioBridge: React.FC<{
  onQuestComplete: (tierOrDifficulty?: string) => void;
  onLevelUp: (level?: number) => void;
}> = ({ onQuestComplete, onLevelUp }) => {
  const gameState = useContext(GameStateContext);

  const prevLevelRef = useRef<number | null>(null);
  const lastHandledEventRef = useRef<string | null>(null);
  const lastHandledLevelUpRef = useRef<string | null>(null);

  useEffect(() => {
    if (!gameState) return;

    // Track level changes
    const currentLevel = gameState.player?.level;
    if (currentLevel !== undefined) {
      if (prevLevelRef.current !== null && currentLevel > prevLevelRef.current) {
        onLevelUp(currentLevel);
      }
      prevLevelRef.current = currentLevel;
    }
  }, [gameState?.player?.level, onLevelUp]);

  useEffect(() => {
    if (!gameState) return;

    // Track level-up events
    if (gameState.pendingLevelUp) {
      const eventKey = `${gameState.pendingLevelUp.oldLevel}->${gameState.pendingLevelUp.newLevel}`;
      if (lastHandledLevelUpRef.current !== eventKey) {
        lastHandledLevelUpRef.current = eventKey;
        onLevelUp(gameState.pendingLevelUp.newLevel);
      }
    }
  }, [gameState?.pendingLevelUp, onLevelUp]);

  useEffect(() => {
    if (!gameState) return;

    // Track quest completion events
    if (gameState.lastCompletionEvent?.quest) {
      const eventId = `${gameState.lastCompletionEvent.quest.id}-${gameState.lastCompletionEvent.timestamp || ''}`;
      if (lastHandledEventRef.current !== eventId) {
        lastHandledEventRef.current = eventId;
        const diff = gameState.lastCompletionEvent.quest.difficulty || gameState.lastCompletionEvent.quest.type;
        onQuestComplete(diff);
      }
    }
  }, [gameState?.lastCompletionEvent, onQuestComplete]);

  return null;
};

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Sound Toggle
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    return safelyGetItem(STORAGE_KEYS.SOUND_ENABLED, 'true') === 'true';
  });

  // Subtle UI Interaction Sounds Toggle
  const [uiSoundsEnabled, setUiSoundsEnabledState] = useState<boolean>(() => {
    return safelyGetItem(STORAGE_KEYS.UI_SOUNDS_ENABLED, 'true') === 'true';
  });

  // Volume (0 to 1)
  const [volume, setVolumeState] = useState<number>(() => {
    const saved = parseFloat(safelyGetItem(STORAGE_KEYS.VOLUME, '0.8'));
    return isNaN(saved) ? 0.8 : Math.max(0, Math.min(1, saved));
  });

  // Respect Reduced Motion setting
  const [respectReducedMotion, setRespectReducedMotionState] = useState<boolean>(() => {
    return safelyGetItem(STORAGE_KEYS.RESPECT_REDUCED_MOTION, 'true') === 'true';
  });

  // Manual motion override (null = auto from OS, boolean = explicit override)
  const [forceReducedMotionOverride, setForceReducedMotionOverrideState] = useState<boolean | null>(() => {
    const saved = safelyGetItem(STORAGE_KEYS.MOTION_OVERRIDE, 'auto');
    if (saved === 'true') return true;
    if (saved === 'false') return false;
    return null;
  });

  // OS system prefers-reduced-motion media query detection
  const [systemReducedMotion, setSystemReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch {
      return false;
    }
  });

  // Effective reduced motion state
  const isMotionReduced = forceReducedMotionOverride !== null
    ? forceReducedMotionOverride
    : systemReducedMotion;

  // Listen for system media query changes
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setSystemReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setSystemReducedMotion(e.matches);
      };

      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      } else if (mediaQuery.addListener) {
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch {
      // Fallback gracefully
    }
  }, []);

  // Sync state to audioService singleton whenever any audio parameter changes
  useEffect(() => {
    audioService.setSoundEnabled(soundEnabled);
    audioService.setUiSoundsEnabled(uiSoundsEnabled);
    audioService.setVolume(volume);
    audioService.setRespectReducedMotion(respectReducedMotion);
    audioService.setReducedMotion(isMotionReduced);
  }, [soundEnabled, uiSoundsEnabled, volume, respectReducedMotion, isMotionReduced]);

  // Public state setter methods with persistence
  const setSoundEnabled = useCallback((enabled: boolean) => {
    setSoundEnabledState(enabled);
    safelySetItem(STORAGE_KEYS.SOUND_ENABLED, String(enabled));
    audioService.setSoundEnabled(enabled);
    if (enabled) {
      audioService.playTactileClick();
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabledState((prev) => {
      const next = !prev;
      safelySetItem(STORAGE_KEYS.SOUND_ENABLED, String(next));
      audioService.setSoundEnabled(next);
      if (next) {
        audioService.playTactileClick();
      }
      return next;
    });
  }, []);

  const setUiSoundsEnabled = useCallback((enabled: boolean) => {
    setUiSoundsEnabledState(enabled);
    safelySetItem(STORAGE_KEYS.UI_SOUNDS_ENABLED, String(enabled));
    audioService.setUiSoundsEnabled(enabled);
    if (enabled && soundEnabled) {
      audioService.playTactileClick();
    }
  }, [soundEnabled]);

  const toggleUiSounds = useCallback(() => {
    setUiSoundsEnabledState((prev) => {
      const next = !prev;
      safelySetItem(STORAGE_KEYS.UI_SOUNDS_ENABLED, String(next));
      audioService.setUiSoundsEnabled(next);
      if (next && soundEnabled) {
        audioService.playTactileClick();
      }
      return next;
    });
  }, [soundEnabled]);

  const setVolume = useCallback((vol: number) => {
    const clamped = Math.max(0, Math.min(1, vol));
    setVolumeState(clamped);
    safelySetItem(STORAGE_KEYS.VOLUME, String(clamped));
    audioService.setVolume(clamped);
  }, []);

  const setRespectReducedMotion = useCallback((respect: boolean) => {
    setRespectReducedMotionState(respect);
    safelySetItem(STORAGE_KEYS.RESPECT_REDUCED_MOTION, String(respect));
    audioService.setRespectReducedMotion(respect);
  }, []);

  const toggleRespectReducedMotion = useCallback(() => {
    setRespectReducedMotionState((prev) => {
      const next = !prev;
      safelySetItem(STORAGE_KEYS.RESPECT_REDUCED_MOTION, String(next));
      audioService.setRespectReducedMotion(next);
      return next;
    });
  }, []);

  const setForceReducedMotionOverride = useCallback((override: boolean | null) => {
    setForceReducedMotionOverrideState(override);
    if (override === null) {
      safelySetItem(STORAGE_KEYS.MOTION_OVERRIDE, 'auto');
    } else {
      safelySetItem(STORAGE_KEYS.MOTION_OVERRIDE, String(override));
    }
  }, []);

  // Audio trigger wrappers
  const playTactileClick = useCallback(() => {
    audioService.playTactileClick();
  }, []);

  const playQuestComplete = useCallback((tierOrDifficulty?: string) => {
    audioService.playQuestComplete(tierOrDifficulty);
  }, []);

  const playLevelUp = useCallback((level?: number) => {
    audioService.playLevelUp(level);
  }, []);

  const playTabSwitch = useCallback(() => {
    audioService.playTabSwitch();
  }, []);

  const playModalOpen = useCallback(() => {
    audioService.playModalOpen();
  }, []);

  const playModalClose = useCallback(() => {
    audioService.playModalClose();
  }, []);

  const playToggle = useCallback((state?: boolean) => {
    audioService.playToggle(state ?? true);
  }, []);

  const playSuccess = useCallback(() => {
    audioService.playSuccess();
  }, []);

  const playError = useCallback(() => {
    audioService.playError();
  }, []);

  const playItemEquip = useCallback((isEquipping?: boolean) => {
    audioService.playItemEquip(isEquipping ?? true);
  }, []);

  const playGoldPurchase = useCallback(() => {
    audioService.playGoldPurchase();
  }, []);

  const playBossHit = useCallback(() => {
    audioService.playBossHit();
  }, []);

  const playNotification = useCallback(() => {
    audioService.playNotification();
  }, []);

  const playSliderTick = useCallback(() => {
    audioService.playSliderTick();
  }, []);

  // Universal audio cue dispatcher
  const triggerAudioCue = useCallback(
    (type: AudioCueType, payload?: unknown) => {
      switch (type) {
        case 'click':
          audioService.playTactileClick();
          break;
        case 'quest_complete':
          audioService.playQuestComplete(typeof payload === 'string' ? payload : undefined);
          break;
        case 'level_up':
          audioService.playLevelUp(typeof payload === 'number' ? payload : undefined);
          break;
        case 'tab_switch':
          audioService.playTabSwitch();
          break;
        case 'modal_open':
          audioService.playModalOpen();
          break;
        case 'modal_close':
          audioService.playModalClose();
          break;
        case 'toggle':
          audioService.playToggle(typeof payload === 'boolean' ? payload : true);
          break;
        case 'success':
          audioService.playSuccess();
          break;
        case 'error':
          audioService.playError();
          break;
        case 'equip':
          audioService.playItemEquip(typeof payload === 'boolean' ? payload : true);
          break;
        case 'purchase':
          audioService.playGoldPurchase();
          break;
        case 'boss_hit':
          audioService.playBossHit();
          break;
        case 'notification':
          audioService.playNotification();
          break;
        case 'slider':
          audioService.playSliderTick();
          break;
        default:
          audioService.playTactileClick();
      }
    },
    []
  );

  // Global Delegated Interaction Listener
  // Ensures every button, tab, link, switch, and modal action provides immediate tactile feedback
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let lastClickTime = 0;
    let lastSliderTime = 0;

    const handleGlobalClick = (event: MouseEvent) => {
      if (!audioService.isSoundEnabled()) return;

      const target = event.target as HTMLElement | null;
      if (!target) return;

      // Check if click was already handled or prevented
      const now = performance.now();
      if (now - lastClickTime < 30) return;

      // Find closest interactive element
      const interactiveEl = target.closest<HTMLElement>(
        'button, a, [role="button"], [role="tab"], [role="switch"], [role="checkbox"], input[type="checkbox"], input[type="radio"], select, summary, [data-sound]'
      );

      if (!interactiveEl) return;

      // Respect explicit silence request
      const soundAttr = interactiveEl.getAttribute('data-sound');
      if (soundAttr === 'none' || soundAttr === 'silent') return;

      lastClickTime = now;

      // Specific audio cue mappings
      if (soundAttr === 'tab' || interactiveEl.getAttribute('role') === 'tab') {
        audioService.playTabSwitch();
        return;
      }

      if (soundAttr === 'quest') {
        audioService.playQuestComplete();
        return;
      }

      if (soundAttr === 'level') {
        audioService.playLevelUp();
        return;
      }

      if (soundAttr === 'modal-open' || interactiveEl.hasAttribute('data-modal-open')) {
        audioService.playModalOpen();
        return;
      }

      if (
        soundAttr === 'modal-close' ||
        interactiveEl.hasAttribute('data-dismiss') ||
        interactiveEl.getAttribute('aria-label')?.toLowerCase().includes('close')
      ) {
        audioService.playModalClose();
        return;
      }

      if (soundAttr === 'equip') {
        audioService.playItemEquip();
        return;
      }

      if (soundAttr === 'purchase' || soundAttr === 'gold') {
        audioService.playGoldPurchase();
        return;
      }

      if (soundAttr === 'success') {
        audioService.playSuccess();
        return;
      }

      if (soundAttr === 'error') {
        audioService.playError();
        return;
      }

      // Checkbox / switch toggle detection
      if (
        interactiveEl instanceof HTMLInputElement &&
        (interactiveEl.type === 'checkbox' || interactiveEl.type === 'radio')
      ) {
        audioService.playToggle(interactiveEl.checked);
        return;
      }

      if (interactiveEl.getAttribute('role') === 'switch') {
        const isChecked = interactiveEl.getAttribute('aria-checked') === 'true';
        audioService.playToggle(!isChecked);
        return;
      }

      // Navigation links
      if (
        interactiveEl.tagName.toLowerCase() === 'a' &&
        (interactiveEl.getAttribute('href')?.startsWith('/') ||
          interactiveEl.getAttribute('href')?.startsWith('#'))
      ) {
        audioService.playTabSwitch();
        return;
      }

      // Default subtle tactile click for buttons and interactive components
      audioService.playTactileClick();
    };

    const handleGlobalInput = (event: Event) => {
      if (!audioService.isSoundEnabled() || !audioService.isUiSoundsEnabled()) return;

      const target = event.target as HTMLElement | null;
      if (target instanceof HTMLInputElement && target.type === 'range') {
        const now = performance.now();
        if (now - lastSliderTime > 40) {
          lastSliderTime = now;
          audioService.playSliderTick();
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true, passive: true });
    document.addEventListener('input', handleGlobalInput, { capture: true, passive: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      document.removeEventListener('input', handleGlobalInput, { capture: true });
    };
  }, []);

  const value: SoundContextValue = {
    soundEnabled,
    setSoundEnabled,
    toggleSound,
    uiSoundsEnabled,
    setUiSoundsEnabled,
    toggleUiSounds,
    volume,
    setVolume,
    prefersReducedMotion: systemReducedMotion,
    respectReducedMotion,
    setRespectReducedMotion,
    toggleRespectReducedMotion,
    forceReducedMotionOverride,
    setForceReducedMotionOverride,
    isMotionReduced,
    playTactileClick,
    playQuestComplete,
    playLevelUp,
    playTabSwitch,
    playModalOpen,
    playModalClose,
    playToggle,
    playSuccess,
    playError,
    playItemEquip,
    playGoldPurchase,
    playBossHit,
    playNotification,
    playSliderTick,
    triggerAudioCue
  };

  return (
    <SoundContext.Provider value={value}>
      <GameStateAudioBridge
        onQuestComplete={playQuestComplete}
        onLevelUp={playLevelUp}
      />
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = (): SoundContextValue => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};
