// PROFESSIONAL AUDIO MANAGER
// Handles all audio playback, preloading, caching, and volume control

type AudioCategory = 'letters' | 'numbers' | 'sounds' | 'music' | 'voice';

interface AudioTrack {
  id: string;
  category: AudioCategory;
  url: string;
  volume?: number;
  loop?: boolean;
}

interface PlayOptions {
  url?: string;
  loop?: boolean;
  volume?: number;
  fadeIn?: number;
}

class AudioManager {
  private audioContext: AudioContext | null = null;
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private currentlyPlaying: Map<string, AudioBufferSourceNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
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

    // Number sounds
    'number_1': { id: 'number_1', category: 'numbers', url: '/audio/numbers/1.mp3' },
    'number_2': { id: 'number_2', category: 'numbers', url: '/audio/numbers/2.mp3' },

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
    // Defer AudioContext creation until first user interaction (required by browsers)
    const initOnInteraction = () => {
      this.init();
      document.removeEventListener('click', initOnInteraction);
      document.removeEventListener('touchend', initOnInteraction);
      document.removeEventListener('pointerdown', initOnInteraction);
    };
    document.addEventListener('click', initOnInteraction);
    document.addEventListener('touchend', initOnInteraction);
    document.addEventListener('pointerdown', initOnInteraction);
  }

  private async init() {
    if (this.isInitialized) return;

    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (_) {
      // AudioContext not supported — audio will be silently disabled
    }
  }

  private async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  // Preload audio files (silently skips if AudioContext not ready yet)
  async preload(audioIds: string[]): Promise<void> {
    if (!this.audioContext) return;
    const promises = audioIds.map(id => this.loadAudio(id));
    await Promise.all(promises);
  }

  // Load single audio file by ID or URL
  private async loadAudio(audioId: string, url?: string): Promise<void> {
    if (this.audioBuffers.has(audioId)) {
      return; // Already loaded
    }

    const track = this.audioRegistry[audioId];
    const audioUrl = url || track?.url;
    if (!audioUrl) {
      console.warn(`Audio track ${audioId} not found in registry and no URL provided`);
      return;
    }

    try {
      const response = await fetch(audioUrl);
      if (!response.ok) return; // File not found — skip silently
      const arrayBuffer = await response.arrayBuffer();
      // Skip tiny placeholder files (< 1KB can't be valid audio)
      if (arrayBuffer.byteLength < 1024) return;
      const audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);
      this.audioBuffers.set(audioId, audioBuffer);
    } catch (_) {
      // Audio file missing or invalid — silently skip
    }
  }

  // Play audio - supports both registry IDs and direct URLs via options.url
  async play(audioId: string, options?: PlayOptions): Promise<void> {
    if (this.isMuted) return;
    // Ensure AudioContext is initialized (may not be if no user interaction yet)
    if (!this.audioContext) {
      await this.init();
      await this.resume();
    }
    if (!this.audioContext) return;

    // If a URL is provided, register it dynamically
    if (options?.url && !this.audioRegistry[audioId]) {
      this.audioRegistry[audioId] = {
        id: audioId,
        category: 'music',
        url: options.url,
        loop: options.loop,
        volume: options.volume,
      };
    }

    // Load if not already loaded
    if (!this.audioBuffers.has(audioId)) {
      await this.loadAudio(audioId, options?.url);
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
    } else if (track?.loop) {
      source.loop = true;
    }

    // Create gain node for volume control
    const gainNode = this.audioContext.createGain();

    // Calculate final volume
    let finalVolume = this.masterVolume;
    if (track?.category === 'music') {
      finalVolume *= this.musicVolume;
    } else if (track?.category === 'sounds') {
      finalVolume *= this.sfxVolume;
    } else if (track?.category === 'voice' || track?.category === 'letters' || track?.category === 'numbers') {
      finalVolume *= this.voiceVolume;
    }

    // Apply track-specific volume
    if (options?.volume !== undefined) {
      finalVolume *= options.volume;
    } else if (track?.volume !== undefined) {
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
    this.gainNodes.set(audioId, gainNode);

    // Remove from tracking when done (if not looping)
    source.onended = () => {
      this.currentlyPlaying.delete(audioId);
      this.gainNodes.delete(audioId);
    };
  }

  // Set volume for a specific currently-playing audio track
  setVolume(audioId: string, volume: number): void {
    const gainNode = this.gainNodes.get(audioId);
    if (gainNode && this.audioContext) {
      gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(
        Math.max(0, Math.min(1, volume)),
        this.audioContext.currentTime + 0.1
      );
    }
  }

  // Stop audio
  stop(audioId: string, fadeOut?: number): void {
    const source = this.currentlyPlaying.get(audioId);
    if (!source) return;

    const gainNode = this.gainNodes.get(audioId);

    if (fadeOut && this.audioContext && gainNode) {
      gainNode.gain.setValueAtTime(gainNode.gain.value, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + fadeOut);

      setTimeout(() => {
        try { source.stop(); } catch (_) { /* already stopped */ }
        this.currentlyPlaying.delete(audioId);
        this.gainNodes.delete(audioId);
      }, fadeOut * 1000);
    } else {
      try { source.stop(); } catch (_) { /* already stopped */ }
      this.currentlyPlaying.delete(audioId);
      this.gainNodes.delete(audioId);
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
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setVoiceVolume(volume: number): void {
    this.voiceVolume = Math.max(0, Math.min(1, volume));
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
