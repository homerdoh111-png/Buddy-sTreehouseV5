// Basketball Game - Tap to shoot hoops with Buddy!
// Inspired by Talking Tom 2 mini-games
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BasketballGameProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function BasketballGame({ onClose, onComplete }: BasketballGameProps) {
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [shooting, setShooting] = useState(false);
  const [lastResult, setLastResult] = useState<'none' | 'score' | 'miss'>('none');
  const [buddyReaction, setBuddyReaction] = useState('idle');
  const [gameOver, setGameOver] = useState(false);
  const maxShots = 10;

  const shoot = useCallback(() => {
    if (shooting || gameOver) return;
    setShooting(true);
    setLastResult('none');

    const scored = Math.random() > 0.35; // 65% chance to score

    setTimeout(() => {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (scored) {
        setScore((s) => s + 1);
        setLastResult('score');
        setBuddyReaction('celebrate');
      } else {
        setLastResult('miss');
        setBuddyReaction('sad');
      }

      setTimeout(() => {
        setShooting(false);
        setBuddyReaction('idle');
        setLastResult('none');

        if (newAttempts >= maxShots) {
          setGameOver(true);
        }
      }, 1200);
    }, 800);
  }, [shooting, attempts, gameOver]);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-sky-400 via-sky-300 to-green-400 flex flex-col touch-none select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-6">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold active:scale-90 transition-transform"
        >
          &larr;
        </button>
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl px-6 py-2 text-white font-bold text-xl">
          {score} / {attempts} {attempts < maxShots && `(${maxShots - attempts} left)`}
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 relative flex flex-col items-center justify-center overflow-hidden">
        {/* Backboard and Hoop */}
        <div className="absolute top-[8%] left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Backboard */}
          <div className="w-32 h-24 bg-white border-4 border-red-600 rounded-md relative">
            <div className="absolute inset-3 border-2 border-red-500 rounded-sm" />
          </div>
          {/* Rim */}
          <div className="w-28 h-4 border-4 border-orange-500 rounded-b-full -mt-1 relative">
            {/* Net lines */}
            <div className="absolute top-full left-2 w-0.5 h-8 bg-white/60" />
            <div className="absolute top-full left-4 w-0.5 h-10 bg-white/60" />
            <div className="absolute top-full right-4 w-0.5 h-10 bg-white/60" />
            <div className="absolute top-full right-2 w-0.5 h-8 bg-white/60" />
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0.5 h-12 bg-white/60" />
          </div>
        </div>

        {/* Score flash */}
        <AnimatePresence>
          {lastResult === 'score' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: 1, scale: 1.2, y: -20 }}
              exit={{ opacity: 0, y: -60 }}
              className="absolute top-[30%] left-1/2 -translate-x-1/2 text-6xl font-black text-yellow-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] z-20"
            >
              SWISH!
            </motion.div>
          )}
          {lastResult === 'miss' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-[30%] left-1/2 -translate-x-1/2 text-5xl font-black text-red-300 drop-shadow-[0_3px_6px_rgba(0,0,0,0.4)] z-20"
            >
              Miss!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ball */}
        <motion.div
          className="absolute bottom-[22%] left-1/2 z-10"
          animate={
            shooting
              ? {
                  x: [0, 0],
                  y: [0, -300, -400],
                  scale: [1, 0.7, 0.4],
                  opacity: [1, 1, 0],
                }
              : { x: 0, y: 0, scale: 1, opacity: 1 }
          }
          transition={shooting ? { duration: 0.8, ease: 'easeOut' } : { duration: 0.3 }}
          style={{ translateX: '-50%' }}
        >
          <button
            onPointerDown={shoot}
            disabled={shooting || gameOver}
            className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 shadow-xl flex items-center justify-center text-5xl active:scale-90 transition-transform border-2 border-orange-700 touch-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 35% 35%, #f97316, #c2410c)',
            }}
          >
            <span className="drop-shadow-md text-4xl">&#127936;</span>
          </button>
        </motion.div>

        {/* Buddy */}
        <div className="absolute bottom-[4%] right-[10%]">
          <motion.div
            animate={
              buddyReaction === 'celebrate'
                ? { y: [0, -15, 0], rotate: [0, 5, -5, 0] }
                : buddyReaction === 'sad'
                ? { y: 0, rotate: [0, -3, 3, 0] }
                : { y: 0, rotate: 0 }
            }
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="text-[80px] leading-none">
              {buddyReaction === 'celebrate' ? '&#129395;' : buddyReaction === 'sad' ? '&#128533;' : '&#128059;'}
            </div>
            <AnimatePresence>
              {buddyReaction === 'celebrate' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-bold text-white bg-green-500/80 rounded-full px-3 py-1 mt-1"
                >
                  Great shot!
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Tap instruction */}
        {!shooting && !gameOver && attempts === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-[48%] text-white text-xl font-bold drop-shadow-lg"
          >
            Tap the ball to shoot!
          </motion.div>
        )}
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-white rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-6xl mb-4">&#127942;</div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">Game Over!</h2>
              <p className="text-5xl font-black text-orange-500 mb-2">
                {score}/{maxShots}
              </p>
              <p className="text-lg text-gray-500 mb-6">
                {score >= 8 ? 'Amazing!' : score >= 5 ? 'Nice job!' : 'Keep practicing!'}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setScore(0);
                    setAttempts(0);
                    setGameOver(false);
                    setShooting(false);
                    setLastResult('none');
                    setBuddyReaction('idle');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform shadow-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={() => { onComplete(); onClose(); }}
                  className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform shadow-lg"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
