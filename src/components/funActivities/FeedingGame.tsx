// Feeding Game - Drag food to Buddy to make him happy!
// Inspired by Talking Tom 2 feeding mechanic
import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FeedingGameProps {
  onClose: () => void;
  onComplete: (happinessGained: number) => void;
}

const FOOD_ITEMS = [
  { id: 'apple', emoji: '&#127822;', name: 'Apple', happiness: 15, healthy: true },
  { id: 'banana', emoji: '&#127820;', name: 'Banana', happiness: 12, healthy: true },
  { id: 'pizza', emoji: '&#127829;', name: 'Pizza', happiness: 20, healthy: false },
  { id: 'cookie', emoji: '&#127850;', name: 'Cookie', happiness: 18, healthy: false },
  { id: 'broccoli', emoji: '&#129382;', name: 'Broccoli', happiness: 10, healthy: true },
  { id: 'cake', emoji: '&#127856;', name: 'Cake', happiness: 22, healthy: false },
  { id: 'watermelon', emoji: '&#127817;', name: 'Watermelon', happiness: 14, healthy: true },
  { id: 'icecream', emoji: '&#127846;', name: 'Ice Cream', happiness: 20, healthy: false },
];

export default function FeedingGame({ onClose, onComplete }: FeedingGameProps) {
  const [happiness, setHappiness] = useState(0);
  const [buddyState, setBuddyState] = useState<'hungry' | 'eating' | 'happy' | 'full'>('hungry');
  const [feedCount, setFeedCount] = useState(0);
  const [flyingFood, setFlyingFood] = useState<{ id: string; emoji: string } | null>(null);
  const [reaction, setReaction] = useState('');
  const [gameComplete, setGameComplete] = useState(false);
  const buddyRef = useRef<HTMLDivElement>(null);
  const maxFeedings = 6;

  const feedBuddy = useCallback((food: typeof FOOD_ITEMS[0]) => {
    if (buddyState === 'eating' || gameComplete) return;

    setFlyingFood({ id: food.id, emoji: food.emoji });
    setBuddyState('eating');

    // Food reaches Buddy
    setTimeout(() => {
      setFlyingFood(null);
      const newHappiness = Math.min(100, happiness + food.happiness);
      setHappiness(newHappiness);
      const newFeedCount = feedCount + 1;
      setFeedCount(newFeedCount);

      if (food.healthy) {
        setReaction('Yummy and healthy!');
      } else {
        setReaction('Mmm, so tasty!');
      }

      // Eating animation duration
      setTimeout(() => {
        setBuddyState(newHappiness >= 100 ? 'full' : 'happy');
        setTimeout(() => {
          setReaction('');
          if (newFeedCount >= maxFeedings || newHappiness >= 100) {
            setGameComplete(true);
          } else {
            setBuddyState('hungry');
          }
        }, 800);
      }, 600);
    }, 500);
  }, [buddyState, happiness, feedCount, gameComplete]);

  const getBuddyEmoji = () => {
    switch (buddyState) {
      case 'eating': return '\uD83D\uDE0B'; // yum face
      case 'happy': return '\uD83D\uDE0A';  // happy face
      case 'full': return '\uD83E\uDD29';   // star eyes
      default: return '\uD83D\uDC3B';       // bear
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 flex flex-col touch-none select-none">
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-6">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-gray-700 text-2xl font-bold active:scale-90 transition-transform"
        >
          &larr;
        </button>
        <div className="text-xl font-bold text-amber-800">Feed Buddy!</div>
        <div className="w-12" />
      </div>

      {/* Happiness Meter */}
      <div className="px-6 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">&#128150;</span>
          <span className="text-sm font-bold text-amber-800">Happiness</span>
          <span className="text-sm text-amber-600 ml-auto">{happiness}%</span>
        </div>
        <div className="w-full h-4 bg-amber-200 rounded-full overflow-hidden border border-amber-300">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-400"
            animate={{ width: `${happiness}%` }}
            transition={{ type: 'spring', damping: 15 }}
          />
        </div>
      </div>

      {/* Buddy Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Table */}
        <div className="absolute bottom-[25%] w-[70%] h-4 bg-amber-700 rounded-full shadow-lg" />
        <div className="absolute bottom-[22%] w-[60%] h-3 bg-amber-800/30 rounded-full blur-sm" />

        {/* Buddy */}
        <div ref={buddyRef} className="relative mb-8">
          <motion.div
            animate={
              buddyState === 'eating'
                ? { scale: [1, 1.1, 0.95, 1.05, 1], rotate: [0, 3, -3, 2, 0] }
                : buddyState === 'happy'
                ? { scale: [1, 1.05, 1], y: [0, -5, 0] }
                : { scale: 1, y: 0 }
            }
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="text-[120px] leading-none" dangerouslySetInnerHTML={{ __html: getBuddyEmoji() }} />
          </motion.div>

          {/* Speech bubble reaction */}
          <AnimatePresence>
            {reaction && (
              <motion.div
                initial={{ opacity: 0, scale: 0, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-2 shadow-lg whitespace-nowrap"
              >
                <span className="text-sm font-bold text-amber-700">{reaction}</span>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-white rotate-45" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Flying food animation */}
        <AnimatePresence>
          {flyingFood && (
            <motion.div
              initial={{ opacity: 1, y: 100, x: 0, scale: 1 }}
              animate={{ opacity: 1, y: -100, x: 0, scale: 0.5 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute bottom-[35%] text-5xl pointer-events-none z-20"
              dangerouslySetInnerHTML={{ __html: flyingFood.emoji }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Food Tray */}
      <div className="bg-amber-800/20 backdrop-blur-sm border-t border-amber-300 p-4 pb-8">
        <div className="flex justify-center gap-3 flex-wrap max-w-lg mx-auto">
          {FOOD_ITEMS.map((food) => (
            <button
              key={food.id}
              onPointerDown={() => feedBuddy(food)}
              disabled={buddyState === 'eating' || gameComplete}
              className="w-[72px] h-[72px] rounded-2xl bg-white shadow-md flex items-center justify-center text-4xl active:scale-90 transition-transform disabled:opacity-40 border-2 border-amber-200"
            >
              <span dangerouslySetInnerHTML={{ __html: food.emoji }} />
            </button>
          ))}
        </div>
      </div>

      {/* Game Complete Overlay */}
      <AnimatePresence>
        {gameComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-white rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full"
            >
              <div className="text-6xl mb-4">&#128523;</div>
              <h2 className="text-3xl font-black text-gray-800 mb-2">Buddy is full!</h2>
              <p className="text-lg text-gray-500 mb-6">
                You made Buddy so happy!
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setHappiness(0);
                    setFeedCount(0);
                    setBuddyState('hungry');
                    setGameComplete(false);
                    setReaction('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform shadow-lg"
                >
                  Feed Again
                </button>
                <button
                  onClick={() => { onComplete(happiness); onClose(); }}
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
