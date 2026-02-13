// 🎵 BUDDY JINGLE PLAYER
// Click Buddy to play his theme song!

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BuddyJinglePlayerProps {
  jingleUrl?: string;
  onPlay?: () => void;
  onEnd?: () => void;
}

export function BuddyJinglePlayer({ 
  jingleUrl = '/audio/buddy-jingle.mp3',
  onPlay,
  onEnd 
}: BuddyJinglePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Optional: Your jingle lyrics (if you want to show them)
  const lyrics = [
    "🎵 Welcome to Buddy's Treehouse",
    "Where learning comes alive!",
    "Come explore and play with me",
    "Let's learn and thrive! 🌟",
  ];

  const handleBuddyClick = () => {
    if (isPlaying) {
      // Stop playing
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setShowLyrics(false);
    } else {
      // Start playing
      if (!audioRef.current) {
        audioRef.current = new Audio(jingleUrl);
        audioRef.current.onended = () => {
          setIsPlaying(false);
          setShowLyrics(false);
          if (onEnd) onEnd();
        };
      }

      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowLyrics(true);
          if (onPlay) onPlay();
        })
        .catch(error => {
          console.error('Error playing jingle:', error);
          setIsPlaying(false);
        });
    }
  };

  return (
    <div className="relative">
      {/* Clickable Buddy */}
      <motion.button
        onClick={handleBuddyClick}
        className="relative group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Ring (when playing) */}
        <AnimatePresence>
          {isPlaying && (
            <>
              <motion.div
                className="absolute inset-0 rounded-full bg-yellow-400/30"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-pink-400/30"
                initial={{ scale: 1, opacity: 1 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}
        </AnimatePresence>

        {/* Buddy Icon */}
        <motion.div
          className="text-9xl relative z-10"
          animate={isPlaying ? {
            rotate: [0, -10, 10, -10, 10, 0],
            scale: [1, 1.1, 1, 1.1, 1],
          } : {}}
          transition={isPlaying ? {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 0.5,
          } : {}}
        >
          🐻
        </motion.div>

        {/* Musical Notes (when playing) */}
        <AnimatePresence>
          {isPlaying && (
            <div className="absolute inset-0 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute text-4xl"
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    opacity: 0,
                    scale: 0,
                  }}
                  animate={{
                    x: `${50 + (Math.cos(i * 2.1) * 80)}%`,
                    y: `${50 + (Math.sin(i * 2.1) * 80)}%`,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  🎵
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Hover Prompt */}
        {!isPlaying && (
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ y: 10 }}
            whileHover={{ y: 0 }}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg">
              <div className="text-lg font-bold text-gray-800">
                🎵 Click to hear Buddy's song!
              </div>
            </div>
          </motion.div>
        )}

        {/* Stop Prompt (when playing) */}
        {isPlaying && (
          <motion.div
            className="absolute -bottom-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-red-500 rounded-2xl px-6 py-3 shadow-lg">
              <div className="text-lg font-bold text-white">
                ⏹️ Click to stop
              </div>
            </div>
          </motion.div>
        )}
      </motion.button>

      {/* Lyrics Display (Optional) */}
      <AnimatePresence>
        {showLyrics && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-8 w-96"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 shadow-2xl">
              <div className="text-white text-center space-y-3">
                {lyrics.map((line, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.5 }}
                    className="text-2xl font-bold"
                  >
                    {line}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============== SIMPLE VERSION (NO LYRICS) ===============

export function SimpleBuddyJingle({ 
  jingleUrl = '/audio/buddy-jingle.mp3' 
}: { 
  jingleUrl?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleJingle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(jingleUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => console.error('Error playing jingle:', error));
    }
  };

  return (
    <motion.button
      onClick={toggleJingle}
      className="relative"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="text-8xl"
        animate={isPlaying ? { rotate: [0, -10, 10, 0] } : {}}
        transition={{ duration: 0.5, repeat: isPlaying ? Infinity : 0 }}
      >
        {isPlaying ? '🎵' : '🐻'}
      </motion.div>
    </motion.button>
  );
}

// =============== MENU BUTTON VERSION ===============

export function JingleMenuButton({ 
  jingleUrl = '/audio/buddy-jingle.mp3' 
}: { 
  jingleUrl?: string;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playJingle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(jingleUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(error => console.error('Error playing jingle:', error));
  };

  return (
    <motion.button
      onClick={playJingle}
      disabled={isPlaying}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 flex items-center gap-3"
    >
      {isPlaying ? (
        <>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          >
            🎵
          </motion.span>
          Playing...
        </>
      ) : (
        <>
          🎵 Play Buddy's Song
        </>
      )}
    </motion.button>
  );
}
