// Tactical Cybernetic Web Audio Synthesizer (Zero asset dependency, instant tactile feedback)
// Supports global sound state, subtle UI interaction toggle, master volume, and reduced motion accessibility.

class AudioService {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private uiSoundsEnabled: boolean = true;
  private volume: number = 0.8;
  private respectReducedMotion: boolean = true;
  private reducedMotion: boolean = false;

  constructor() {
    // Lazy initialize on first interaction
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public setUiSoundsEnabled(enabled: boolean) {
    this.uiSoundsEnabled = enabled;
  }

  public isUiSoundsEnabled(): boolean {
    return this.uiSoundsEnabled;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setRespectReducedMotion(respect: boolean) {
    this.respectReducedMotion = respect;
  }

  public getRespectReducedMotion(): boolean {
    return this.respectReducedMotion;
  }

  public setReducedMotion(reduced: boolean) {
    this.reducedMotion = reduced;
  }

  public isReducedMotion(): boolean {
    return this.reducedMotion;
  }

  // Subtle tactile button click blip with micro-variation for organic feedback
  // When reduced motion is respected, plays an ultra-soft, lowpass-filtered, non-jarring acoustic whisper
  public playTactileClick() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // If user prefers reduced motion and preference is respected, produce an ultra-gentle micro-tone
      if (this.respectReducedMotion && this.reducedMotion) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        const targetGain = 0.018 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
        return;
      }

      // Standard crisp tactical blip with micro pitch variation
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Micro variance ±25Hz prevents click monotony
      const baseFreq = 800 + (Math.random() * 50 - 25);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.5, now + 0.035);

