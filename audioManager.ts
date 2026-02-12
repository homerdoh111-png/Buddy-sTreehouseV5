// 🔊 PROFESSIONAL AUDIO MANAGER
// Handles all audio playback, preloading, caching, and volume control

type AudioCategory = 'letters' | 'numbers' | 'sounds' | 'music' | 'voice';

interface AudioTrack {
  id: string;
  category: AudioCategory;
  url: string;
  volume?: number;
  loop?: boolean;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private currentlyPlaying: Map<string, AudioBufferSourceNode> = new Map();
  private masterVolume: number = 0.7;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 0.8;
  private voiceVolume: number = 1.0;
  private isMuted: boolean = false;
  private isInitialized: boolean = false;

  // Audio file registry
  private audioRegistry: Record<string, AudioTrack> = {
    // Letter sounds
    'letter_a': { id: 'letter_a', category: 'letters', url: '/audio/letters/a.mp3' },
    'letter_b': { id: 'letter_b', category: 'letters', url: '/audio/letters/b.mp3' },
    // ... (would include all letters A-Z)
    
    // Number sounds
    'number_1': { id: 'number_1', category: 'numbers', url: '/audio/numbers/1.mp3' },
    'number_2': { id: 'number_2', category: 'numbers', url: '/audio/numbers/2.mp3' },
    // ... (would include numbers 1-20)
    
    // Sound effects
    'success': { id: 'success', category: 'sounds', url: '/audio/sounds/success.mp3' },
    'star_collect': { id: 'star_collect', category: 'sounds', url: '/audio/sounds/star.mp3' },
    'button_click': { id: 'button_click', category: 'sounds', url: '/audio/sounds/click.mp3' },
    'achievement': { id: 'achievement', category: 'sounds', url: '/audio/sounds/achievement.mp3' },
    'error': { id: 'error', category: 'sounds', url: '/audio/sounds/error.mp3' },
    'level_up': { id: 'level_up', category: 'sounds', url: '/audio/sounds/levelup.mp3' },
    'unlock': { id: 'unlock', category: 'sounds', url: '/audio/sounds/unlock.mp3' },
    
    // Background music
    'menu_music': { id: 'menu_music', category: 'music', url: '/audio/music/menu.mp3', loop: true, volume: 0.4 },
    'activity_music': { id: 'activity_music', category: 'music', url: '/audio/music/activity.mp3', loop: true, volume: 0.3 },
    
    // Voice clips
    'buddy_hello': { id: 'buddy_hello', category: 'voice', url: '/audio/voice/hello.mp3' },
    'buddy_great_job': { id: 'buddy_great_job', category: 'voice', url: '/audio/voice/great_job.mp3' },
    'buddy_try_again': { id: 'buddy_try_again', category: 'voice', url: '/audio/voice/try_again.mp3' },
  };

  constructor() {
    this.init();
  }

  private async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
      
      // Resume audio context on user interaction (mobile requirement)
      document.addEventListener('click', () => this.resume(), { once: true });
      document.addEventListener('touchend', () => this.resume(), { once: true });
      
