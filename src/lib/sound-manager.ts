// Sound Manager - Web Audio API based sound effects
// Generates sounds programmatically without external audio files

class SoundManager {
  private audioContext: AudioContext | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }

  // Play a pleasant "correct" sound - ascending chime
  playCorrect() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Create a pleasant ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(this.volume * 0.5, now + i * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);
        
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.3);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play a "wrong" sound - descending buzz
  playWrong() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Create a descending buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);
      
      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      osc.start(now);
      osc.stop(now + 0.3);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play a victory fanfare
  playVictory() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Victory fanfare - major chord progression
      const chords = [
        { notes: [392, 493.88, 587.33], time: 0 },      // G4, B4, D5
        { notes: [523.25, 659.25, 783.99], time: 0.15 }, // C5, E5, G5
        { notes: [659.25, 783.99, 987.77], time: 0.3 },  // E5, G5, B5
        { notes: [783.99, 987.77, 1174.66], time: 0.45 }, // G5, B5, D6
      ];
      
      chords.forEach(chord => {
        chord.notes.forEach(freq => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.type = 'sine';
          osc.frequency.value = freq;
          
          gain.gain.setValueAtTime(0, now + chord.time);
          gain.gain.linearRampToValueAtTime(this.volume * 0.3, now + chord.time + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, now + chord.time + 0.4);
          
          osc.start(now + chord.time);
          osc.stop(now + chord.time + 0.4);
        });
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play a defeat sound
  playDefeat() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      // Sad descending tones
      const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'triangle';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.2);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + i * 0.2 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.2 + 0.4);
        
        osc.start(now + i * 0.2);
        osc.stop(now + i * 0.2 + 0.4);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play a click/tap sound
  playClick() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = 800;
      
      gain.gain.setValueAtTime(this.volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play countdown tick
  playTick() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = 1000;
      
      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play match found sound
  playMatchFound() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      const notes = [523.25, 783.99]; // C5, G5
      
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.value = freq;
        
        gain.gain.setValueAtTime(0, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(this.volume * 0.4, now + i * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.2);
        
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.2);
      });
    } catch (e) {
      console.log('Audio not available');
    }
  }

  // Play points scored popup sound
  playPoints() {
    if (!this.enabled || typeof window === 'undefined') return;
    
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.1);
      
      gain.gain.setValueAtTime(this.volume * 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      
      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.log('Audio not available');
    }
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
export default soundManager;
