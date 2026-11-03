// Web Audio API synthesizer for vintage typewriter sounds

class SoundEngine {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playKeystroke(type: 'typewriter' | 'soft_click' | 'off', volume: number = 0.5) {
    if (type === 'off' || volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      if (type === 'typewriter') {
        // Crisp antique mechanical typewriter key strike
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400 + Math.random() * 200, now);
        filter.Q.setValueAtTime(3.5, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.04);

        gain.gain.setValueAtTime(volume * 0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);

        // Add small high frequency click transient
        const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.015, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseBuffer.length; i++) {
          output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseBuffer.length * 0.2));
        }
        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(volume * 0.25, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        whiteNoise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        whiteNoise.start(now);
      } else {
        // Soft fountain pen / muted keypress
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(90, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.03);

        gain.gain.setValueAtTime(volume * 0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // AudioContext unavailable or autoplay blocked
    }
  }

  public playBell(volume: number = 0.5) {
    if (volume <= 0) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Vintage brass typewriter bell chime (approx 1760 Hz)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1760, now);

      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.95);
    } catch {
      // Silently catch audio policy errors
    }
  }
}

export const soundEngine = new SoundEngine();
