// TreehouseInterior - Buddy's cozy room with fun activity stations
// Inspired by Talking Tom 2's room interface
import { useState } from 'react';
import { motion } from 'framer-motion';
import BasketballGame from './funActivities/BasketballGame';
import FeedingGame from './funActivities/FeedingGame';
import BedtimeGame from './funActivities/BedtimeGame';
import { useBuddyStore } from '../store/buddyStore';

interface TreehouseInteriorProps {
  onBack: () => void;
}

interface FunActivity {
  id: string;
  name: string;
  icon: string;
  starsRequired: number;
  description: string;
  gradient: string;
}

const FUN_ACTIVITIES: FunActivity[] = [
  {
    id: 'basketball',
    name: 'Basketball',
    icon: '\uD83C\uDFC0',
    starsRequired: 10,
    description: 'Shoot hoops with Buddy!',
    gradient: 'from-orange-400 to-red-500',
  },
  {
    id: 'feeding',
    name: 'Feed Buddy',
    icon: '\uD83C\uDF55',
    starsRequired: 20,
    description: 'Feed Buddy yummy food!',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'bedtime',
    name: 'Bedtime',
    icon: '\uD83D\uDECF\uFE0F',
    starsRequired: 30,
    description: 'Tuck Buddy into bed!',
    gradient: 'from-indigo-400 to-purple-500',
  },
];

export default function TreehouseInterior({ onBack }: TreehouseInteriorProps) {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const { totalStars, buddyHappiness, buddyEnergy, playFunActivity, setBuddyHappiness, setBuddyEnergy } = useBuddyStore();

  const handleGameComplete = (gameId: string, value: number) => {
    playFunActivity(gameId);
    if (gameId === 'basketball') {
      setBuddyHappiness(Math.min(100, buddyHappiness + 15));
    } else if (gameId === 'feeding') {
      setBuddyHappiness(Math.min(100, buddyHappiness + value * 0.3));
    } else if (gameId === 'bedtime') {
      setBuddyEnergy(value);
    }
  };

  // Render active mini-game
  if (activeGame === 'basketball') {
    return (
      <BasketballGame
        onClose={() => setActiveGame(null)}
        onComplete={() => handleGameComplete('basketball', 0)}
      />
    );
  }
  if (activeGame === 'feeding') {
    return (
      <FeedingGame
        onClose={() => setActiveGame(null)}
        onComplete={(happiness) => handleGameComplete('feeding', happiness)}
      />
    );
  }
  if (activeGame === 'bedtime') {
    return (
      <BedtimeGame
        onClose={() => setActiveGame(null)}
        onComplete={(energy) => handleGameComplete('bedtime', energy)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-0 select-none">
      {/* Room Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-800 via-amber-700 to-amber-900">
        {/* Wooden wall texture */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute left-0 right-0 border-b border-amber-950/30"
              style={{ top: `${i * 5}%` }}
            />
          ))}
        </div>

        {/* Window */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="absolute top-[8%] left-[8%] w-28 h-32 md:w-36 md:h-40 rounded-t-full border-4 border-amber-950 bg-gradient-to-b from-sky-300 to-sky-400 overflow-hidden shadow-inner"
        >
          {/* Window panes */}
          <div className="absolute inset-0 border-r-2 border-amber-950/50" style={{ right: '50%' }} />
          <div className="absolute inset-0 border-b-2 border-amber-950/50" style={{ bottom: '45%' }} />
          {/* Clouds */}
          <motion.div
            animate={{ x: [-20, 80] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute top-[20%] text-3xl opacity-80"
          >
            &#9925;
          </motion.div>
          {/* Sunlight glow */}
          <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-200/40 rounded-full blur-xl" />
        </motion.div>

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-gradient-to-t from-amber-950 via-amber-900 to-amber-800 border-t-4 border-amber-950/50">
          {/* Floor boards */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute top-0 bottom-0 border-r border-amber-950/20"
              style={{ left: `${i * 12.5}%` }}
            />
          ))}
        </div>

        {/* Cozy rug */}
        <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[60%] h-[10%] bg-red-800/50 rounded-full blur-sm border border-red-900/30" />
      </div>

      {/* Room Contents */}
      <div className="absolute inset-0 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 pt-6 z-10">
          <button
            onClick={onBack}
            className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold active:scale-90 transition-transform"
          >
            &larr;
          </button>

          <div className="text-center">
            <h2 className="text-xl font-black text-amber-100 drop-shadow-lg">Buddy's Room</h2>
          </div>

          <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-yellow-400 font-bold">&#11088; {totalStars}</span>
          </div>
        </div>

        {/* Status Bars */}
        <div className="px-6 flex gap-4 z-10">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-xs">&#128150;</span>
              <span className="text-[10px] font-bold text-amber-200">Happy</span>
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-pink-400 to-red-400"
                animate={{ width: `${buddyHappiness}%` }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-xs">&#9889;</span>
              <span className="text-[10px] font-bold text-amber-200">Energy</span>
            </div>
            <div className="h-2.5 bg-black/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-green-400"
                animate={{ width: `${buddyEnergy}%` }}
              />
            </div>
          </div>
        </div>

        {/* Buddy in the center */}
        <div className="flex-1 flex items-center justify-center relative">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="text-center"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="text-[140px] md:text-[160px] leading-none drop-shadow-2xl">
                {buddyEnergy < 20 ? '\uD83D\uDE34' : buddyHappiness > 80 ? '\uD83D\uDE0A' : '\uD83D\uDC3B'}
              </div>
            </motion.div>
            <p className="text-amber-200 font-bold mt-2 text-lg drop-shadow-lg">
              {buddyEnergy < 20 ? "Buddy is tired..." : buddyHappiness > 80 ? "Buddy is happy!" : "Hey there!"}
            </p>
          </motion.div>
        </div>

        {/* Fun Activity Stations */}
        <div className="px-4 pb-8 z-10">
          <div className="flex justify-center gap-4 max-w-lg mx-auto">
            {FUN_ACTIVITIES.map((activity, index) => {
              const isLocked = totalStars < activity.starsRequired;

              return (
                <motion.button
                  key={activity.id}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1, type: 'spring' }}
                  onClick={() => !isLocked && setActiveGame(activity.id)}
                  disabled={isLocked}
                  className={`relative flex-1 max-w-[140px] rounded-2xl p-4 transition-all active:scale-95 ${
                    isLocked
                      ? 'bg-black/40 backdrop-blur-sm border border-white/5 cursor-not-allowed'
                      : `bg-gradient-to-br ${activity.gradient} shadow-xl border border-white/20 hover:shadow-2xl`
                  }`}
                >
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-black/30">
                      <div className="text-center">
                        <span className="text-2xl">&#128274;</span>
                        <p className="text-[10px] text-white/60 mt-1">{activity.starsRequired}&#11088;</p>
                      </div>
                    </div>
                  )}
                  <div className={`text-center ${isLocked ? 'opacity-30 blur-[1px]' : ''}`}>
                    <div className="text-4xl mb-2">{activity.icon}</div>
                    <div className="text-xs font-bold text-white">{activity.name}</div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
