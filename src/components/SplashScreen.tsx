// 🎬 SPLASH SCREEN - BUDDY'S INTRO JINGLE
// Animated intro screen with custom Suno jingle

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
  audioUrl?: string; // Path to your Suno jingle MP3
}

export function SplashScreen({ onComplete, audioUrl = '/audio/buddy-jingle.mp3' }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [showSkip, setShowSkip] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if we should show splash screen
    const lastShown = localStorage.getItem('buddy_last_splash');
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Show splash if:
    // 1. Never shown before, OR
    // 2. Last shown more than 24 hours ago
    if (!lastShown || now - parseInt(lastShown) > oneDay) {
      startSplash();
    } else {
      // Skip splash, go straight to app
      onComplete();
    }
  }, []);

  const startSplash = () => {
    // Create audio element
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    // Start playing jingle
    audio.play()
      .then(() => {
        setIsPlaying(true);
        
        // Progress bar animation
        const duration = audio.duration * 1000 || 30000; // Default 30s if duration unknown
        const interval = 50; // Update every 50ms
        const increment = (interval / duration) * 100;

        const progressInterval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 100) {
              clearInterval(progressInterval);
              completeSplash();
              return 100;
            }
            return prev + increment;
          });
        }, interval);

        // Show skip button after 3 seconds
        setTimeout(() => setShowSkip(true), 3000);

        // Auto-complete when audio ends
        audio.onended = () => {
          clearInterval(progressInterval);
          completeSplash();
        };
      })
      .catch(error => {
        console.error('Error playing jingle:', error);
        // If audio fails, just show animation for 5 seconds
        setTimeout(completeSplash, 5000);
      });
  };

  const completeSplash = () => {
    // Save timestamp
    localStorage.setItem('buddy_last_splash', Date.now().toString());
    
    // Fade out
    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      onComplete();
    }, 500);
  };

  const handleSkip = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    completeSplash();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 z-[100] flex flex-col items-center justify-center"
    >
      {/* Animated Stars Background */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-300"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        
        {/* Logo/Title Animation */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.5 }}
          className="mb-12"
        >
          <div className="text-9xl mb-6">🐻</div>
          <h1 className="text-8xl font-bold text-white mb-4">Buddy's Treehouse</h1>
          <p className="text-3xl text-purple-200">Where Learning is an Adventure!</p>
        </motion.div>

        {/* Animated Musical Notes */}
        <div className="relative h-24 mb-12">
          {isPlaying && (
            <>
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="absolute left-1/2 text-6xl"
                  initial={{ y: 0, x: '-50%', opacity: 0 }}
                  animate={{
                    y: [-20, -100],
                    x: ['-50%', `${(i - 2) * 30}%`],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  🎵
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-96 mx-auto mb-8">
          <div className="h-4 bg-white/20 rounded-full overflow-hidden backdrop-blur-lg">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: 'linear' }}
            />
          </div>
        </div>

        {/* Loading Text */}
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl text-white/80 mb-8"
        >
          {progress < 100 ? 'Loading your adventure...' : 'Ready to explore!'}
        </motion.div>

        {/* Skip Button */}
        <AnimatePresence>
          {showSkip && progress < 100 && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onClick={handleSkip}
              className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-2xl text-white text-xl font-bold transition-all transform hover:scale-105"
            >
              Skip Intro →
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Decoration */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 text-white/60 text-lg"
      >
        🌳 Built with love for curious minds 🌟
      </motion.div>
    </motion.div>
  );
}

// =============== ALTERNATIVE: VIDEO INTRO COMPONENT ===============

interface VideoIntroProps {
  onComplete: () => void;
  videoUrl?: string; // Path to intro video with jingle
}

export function VideoIntro({ onComplete, videoUrl = '/video/buddy-intro.mp4' }: VideoIntroProps) {
  const [showSkip, setShowSkip] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Show skip after 3 seconds
    setTimeout(() => setShowSkip(true), 3000);

    // Check if should show
    const lastShown = localStorage.getItem('buddy_last_video');
    const now = Date.now();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (lastShown && now - parseInt(lastShown) < oneWeek) {
      onComplete();
    } else {
      // Play video
      if (videoRef.current) {
        videoRef.current.play().catch(err => {
          console.error('Video autoplay failed:', err);
          // If autoplay fails, show skip immediately
          setShowSkip(true);
        });
      }
    }
  }, []);

  const handleVideoEnd = () => {
    localStorage.setItem('buddy_last_video', Date.now().toString());
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('buddy_last_video', Date.now().toString());
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser doesn't support video playback.
      </video>

      {/* Skip Button */}
      <AnimatePresence>
        {showSkip && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleSkip}
            className="absolute top-8 right-8 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-lg rounded-xl text-white text-lg font-bold transition-all"
          >
            Skip →
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// =============== MINIMAL SPLASH (FAST LOADING) ===============

export function MinimalSplash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    // Just show logo for 2 seconds
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 to-pink-600 z-[100] flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
          className="text-9xl mb-6"
        >
          🐻
        </motion.div>
        <h1 className="text-6xl font-bold text-white">Buddy's Treehouse</h1>
      </motion.div>
    </motion.div>
  );
}
