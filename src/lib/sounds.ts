// Sound effects utility using Web Audio API
// Generates synthesized sounds without external audio files

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // Play a correct answer sound - ascending pleasant chime
  playCorrect() {
    if (!this.enabled) return;
    
    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Create a pleasant ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = now + i * 0.08;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.35);
      });
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  // Play a wrong answer sound - descending tone
  playWrong() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Create a descending minor third
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(330, now); // E4
      oscillator.frequency.linearRampToValueAtTime(220, now + 0.3); // A3

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

      oscillator.start(now);
      oscillator.stop(now + 0.45);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  // Play a button click sound
  playClick() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 800;

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

      oscillator.start(now);
      oscillator.stop(now + 0.06);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  // Play a victory fanfare
  playVictory() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Triumphant ascending melody
      const notes = [
        { freq: 392.00, time: 0 },      // G4
        { freq: 523.25, time: 0.15 },   // C5
        { freq: 659.25, time: 0.3 },    // E5
        { freq: 783.99, time: 0.45 },   // G5
        { freq: 1046.50, time: 0.6 },   // C6
      ];

      notes.forEach(({ freq, time }) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'triangle';
        oscillator.frequency.value = freq;

        const startTime = now + time;
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.45);
      });
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  // Play a defeat sound
  playDefeat() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      // Descending minor chord
      const notes = [
        { freq: 392.00, time: 0 },      // G4
        { freq: 311.13, time: 0.2 },    // Eb4
        { freq: 261.63, time: 0.4 },    // C4
      ];

      notes.forEach(({ freq, time }) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = now + time;
        gainNode.gain.setValueAtTime(0.1, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.55);
      });
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }

  // Play countdown beep
  playBeep() {
    if (!this.enabled) return;

    try {
      const ctx = this.getContext();
      const now = ctx.currentTime;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.value = 1000;

      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      oscillator.start(now);
      oscillator.stop(now + 0.11);
    } catch (e) {
      console.warn('Sound playback failed:', e);
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
