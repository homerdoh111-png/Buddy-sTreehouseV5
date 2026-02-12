import { motion } from 'framer-motion';
import { useBuddyStore } from '../store/buddyStore';
import { MODULES, ACHIEVEMENTS, TOTAL_STARS, TOTAL_ACTIVITIES } from '../config/activities.config';

export default function ParentDashboard() {
  const {
    playerName,
    totalStars,
    totalCompleted,
    streak,
    unlockedAchievements,
    activityProgress,
    sessionsCompleted,
    sessionStartTime,
    setCurrentScreen,
    resetProgress,
  } = useBuddyStore();

  const completionPercent = Math.round((totalCompleted / TOTAL_ACTIVITIES) * 100);
  const starPercent = Math.round((totalStars / TOTAL_STARS) * 100);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      resetProgress();
    }
  };

  const getModuleProgress = (moduleId: string) => {
    const mod = MODULES.find((m) => m.id === moduleId);
    if (!mod) return { completed: 0, total: 0, stars: 0, totalStars: 0 };

    let completed = 0;
    let stars = 0;
    let totalModStars = 0;

    for (const activity of mod.activities) {
      const progress = activityProgress[activity.id];
      if (progress?.completed) completed++;
      stars += progress?.starsEarned || 0;
      totalModStars += activity.stars;
    }

    return { completed, total: mod.activities.length, stars, totalStars: totalModStars };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8"
    >
      {/* Header */}
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-buddy text-3xl text-gray-800">Parent Dashboard</h1>
            <p className="font-body text-gray-500">Tracking {playerName}'s learning journey</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('menu')}
            className="px-5 py-2 bg-treehouse-green text-white font-buddy rounded-full shadow"
          >
            Back to Treehouse
          </motion.button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon="⭐" label="Stars Earned" value={`${totalStars}/${TOTAL_STARS}`} percent={starPercent} color="bg-yellow-100" />
          <StatCard icon="✅" label="Activities" value={`${totalCompleted}/${TOTAL_ACTIVITIES}`} percent={completionPercent} color="bg-green-100" />
          <StatCard icon="🔥" label="Streak" value={`${streak}`} percent={0} color="bg-orange-100" />
          <StatCard icon="🏆" label="Achievements" value={`${unlockedAchievements.length}/${ACHIEVEMENTS.length}`} percent={Math.round((unlockedAchievements.length / ACHIEVEMENTS.length) * 100)} color="bg-purple-100" />
        </div>

        {/* Module Progress */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-buddy text-xl text-gray-800 mb-4">Module Progress</h2>
          <div className="space-y-3">
            {MODULES.map((mod) => {
              const prog = getModuleProgress(mod.id);
              const pct = mod.activities.length > 0 ? Math.round((prog.completed / prog.total) * 100) : 0;
              return (
                <div key={mod.id} className="flex items-center gap-3">
                  <span className="text-2xl w-10">{mod.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-body text-sm font-semibold text-gray-700">{mod.title}</span>
                      <span className="font-body text-sm text-gray-500">
                        {prog.completed}/{prog.total} activities | {prog.stars}/{prog.totalStars} ⭐
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="h-2.5 rounded-full"
                        style={{ backgroundColor: mod.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-buddy text-xl text-gray-800 mb-4">Achievements</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {ACHIEVEMENTS.map((ach) => {
              const unlocked = unlockedAchievements.includes(ach.id);
              return (
                <div
                  key={ach.id}
                  className={`p-3 rounded-xl border-2 text-center transition-all ${
                    unlocked ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-gray-50 opacity-50'
                  }`}
                >
                  <span className="text-3xl">{unlocked ? ach.icon : '🔒'}</span>
                  <p className="font-buddy text-sm mt-1">{ach.title}</p>
                  <p className="font-body text-xs text-gray-500">{ach.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session Info */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="font-buddy text-xl text-gray-800 mb-4">Session Info</h2>
          <div className="font-body text-sm text-gray-600 space-y-1">
            <p>Current session started: {new Date(sessionStartTime).toLocaleString()}</p>
            <p>Total sessions: {sessionsCompleted}</p>
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center mt-8 mb-12">
          <button
            onClick={handleReset}
            className="font-body text-sm text-red-400 hover:text-red-600 underline transition-colors"
          >
            Reset All Progress
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({
  icon,
  label,
  value,
  percent,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  percent: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`${color} rounded-2xl p-4 shadow-sm`}
    >
      <span className="text-3xl">{icon}</span>
      <p className="font-body text-xs text-gray-600 mt-2">{label}</p>
      <p className="font-buddy text-lg text-gray-800">{value}</p>
      {percent > 0 && (
        <div className="w-full bg-white/50 rounded-full h-1.5 mt-2">
          <div className="bg-gray-800/30 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
        </div>
      )}
    </motion.div>
  );
}
