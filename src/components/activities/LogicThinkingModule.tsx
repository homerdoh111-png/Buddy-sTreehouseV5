import { motion } from 'framer-motion';
import { useState } from 'react';
import { useBuddyStore } from '../../store/buddyStore';
import { MODULES } from '../../config/activities.config';
import ActivityModal from '../ActivityModal';

export default function LogicThinkingModule() {
  const module = MODULES.find((m) => m.id === 'logic')!;
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const getActivityProgress = useBuddyStore((s) => s.getActivityProgress);
  const setCurrentModuleId = useBuddyStore((s) => s.setCurrentModuleId);

  const selectedActivity = module.activities.find((a) => a.id === selectedActivityId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-purple-100 to-purple-50 p-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Back button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentModuleId(null)}
          className="mb-6 px-4 py-2 bg-white/80 rounded-full font-body text-sm text-gray-600 hover:bg-white shadow"
        >
          &larr; Back to Treehouse
        </motion.button>

        {/* Module Header */}
        <div className="text-center mb-8">
          <motion.span
            className="text-6xl inline-block"
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {module.icon}
          </motion.span>
          <h1 className="font-buddy text-3xl mt-3" style={{ color: module.color }}>
            {module.title}
          </h1>
          <p className="font-body text-gray-600">{module.description}</p>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {module.activities.map((activity, index) => {
            const progress = getActivityProgress(activity.id);
            return (
              <motion.button
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedActivityId(activity.id)}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg text-left transition-shadow border-2 border-transparent hover:border-purple-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{activity.icon}</span>
                  <div>
                    <h3 className="font-buddy text-base text-gray-800">{activity.title}</h3>
                    <p className="font-body text-xs text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-0.5">
                    {Array.from({ length: activity.stars }, (_, i) => (
                      <span key={i} className="text-sm">
                        {i < progress.starsEarned ? '⭐' : '☆'}
                      </span>
                    ))}
                  </div>
                  <span
                    className={`text-xs font-body px-2 py-0.5 rounded-full ${
                      activity.difficulty === 'easy'
                        ? 'bg-green-100 text-green-700'
                        : activity.difficulty === 'medium'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {activity.difficulty}
                  </span>
                </div>
                {progress.completed && (
                  <div className="mt-2 text-center">
                    <span className="text-xs font-body text-green-600 font-semibold">Completed ✅</span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Activity Modal */}
      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </motion.div>
  );
}
