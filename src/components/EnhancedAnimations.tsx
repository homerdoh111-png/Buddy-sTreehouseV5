// 🎉 ENHANCED ANIMATIONS
// Confetti, star collection, level-up sequences, and more

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// =============== CONFETTI COMPONENT ===============
export function Confetti({ duration = 3000, onComplete }: { duration?: number; onComplete?: () => void }) {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate confetti particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: -20,
      rotation: Math.random() * 360,
      color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94'][Math.floor(Math.random() * 5)],
      size: Math.random() * 10 + 5,
      velocityX: (Math.random() - 0.5) * 5,
      velocityY: Math.random() * 3 + 2,
    }));
    
    setParticles(newParticles);

    const timer = setTimeout(() => {
      setParticles([]);
      if (onComplete) onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute"
          initial={{
            x: particle.x,
            y: particle.y,
            rotate: particle.rotation,
          }}
          animate={{
            y: window.innerHeight + 20,
            x: particle.x + particle.velocityX * 100,
            rotate: particle.rotation + 360 * 3,
          }}
          transition={{
            duration: duration / 1000,
            ease: 'linear',
          }}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '0%',
          }}
        />
      ))}
    </div>
  );
}

// =============== STAR COLLECTION ANIMATION ===============
export function StarCollectionAnimation({ 
  stars, 
  onComplete 
}: { 
  stars: number; 
  onComplete?: () => void;
}) {
  const [collected, setCollected] = useState(0);

  useEffect(() => {
    if (collected < stars) {
      const timer = setTimeout(() => {
        setCollected(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else if (onComplete) {
      const timer = setTimeout(onComplete, 500);
      return () => clearTimeout(timer);
    }
  }, [collected, stars, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="flex gap-4">
        {Array.from({ length: stars }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={
              i < collected
                ? {
                    scale: [0, 1.5, 1],
                    rotate: [180, 0],
                    opacity: [0, 1, 1],
                    y: [50, -20, 0],
                  }
                : {}
            }
            transition={{
              duration: 0.6,
              delay: i * 0.15,
              ease: 'easeOut',
            }}
            className="text-9xl"
          >
            ⭐
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// =============== LEVEL UP SEQUENCE ===============
export function LevelUpAnimation({ 
  onComplete 
}: { 
  onComplete?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center pointer-events-none"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ 
          scale: [0, 1.2, 1],
          rotate: [180, 0, 0],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: 2,
            repeatDelay: 0.2,
          }}
          className="text-9xl mb-6"
        >
          🎉
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-white"
        >
          <div className="text-6xl font-bold mb-4">LEVEL UP!</div>
          <div className="text-3xl">You're getting better!</div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// =============== ACHIEVEMENT UNLOCK ANIMATION ===============
export function AchievementUnlockAnimation({
  achievement,
  onComplete,
}: {
  achievement: { icon: string; name: string; description: string };
  onComplete?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{
          scale: [0, 1.2, 1],
          rotate: [180, 0, 0],
        }}
        transition={{
          duration: 0.8,
          ease: 'easeOut',
        }}
        className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl p-12 shadow-2xl text-center max-w-2xl"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="text-9xl mb-6"
        >
          {achievement.icon}
        </motion.div>
        
        <div className="text-white">
          <div className="text-5xl font-bold mb-4">Achievement Unlocked!</div>
          <div className="text-3xl font-bold mb-2">{achievement.name}</div>
          <div className="text-xl opacity-90">{achievement.description}</div>
        </div>

        {/* Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 1,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// =============== BUDDY CELEBRATION DANCE ===============
export function BuddyCelebrationDance() {
  return (
    <motion.div
      animate={{
        scale: [1, 1.2, 1, 1.2, 1],
        rotate: [0, -10, 10, -10, 0],
      }}
      transition={{
        duration: 1,
        repeat: 2,
      }}
      className="inline-block"
    >
      🐻
    </motion.div>
  );
}

// =============== SUCCESS PARTICLES ===============
export function SuccessParticles() {
  const [particles] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      angle: (i / 20) * Math.PI * 2,
      distance: 100 + Math.random() * 50,
    }))
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map(particle => (
        <motion.div
          key={particle.id}
          className="absolute top-1/2 left-1/2 text-4xl"
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: 0,
            scale: 1,
          }}
          transition={{
            duration: 0.8,
            ease: 'easeOut',
          }}
        >
          ✨
        </motion.div>
      ))}
    </div>
  );
}

// =============== MODULE UNLOCK ANIMATION ===============
export function ModuleUnlockAnimation({
  module,
  onComplete,
}: {
  module: { icon: string; name: string };
  onComplete?: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-900/90 to-blue-900/90 z-50 flex items-center justify-center"
    >
      <div className="text-center">
        {/* Lock Breaking Animation */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.5, 0],
            rotate: [0, 180, 360],
            opacity: [1, 1, 0],
          }}
          transition={{
            duration: 1,
          }}
          className="text-9xl mb-6"
        >
          🔒
        </motion.div>

        {/* Module Icon Reveal */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.5,
              repeat: 2,
              repeatDelay: 0.3,
            }}
            className="text-9xl mb-6"
          >
            {module.icon}
          </motion.div>
          
          <div className="text-white">
            <div className="text-5xl font-bold mb-4">New Module Unlocked!</div>
            <div className="text-3xl">{module.name}</div>
          </div>
        </motion.div>

        {/* Sparkle Effect */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-5xl"
              initial={{
                x: '50%',
                y: '50%',
                opacity: 0,
              }}
              animate={{
                x: `${Math.random() * 100}%`,
                y: `${Math.random() * 100}%`,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                delay: 1 + i * 0.05,
                ease: 'easeOut',
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// =============== LOADING SPINNER ===============
export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="text-8xl"
      >
        ⭐
      </motion.div>
      <div className="text-2xl text-gray-600 font-medium">{message}</div>
    </div>
  );
}

// =============== PULSE ANIMATION (for highlighting) ===============
export function PulseHighlight({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0)',
          '0 0 0 10px rgba(59, 130, 246, 0.3)',
          '0 0 0 0 rgba(59, 130, 246, 0)',
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
      }}
      className="rounded-3xl"
    >
      {children}
    </motion.div>
  );
}
