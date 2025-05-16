import { useStore } from '@/store';

// Sound effect URLs (these would be replaced with actual sound files)
const SOUNDS = {
  diceRoll: '/sounds/dice-roll.mp3',
  diceSuccess: '/sounds/dice-success.mp3',
  diceCritical: '/sounds/dice-critical.mp3',
  buttonClick: '/sounds/button-click.mp3',
  notification: '/sounds/notification.mp3',
};

class SoundManager {
  private audioCache: Map<string, HTMLAudioElement> = new Map();
  
  private getAudio(soundUrl: string): HTMLAudioElement {
    if (!this.audioCache.has(soundUrl)) {
      const audio = new Audio(soundUrl);
      audio.preload = 'auto';
      this.audioCache.set(soundUrl, audio);
    }
    return this.audioCache.get(soundUrl)!.cloneNode(true) as HTMLAudioElement;
  }
  
  play(soundKey: keyof typeof SOUNDS, volume: number = 0.5) {
    // Check if sound is enabled in preferences
    const { preferences } = useStore.getState();
    if (!preferences.soundEnabled) return;
    
    const soundUrl = SOUNDS[soundKey];
    if (!soundUrl) return;
    
    try {
      const audio = this.getAudio(soundUrl);
      audio.volume = Math.min(1, Math.max(0, volume));
      audio.play().catch((e) => {
        console.warn('Failed to play sound:', e);
      });
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
  
  // Special dice roll sound that varies by result
  playDiceRoll(result: number, maxValue: number) {
    if (result === maxValue) {
      // Critical success!
      this.play('diceCritical', 0.7);
    } else if (result === 1) {
      // Critical failure
      this.play('diceRoll', 0.3);
    } else {
      // Normal roll
      this.play('diceRoll', 0.5);
    }
  }
}

// Singleton instance
export const soundManager = new SoundManager();

// Hook for easy access
export const useSound = () => {
  return {
    playSound: (sound: keyof typeof SOUNDS, volume?: number) => 
      soundManager.play(sound, volume),
    playDiceRoll: (result: number, maxValue: number) => 
      soundManager.playDiceRoll(result, maxValue),
  };
};