      const targetGain = 0.04 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // Audio might be blocked by browser policy until user gesture
    }
  }

  // Rewarding Quest Complete Chime with difficulty tier variations
  public playQuestComplete(tierOrDifficulty?: string) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const tier = (tierOrDifficulty || '').toLowerCase();
      const isEpic = tier === 's' || tier === 'a' || tier.includes('epic') || tier.includes('boss');

      if (isEpic) {
        // Grand Majestic Arpeggio for High-Tier & Boss Directives: C5, E5, G5, B5, D6, G6
        const epicNotes = [523.25, 659.25, 783.99, 987.77, 1174.66, 1567.98];
        epicNotes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = isSoft ? 'sine' : 'triangle';
          const noteStart = now + idx * 0.07;
          osc.frequency.setValueAtTime(freq, noteStart);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(isSoft ? 1800 : 3200, noteStart);

          const peakGain = (isSoft ? 0.05 : 0.09) * this.volume;
          gain.gain.setValueAtTime(0, noteStart);
          gain.gain.linearRampToValueAtTime(peakGain, noteStart + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0008, noteStart + 0.55);

          osc.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(noteStart);
          osc.stop(noteStart + 0.6);
        });

        // Warm sub-fundamental bloom
        const subOsc = ctx.createOscillator();
        const subGain = ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(130.81, now); // C3
        subGain.gain.setValueAtTime(0.06 * this.volume, now);
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        subOsc.connect(subGain);
        subGain.connect(ctx.destination);
        subOsc.start(now);
        subOsc.stop(now + 0.65);
        return;
      }

      // Standard / Core Directive Chime: C5, E5, G5, C6 with shimmering sustain
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isSoft ? 'sine' : 'triangle';
        const noteStart = now + idx * (isSoft ? 0.09 : 0.075);
        osc.frequency.setValueAtTime(freq, noteStart);

        const peakGain = (isSoft ? 0.05 : 0.1) * this.volume;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(peakGain, noteStart + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.42);
      });
    } catch {
      // Ignore audio error
    }
  }

  // Triumphant Level Up fanfare with celebratory multi-harmonic progression
  public playLevelUp(_level?: number) {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      // Heroic triumphant fanfare arpeggio: A4, C#5, E5, A5, C#6, E6, A6
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isSoft ? 'sine' : 'sawtooth';
        const noteStart = now + idx * 0.08;
        osc.frequency.setValueAtTime(freq, noteStart);

        // Lowpass filter for smooth cinematic warmth
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isSoft ? 1200 : 2600, noteStart);

        const peakGain = (isSoft ? 0.07 : 0.12) * this.volume;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(peakGain, noteStart + 0.025);
        gain.gain.exponentialRampToValueAtTime(0.0008, noteStart + 0.7);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.75);
      });

      // High-register celebratory chime accent
      const bellOsc = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(2093, now + 0.48); // C7
      bellGain.gain.setValueAtTime(0, now + 0.48);
      bellGain.gain.linearRampToValueAtTime(0.08 * this.volume, now + 0.50);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      bellOsc.connect(bellGain);
      bellGain.connect(ctx.destination);
      bellOsc.start(now + 0.48);
      bellOsc.stop(now + 1.15);

      // Sub-bass resonance kick for kinetic punch
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.4);
      subGain.gain.setValueAtTime(0.12 * this.volume, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.5);
    } catch {
      // Ignore
    }
  }

  // Smooth cybernetic frequency sweep for navigation tabs & view switches
  public playTabSwitch() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSoft ? 380 : 420, now);
      osc.frequency.exponentialRampToValueAtTime(isSoft ? 480 : 620, now + 0.045);

      const targetGain = (isSoft ? 0.02 : 0.035) * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Ignore
    }
  }

  // Resonant upward swell for modal / dialog / drawer opening
  public playModalOpen() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = isSoft ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(540, now + 0.09);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      const targetGain = (isSoft ? 0.03 : 0.05) * this.volume;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(targetGain, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // Ignore
    }
  }

  // Soft acoustic descending release for modal dismissal / drawer close
  public playModalClose() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.06);

      const targetGain = 0.028 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.075);
    } catch {
      // Ignore
    }
  }

  // Dual-state acoustic feedback for switches, checkboxes, and toggles
  public playToggle(state: boolean = true) {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      if (state) {
        // Uplifting ascending pip for active ON
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);
      } else {
        // Mellow descending tone for inactive OFF
        osc.frequency.setValueAtTime(560, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.04);
      }

      const targetGain = (isSoft ? 0.025 : 0.04) * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Ignore
    }
  }

  // Bright major chord affirmation for positive actions (saved callsign, badge unlock, copy)
  public playSuccess() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      // Sparkling triad: F#5 (739.99), A#5 (932.33), C#6 (1108.73)
      const triad = [739.99, 932.33, 1108.73];
      triad.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = isSoft ? 'sine' : 'triangle';
        const noteStart = now + idx * 0.04;
        osc.frequency.setValueAtTime(freq, noteStart);

        const targetGain = (isSoft ? 0.04 : 0.07) * this.volume;
        gain.gain.setValueAtTime(0, noteStart);
        gain.gain.linearRampToValueAtTime(targetGain, noteStart + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.3);
      });
    } catch {
      // Ignore
    }
  }

  // Mechanical cybernetic latch/snap for equipping or unequipping gear
  public playItemEquip(isEquipping: boolean = true) {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      // Sharp metallic click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isEquipping ? 950 : 700, now);
      osc.frequency.exponentialRampToValueAtTime(isEquipping ? 480 : 320, now + 0.035);

      const targetGain = 0.05 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);

      // Resonant metal shimmer
      const bell = ctx.createOscillator();
      const bellGain = ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(isEquipping ? 1320 : 880, now + 0.015);
      bellGain.gain.setValueAtTime(0.03 * this.volume, now + 0.015);
      bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      bell.connect(bellGain);
      bellGain.connect(ctx.destination);
      bell.start(now + 0.015);
      bell.stop(now + 0.16);
    } catch {
      // Ignore
    }
  }

  // Gentle two-tone ping for system toasts and notifications
  public playNotification() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const pings = [880, 1318.51]; // A5, E6
      pings.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        const start = now + idx * 0.06;
        osc.frequency.setValueAtTime(freq, start);

        const targetGain = 0.04 * this.volume;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(targetGain, start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch {
      // Ignore
    }
  }

  // Subtle micro-pip for continuous slider scrubbing
  public playSliderTick() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);

      const targetGain = 0.012 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Ignore
    }
  }

  // Gold purchase coin clink
  public playGoldPurchase() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(isSoft ? 1100 : 1400, now);
      osc.frequency.setValueAtTime(isSoft ? 1400 : 1900, now + 0.06);

      const targetGain = (isSoft ? 0.05 : 0.1) * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Boss hit impact
  public playBossHit() {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const isSoft = this.respectReducedMotion && this.reducedMotion;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isSoft) {
        // Soft bass thump without harsh square harmonic distortion
        osc.type = 'sine';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);

        const targetGain = 0.08 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      } else {
        osc.type = 'square';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

        const targetGain = 0.15 * this.volume;
        gain.gain.setValueAtTime(targetGain, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      }

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // Ignore
    }
  }

  // Subtle rejection click
  public playError() {
    if (!this.soundEnabled || !this.uiSoundsEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.setValueAtTime(120, now + 0.06);

      const targetGain = 0.035 * this.volume;
      gain.gain.setValueAtTime(targetGain, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Ignore
    }
  }
}

export const audioService = new AudioService();
