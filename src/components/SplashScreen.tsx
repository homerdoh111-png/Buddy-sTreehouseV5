import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useBuddyStore } from '../store/buddyStore';
import { audioManager } from '../utils/audioManager';

export default function SplashScreen() {
  const [phase, setPhase] = useState<'tree' | 'buddy' | 'title' | 'ready'>('tree');
  const setCurrentScreen = useBuddyStore((s) => s.setCurrentScreen);
  const soundEnabled = useBuddyStore((s) => s.soundEnabled);

  useEffect(() => {
    if (soundEnabled) {
      audioManager.playIntro();
    }

    const timers = [
      setTimeout(() => setPhase('buddy'), 800),
      setTimeout(() => setPhase('title'), 1600),
      setTimeout(() => setPhase('ready'), 2800),
    ];

    return () => timers.forEach(clearTimeout);
  }, [soundEnabled]);

  const handleStart = () => {
    if (soundEnabled) {
      audioManager.playSfx('click');
      audioManager.playLoop();
    }
    setCurrentScreen('menu');
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300 flex flex-col items-center justify-center overflow-hidden">
      {/* Clouds */}
      <motion.div
        className="absolute top-10 left-10 text-6xl opacity-60"
        animate={{ x: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 text-5xl opacity-50"
        animate={{ x: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        ☁️
      </motion.div>

      {/* Sun */}
      <motion.div
        className="absolute top-8 right-12 text-7xl"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        ☀️
      </motion.div>

      {/* Tree */}
      <AnimatePresence>
        {phase !== 'tree' && (
          <motion.div
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', bounce: 0.5, duration: 0.8 }}
            className="text-[120px] mb-4"
          >
            🌳
          </motion.div>
        )}
      </AnimatePresence>

      {/* Buddy Character */}
      <AnimatePresence>
        {(phase === 'title' || phase === 'ready') && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.6 }}
            className="text-8xl mb-4"
          >
            🐻
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <AnimatePresence>
        {(phase === 'title' || phase === 'ready') && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-buddy text-5xl md:text-6xl text-treehouse-bark drop-shadow-lg mb-2">
              Buddy's Treehouse
            </h1>
            <motion.p
              className="font-body text-xl text-treehouse-brown font-semibold"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Learning is an adventure!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Button */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: 'spring', bounce: 0.6, delay: 0.3 }}
            onClick={handleStart}
            className="mt-8 px-10 py-4 bg-treehouse-gold hover:bg-yellow-400 text-treehouse-bark font-buddy text-2xl rounded-full shadow-lg transform transition-colors"
          >
            Let's Play! 🎮
          </motion.button>
        )}
      </AnimatePresence>

      {/* Grass */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[50%]" />

      {/* Flowers */}
      <div className="absolute bottom-4 left-[10%] text-3xl">🌻</div>
      <div className="absolute bottom-6 left-[30%] text-2xl">🌸</div>
      <div className="absolute bottom-4 right-[20%] text-3xl">🌺</div>
      <div className="absolute bottom-6 right-[35%] text-2xl">🌷</div>

      {/* Butterflies */}
      <motion.div
        className="absolute top-1/3 left-[15%] text-3xl"
        animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🦋
      </motion.div>
    </div>
  );
}
