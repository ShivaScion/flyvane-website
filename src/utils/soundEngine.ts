// src/utils/soundEngine.ts
// Native Web Audio API Sound Synthesizer — Zero External Dependencies (Ponytail Rule)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  /**
   * Crisp, high-end mechanical click (1200Hz -> 400Hz exponential pitch drop, 18ms decay)
   * Perfect for button presses, command palette navigation, and tabs
   */
  public playClick(volume = 0.08) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.018);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.02);
  }

  /**
   * Organic bubble pop (damped resonant sine, 35ms)
   * Used for badge triggers, mascot routine shifts, and copy confirmations
   */
  public playPop(volume = 0.1) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.025);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * High-frequency micro-tick for slider adjustments (2400Hz band-pass impulse, 8ms)
   */
  public playTick(normalizedVal = 0.5, volume = 0.04) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    // Frequency shifts subtly with slider value (1800Hz - 2800Hz)
    const freq = 1800 + normalizedVal * 1000;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.01);
  }

  /**
   * Resonant harmonic chord for theme mode morphing (Machine / Mind / Hybrid)
   */
  public playModeMorph(mode: 'machine' | 'mind' | 'hybrid', volume = 0.07) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const frequencies =
      mode === 'machine'
        ? [523.25, 659.25, 783.99] // C5 Major (precise, crisp)
        : mode === 'mind'
        ? [440.0, 554.37, 659.25] // A4 Major (warm, strategic)
        : [587.33, 739.99, 880.0]; // D5 Harmonic (balanced, unified)

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.02);

      gain.gain.setValueAtTime(0.0001, now + idx * 0.02);
      gain.gain.linearRampToValueAtTime(volume / frequencies.length, now + idx * 0.02 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.02);
      osc.stop(now + 0.2);
    });
  }

  /**
   * Filtered air sweep for modal dialogues and command palette open/close
   */
  public playModalSweep(isOpen: boolean, volume = 0.05) {
    if (this.isMuted) return;
    const ctx = this.initContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const startFreq = isOpen ? 300 : 700;
    const endFreq = isOpen ? 700 : 300;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.08);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }
}

export const soundEngine = new SoundEngine();
