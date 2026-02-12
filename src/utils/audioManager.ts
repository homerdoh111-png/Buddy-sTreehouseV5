class AudioManager {
  private static instance: AudioManager;
  private bgMusic: HTMLAudioElement | null = null;
  private sfxPool: Map<string, HTMLAudioElement> = new Map();
  private enabled = true;
  private volume = 0.5;

  static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBgMusic();
    }
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.bgMusic) {
      this.bgMusic.volume = this.volume * 0.3;
    }
  }

  async playBgMusic(src: string, loop = true) {
    if (!this.enabled) return;

    try {
      if (this.bgMusic) {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
      }

      this.bgMusic = new Audio(src);
      this.bgMusic.loop = loop;
      this.bgMusic.volume = this.volume * 0.3;

      await this.bgMusic.play().catch(() => {
        // Autoplay blocked - will play on user interaction
      });
    } catch {
      // Audio not available
    }
  }

  stopBgMusic() {
    if (this.bgMusic) {
      this.bgMusic.pause();
      this.bgMusic.currentTime = 0;
    }
  }

  async playSfx(name: string) {
    if (!this.enabled) return;

    try {
      const frequencies: Record<string, number> = {
        click: 800,
        success: 1200,
        star: 1500,
        error: 300,
        celebrate: 1000,
        pop: 600,
        whoosh: 400,
      };

      const freq = frequencies[name] || 800;
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';
      gainNode.gain.value = this.volume * 0.1;
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch {
      // Audio not available
    }
  }

  async playIntro() {
    await this.playBgMusic('/audio/buddy-jingle-intro.mp3', false);
  }

  async playLoop() {
    await this.playBgMusic('/audio/buddy-jingle-loop.mp3', true);
  }

  async playCelebration() {
    if (!this.enabled) return;
    try {
      const audio = new Audio('/audio/buddy-jingle-celebration.mp3');
      audio.volume = this.volume * 0.5;
      await audio.play().catch(() => {});
    } catch {
      // Audio not available
    }
  }
}

export const audioManager = AudioManager.getInstance();
