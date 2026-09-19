// Web Audio API Synthesizer Engine for BitForge
// Provides algorithm sonification and UI micro-haptics with 0 external dependencies.

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    // Load persisted mute preference
    try {
      const saved = localStorage.getItem('bitforge_sound_enabled');
      // Default to muted unless explicitly unmuted to respect browser auto-play norms
      this.isMuted = saved !== 'true';
    } catch {
      this.isMuted = true;
    }
  }

  // Initialize or resume the AudioContext on first user interaction
  public init(): void {
    if (this.isInitialized && this.ctx && this.ctx.state === 'running') return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!this.ctx) {
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      this.isInitialized = true;
    } catch (e) {
      console.warn('Web Audio API not supported or blocked in this environment:', e);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (!muted) {
      this.init();
      // Play a short confirmation chime when enabled
      setTimeout(() => this.playClickBeep(660), 50);
    }
    try {
      localStorage.setItem('bitforge_sound_enabled', muted ? 'false' : 'true');
    } catch {
      // ignore localStorage errors
    }
    this.listeners.forEach((cb) => cb(this.isMuted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public subscribe(cb: (muted: boolean) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  // Generic tone generator with attack, decay, and bandpass filtering
  public playTone(
    freq: number,
    type: OscillatorType = 'sine',
    duration: number = 0.08,
    gainLevel: number = 0.08
  ): void {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);

      // Smooth attack and exponential decay to prevent audio pops
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(gainLevel, now + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // fail silently if audio context is unavailable
    }
  }

  // Sonification for algorithm operations (compares, swaps, inserts, highlights)
  public playStepSound(
    stepType: 'compare' | 'swap' | 'insert' | 'highlight' | 'complete',
    valueRatio: number = 0.5
  ): void {
    if (this.isMuted) return;

    // Pentatonic scale base frequencies for harmonic beauty (C Major Pentatonic)
    const baseFreqs = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25, 783.99, 880.0];
    const clampedRatio = Math.max(0, Math.min(1, valueRatio));
    const idx = Math.floor(clampedRatio * (baseFreqs.length - 1));
    const pitch = baseFreqs[idx] || 440;

    switch (stepType) {
      case 'compare':
        // Soft double-click
        this.playTone(pitch, 'triangle', 0.04, 0.04);
        break;
      case 'swap':
        // Resonant sine burst with quick ascending sweep
        this.playTone(pitch * 1.2, 'sine', 0.07, 0.06);
        break;
      case 'insert':
        // Gentle percussive click
        this.playTone(pitch, 'sine', 0.05, 0.05);
        break;
      case 'highlight':
        // Crisp chime
        this.playTone(pitch * 1.5, 'triangle', 0.06, 0.035);
        break;
      case 'complete':
        this.playSuccessChime();
        break;
    }
  }

  // Subtle tactile micro-tick for UI button and card hovers
  public playHoverTick(): void {
    if (this.isMuted) return;
    this.playTone(1800, 'sine', 0.02, 0.015);
  }

  // Tactile navigation click
  public playClickBeep(freq: number = 520): void {
    if (this.isMuted) return;
    this.playTone(freq, 'sine', 0.04, 0.04);
  }

  // Resolution fanfare when an algorithm completes
  public playSuccessChime(): void {
    if (this.isMuted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.2, 0.05);
      }, i * 70);
    });
  }
}

export const soundEngine = new SoundEngine();