      console.log('AudioManager initialized');
    } catch (error) {
      console.error('Failed to initialize AudioManager:', error);
    }
  }

  private async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Preload audio files
  async preload(audioIds: string[]): Promise<void> {
    if (!this.audioContext) {
      console.warn('AudioContext not initialized');
      return;
    }

    const promises = audioIds.map(id => this.loadAudio(id));
    await Promise.all(promises);
    console.log(`Preloaded ${audioIds.length} audio files`);
  }

  // Load single audio file
  private async loadAudio(audioId: string): Promise<void> {
    if (this.audioBuffers.has(audioId)) {
      return; // Already loaded
    }

    const track = this.audioRegistry[audioId];
    if (!track) {
      console.warn(`Audio track ${audioId} not found in registry`);
      return;
    }

    try {
      const response = await fetch(track.url);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(audioId, audioBuffer);
    } catch (error) {
      console.error(`Failed to load audio ${audioId}:`, error);
    }
  }

  // Play audio
  async play(audioId: string, options?: { loop?: boolean; volume?: number; fadeIn?: number }): Promise<void> {
    if (!this.audioContext || this.isMuted) return;

    // Load if not already loaded
    if (!this.audioBuffers.has(audioId)) {
      await this.loadAudio(audioId);
    }

    const buffer = this.audioBuffers.get(audioId);
    if (!buffer) return;

    const track = this.audioRegistry[audioId];
    
    // Stop any currently playing instance
    this.stop(audioId);

    // Create source
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Set loop
    if (options?.loop !== undefined) {
      source.loop = options.loop;
    } else if (track.loop) {
      source.loop = true;
    }

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();
    
    // Calculate final volume
    let finalVolume = this.masterVolume;
    if (track.category === 'music') {
      finalVolume *= this.musicVolume;
    } else if (track.category === 'sounds') {
      finalVolume *= this.sfxVolume;
    } else if (track.category === 'voice' || track.category === 'letters' || track.category === 'numbers') {
      finalVolume *= this.voiceVolume;
    }
    
    // Apply track-specific volume
    if (options?.volume !== undefined) {
      finalVolume *= options.volume;
    } else if (track.volume !== undefined) {
      finalVolume *= track.volume;
    }

    // Fade in
    if (options?.fadeIn) {
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(finalVolume, this.audioContext.currentTime + options.fadeIn);
    } else {
      gainNode.gain.value = finalVolume;
    }

    // Connect nodes
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Start playing
    source.start(0);
    
    // Track for cleanup
    this.currentlyPlaying.set(audioId, source);

    // Remove from tracking when done (if not looping)
    source.onended = () => {
      this.currentlyPlaying.delete(audioId);
    };
  }

  // Stop audio
  stop(audioId: string, fadeOut?: number): void {
    const source = this.currentlyPlaying.get(audioId);
    if (!source) return;

    if (fadeOut && this.audioContext) {
      // Fade out before stopping
      const gainNode = this.audioContext.createGain();
      gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + fadeOut);
      
      setTimeout(() => {
        source.stop();
        this.currentlyPlaying.delete(audioId);
      }, fadeOut * 1000);
    } else {
      source.stop();
      this.currentlyPlaying.delete(audioId);
    }
  }

  // Stop all audio
  stopAll(fadeOut?: number): void {
    this.currentlyPlaying.forEach((_, audioId) => {
      this.stop(audioId, fadeOut);
    });
  }

  // Volume controls
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  setVoiceVolume(volume: number): void {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
    this.updateAllVolumes();
  }

  private updateAllVolumes(): void {
    // Update volume for all currently playing audio
    // This would require storing gain nodes separately
    // For simplicity, volumes apply to new playback
  }

  // Mute toggle
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopAll(0.2);
    }
  }

  toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Get state
  getState() {
    return {
      isInitialized: this.isInitialized,
      isMuted: this.isMuted,
      masterVolume: this.masterVolume,
      musicVolume: this.musicVolume,
      sfxVolume: this.sfxVolume,
      voiceVolume: this.voiceVolume,
      loadedCount: this.audioBuffers.size,
      playingCount: this.currentlyPlaying.size,
    };
  }

  // Cleanup
  dispose(): void {
    this.stopAll();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.audioBuffers.clear();
    this.isInitialized = false;
  }
}

// Singleton instance
const audioManager = new AudioManager();

export default audioManager;

// React hook for easy integration
import { useState, useEffect } from 'react';

export function useAudioManager() {
  const [state, setState] = useState(audioManager.getState());

  useEffect(() => {
    const interval = setInterval(() => {
      setState(audioManager.getState());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return {
    ...state,
    play: (id: string, options?: any) => audioManager.play(id, options),
    stop: (id: string, fadeOut?: number) => audioManager.stop(id, fadeOut),
    stopAll: (fadeOut?: number) => audioManager.stopAll(fadeOut),
    setMasterVolume: (vol: number) => audioManager.setMasterVolume(vol),
    setMusicVolume: (vol: number) => audioManager.setMusicVolume(vol),
    setSFXVolume: (vol: number) => audioManager.setSFXVolume(vol),
    setVoiceVolume: (vol: number) => audioManager.setVoiceVolume(vol),
    setMuted: (muted: boolean) => audioManager.setMuted(muted),
    toggleMute: () => audioManager.toggleMute(),
    preload: (ids: string[]) => audioManager.preload(ids),
  };
}

// Convenient helper functions
export const playSuccess = () => audioManager.play('success');
export const playStar = () => audioManager.play('star_collect');
export const playClick = () => audioManager.play('button_click');
export const playAchievement = () => audioManager.play('achievement');
export const playLevelUp = () => audioManager.play('level_up');
export const playUnlock = () => audioManager.play('unlock');
export const playError = () => audioManager.play('error');

export const playLetter = (letter: string) => {
  audioManager.play(`letter_${letter.toLowerCase()}`);
};

export const playNumber = (number: number) => {
  if (number >= 1 && number <= 20) {
    audioManager.play(`number_${number}`);
  }
};

export const startMenuMusic = () => {
  audioManager.play('menu_music', { loop: true, fadeIn: 1.0 });
};

export const startActivityMusic = () => {
  audioManager.play('activity_music', { loop: true, fadeIn: 0.5 });
};

export const stopMusic = () => {
  audioManager.stop('menu_music', 0.5);
  audioManager.stop('activity_music', 0.5);
};
