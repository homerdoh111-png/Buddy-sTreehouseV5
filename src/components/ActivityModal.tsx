// Activity Modal Component
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ActivityModalProps {
  onClose: () => void;
  activity: any;
  onComplete: (stars: number) => void;
}

export default function ActivityModal({
  onClose,
  activity,
  onComplete,
}: ActivityModalProps) {
  const [currentLevel, setCurrentLevel] = useState(0);

  if (!activity) return null;

  const level = activity.levels?.[currentLevel];
  const ActivityComponent = level?.component;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className={`bg-gradient-to-r ${activity.gradient || 'from-blue-500 to-purple-500'} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{activity.icon || '🎯'}</span>
                <div>
                  <h2 className="text-3xl font-bold">{activity.name}</h2>
                  {level && (
                    <p className="text-white/80">
                      Level {level.levelNumber} - {level.activity}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors text-3xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Level selector */}
            {activity.levels && activity.levels.length > 1 && (
              <div className="flex gap-2 mt-4">
                {activity.levels.map((lvl: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentLevel(i)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                      i === currentLevel
                        ? 'bg-white text-gray-800'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Level {lvl.levelNumber}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(90vh-160px)]">
            {ActivityComponent ? (
              <ActivityComponent
                level={level}
                onComplete={(stars: number) => onComplete(stars)}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">
                  Activity content coming soon!
                </p>
                <button
                  onClick={() => onComplete(level?.starsReward || 3)}
                  className="mt-6 px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-2xl transition-all"
                >
                  Complete Activity
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
