import { motion } from 'framer-motion';
import { useBuddyStore } from '../store/buddyStore';
import { audioManager } from '../utils/audioManager';

export default function BuddyJinglePlayer() {
  const soundEnabled = useBuddyStore((s) => s.soundEnabled);
  const toggleSound = useBuddyStore((s) => s.toggleSound);
  const musicVolume = useBuddyStore((s) => s.musicVolume);
  const setMusicVolume = useBuddyStore((s) => s.setMusicVolume);

  const handleToggle = () => {
    toggleSound();
    if (soundEnabled) {
      audioManager.setEnabled(false);
    } else {
      audioManager.setEnabled(true);
      audioManager.playLoop();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setMusicVolume(vol);
    audioManager.setVolume(vol);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
    >
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleToggle}
        className="text-2xl"
        title={soundEnabled ? 'Mute' : 'Unmute'}
      >
        {soundEnabled ? '🔊' : '🔇'}
      </motion.button>
      {soundEnabled && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={musicVolume}
          onChange={handleVolumeChange}
          className="w-20 h-1 accent-treehouse-gold"
        />
      )}
    </motion.div>
  );
}
