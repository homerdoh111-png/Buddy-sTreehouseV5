import { motion } from 'framer-motion';
import { useState } from 'react';
import { useBuddyStore } from '../../store/buddyStore';
import { MODULES } from '../../config/activities.config';
import type { LearningModule } from '../../config/activities.config';
import ActivityModal from '../ActivityModal';

const BG_GRADIENTS: Record<string, string> = {
  math: 'from-blue-100 to-blue-50',
  reading: 'from-orange-100 to-orange-50',
  art: 'from-pink-100 to-pink-50',
  music: 'from-violet-100 to-violet-50',
  social: 'from-red-100 to-red-50',
  movement: 'from-teal-100 to-teal-50',
  nature: 'from-amber-100 to-amber-50',
  coding: 'from-slate-100 to-slate-50',
};

const HOVER_BORDERS: Record<string, string> = {
  math: 'hover:border-blue-200',
  reading: 'hover:border-orange-200',
  art: 'hover:border-pink-200',
  music: 'hover:border-violet-200',
  social: 'hover:border-red-200',
  movement: 'hover:border-teal-200',
  nature: 'hover:border-amber-200',
  coding: 'hover:border-slate-200',
};

function GenericModule({ module }: { module: LearningModule }) {
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const getActivityProgress = useBuddyStore((s) => s.getActivityProgress);
  const setCurrentModuleId = useBuddyStore((s) => s.setCurrentModuleId);

  const selectedActivity = module.activities.find((a) => a.id === selectedActivityId);
  const bgGradient = BG_GRADIENTS[module.id] || 'from-gray-100 to-gray-50';
  const hoverBorder = HOVER_BORDERS[module.id] || 'hover:border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`min-h-screen bg-gradient-to-b ${bgGradient} p-6`}
    >
      <div className="max-w-2xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentModuleId(null)}
          className="mb-6 px-4 py-2 bg-white/80 rounded-full font-body text-sm text-gray-600 hover:bg-white shadow"
        >
          &larr; Back to Treehouse
        </motion.button>

        <div className="text-center mb-8">
          <motion.span
            className="text-6xl inline-block"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {module.icon}
          </motion.span>
          <h1 className="font-buddy text-3xl mt-3" style={{ color: module.color }}>
            {module.title}
          </h1>
          <p className="font-body text-gray-600">{module.description}</p>
        </div>

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
                className={`bg-white rounded-2xl p-5 shadow-md hover:shadow-lg text-left transition-shadow border-2 border-transparent ${hoverBorder}`}
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

      {selectedActivity && (
        <ActivityModal
          activity={selectedActivity}
          onClose={() => setSelectedActivityId(null)}
        />
      )}
    </motion.div>
  );
}

// Export individual module components for each remaining module
export function MathModule() {
  const module = MODULES.find((m) => m.id === 'math')!;
  return <GenericModule module={module} />;
}

export function ReadingModule() {
  const module = MODULES.find((m) => m.id === 'reading')!;
  return <GenericModule module={module} />;
}

export function ArtModule() {
  const module = MODULES.find((m) => m.id === 'art')!;
  return <GenericModule module={module} />;
}

export function MusicModule() {
  const module = MODULES.find((m) => m.id === 'music')!;
  return <GenericModule module={module} />;
}

export function SocialModule() {
  const module = MODULES.find((m) => m.id === 'social')!;
  return <GenericModule module={module} />;
}

export function MovementModule() {
  const module = MODULES.find((m) => m.id === 'movement')!;
  return <GenericModule module={module} />;
}

export function NatureModule() {
  const module = MODULES.find((m) => m.id === 'nature')!;
  return <GenericModule module={module} />;
}

export function CodingModule() {
  const module = MODULES.find((m) => m.id === 'coding')!;
  return <GenericModule module={module} />;
}
