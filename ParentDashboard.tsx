// 📊 PARENT DASHBOARD
// Complete analytics, progress tracking, and reporting for parents

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useBuddyStore } from '../store/buddyStore';

export function ParentDashboard({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'analytics' | 'reports'>('overview');
  
  const {
    totalStars,
    completedLevels,
    achievements,
  } = useBuddyStore();

  // Calculate statistics
  const stats = useMemo(() => {
    const totalActivities = Object.keys(completedLevels).length;
    const totalCompletions = Object.values(completedLevels).reduce(
      (sum, levels) => sum + Object.keys(levels).length,
      0
    );

    const unlockedAchievements = Object.values(achievements).filter(a => a.unlocked).length;
    const totalAchievements = Object.keys(achievements).length;

    // Calculate average stars per activity
    const totalStarsEarned = Object.values(completedLevels).reduce((sum, levels) => {
      return sum + Object.values(levels).reduce((levelSum, level) => levelSum + (level.starsEarned || 0), 0);
    }, 0);
    
    const avgStars = totalCompletions > 0 ? (totalStarsEarned / totalCompletions).toFixed(1) : '0';

    // Module progress
    const moduleProgress: { [key: string]: { completed: number; total: number; stars: number } } = {};
    
    Object.entries(completedLevels).forEach(([activityId, levels]) => {
      const module = getModuleFromActivity(activityId);
      if (!moduleProgress[module]) {
        moduleProgress[module] = { completed: 0, total: 0, stars: 0 };
      }
      
      moduleProgress[module].completed += Object.keys(levels).length;
      moduleProgress[module].stars += Object.values(levels).reduce(
        (sum, level) => sum + (level.starsEarned || 0),
        0
      );
    });

    return {
      totalStars,
      totalActivities,
      totalCompletions,
      unlockedAchievements,
      totalAchievements,
      avgStars,
      moduleProgress,
    };
  }, [totalStars, completedLevels, achievements]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-bold mb-2">Parent Dashboard</h2>
              <p className="text-purple-100">Track your child's learning progress</p>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 bg-gray-50 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: '📊' },
            { id: 'progress', label: 'Progress', icon: '📈' },
            { id: 'analytics', label: 'Analytics', icon: '🎯' },
            { id: 'reports', label: 'Reports', icon: '📄' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && <OverviewTab stats={stats} achievements={achievements} />}
          {activeTab === 'progress' && <ProgressTab stats={stats} completedLevels={completedLevels} />}
          {activeTab === 'analytics' && <AnalyticsTab stats={stats} />}
          {activeTab === 'reports' && <ReportsTab stats={stats} />}
        </div>
      </motion.div>
    </motion.div>
  );
}

// Overview Tab
function OverviewTab({ stats, achievements }: any) {
  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-6">
        <MetricCard
          icon="⭐"
          label="Total Stars"
          value={stats.totalStars}
          color="from-yellow-400 to-orange-500"
        />
        <MetricCard
          icon="✓"
          label="Activities Completed"
          value={stats.totalCompletions}
          color="from-green-400 to-emerald-500"
        />
        <MetricCard
          icon="🏆"
          label="Achievements"
          value={`${stats.unlockedAchievements}/${stats.totalAchievements}`}
          color="from-purple-400 to-pink-500"
        />
        <MetricCard
          icon="📊"
          label="Average Stars"
          value={stats.avgStars}
          color="from-blue-400 to-cyan-500"
        />
      </div>

      {/* Recent Achievements */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🏆 Recent Achievements</h3>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(achievements)
            .filter(([_, achievement]: any) => achievement.unlocked)
            .slice(0, 6)
            .map(([id, achievement]: any) => (
              <div key={id} className="bg-white rounded-xl p-4 shadow-lg">
                <div className="text-5xl mb-2 text-center">{getAchievementIcon(id)}</div>
                <div className="text-center">
                  <div className="font-bold text-gray-800">{getAchievementName(id)}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Module Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📚 Module Progress</h3>
        <div className="space-y-4">
          {Object.entries(stats.moduleProgress).map(([module, progress]: any) => (
            <div key={module}>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-gray-800">{getModuleName(module)}</span>
                <span className="text-gray-600">{progress.stars} stars</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                  style={{ width: `${Math.min(100, (progress.stars / 20) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Progress Tab
function ProgressTab({ stats, completedLevels }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📈 Learning Progress</h3>
        
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(completedLevels).map(([activityId, levels]: any) => (
            <div key={activityId} className="bg-white rounded-xl p-4 shadow-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-4xl">{getActivityIcon(activityId)}</div>
                <div>
                  <div className="font-bold text-gray-800">{getActivityName(activityId)}</div>
                  <div className="text-sm text-gray-500">{Object.keys(levels).length} levels completed</div>
                </div>
              </div>
              
              {/* Level details */}
              <div className="space-y-2">
                {Object.entries(levels).map(([levelNum, level]: any) => (
                  <div key={levelNum} className="flex justify-between text-sm">
                    <span>Level {levelNum}</span>
                    <div className="flex gap-1">
                      {Array(level.starsEarned || 0).fill(0).map((_, i) => (
                        <span key={i}>⭐</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Analytics Tab
function AnalyticsTab({ stats }: any) {
  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🎯 Learning Analytics</h3>
        
        {/* Strength Areas */}
        <div className="mb-8">
          <h4 className="text-xl font-bold text-gray-700 mb-3">💪 Strength Areas</h4>
          <div className="grid grid-cols-3 gap-4">
            {getTopModules(stats.moduleProgress).map(([module, progress]: any) => (
              <div key={module} className="bg-white rounded-xl p-4 text-center shadow-lg">
                <div className="text-5xl mb-2">{getModuleIcon(module)}</div>
                <div className="font-bold">{getModuleName(module)}</div>
                <div className="text-2xl font-bold text-green-600">{progress.stars} ⭐</div>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Growth */}
        <div>
          <h4 className="text-xl font-bold text-gray-700 mb-3">🌱 Areas for Growth</h4>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <p className="text-gray-600">
              Focus on modules with fewer stars to build well-rounded skills!
            </p>
            <div className="mt-4 space-y-2">
              {getBottomModules(stats.moduleProgress).map(([module, _]: any) => (
                <div key={module} className="flex items-center gap-3">
                  <div className="text-3xl">{getModuleIcon(module)}</div>
                  <div className="flex-1 text-gray-700 font-medium">{getModuleName(module)}</div>
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all">
                    Practice →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reports Tab
function ReportsTab({ stats }: any) {
  const generateReport = () => {
    // Generate PDF report (would integrate with a PDF library)
    alert('Report generation coming soon! 📄');
  };

  const sendEmailReport = () => {
    alert('Email report feature coming soon! 📧');
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">📄 Progress Reports</h3>
        
        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={generateReport}
            className="bg-white hover:bg-gray-50 rounded-xl p-8 shadow-lg transition-all text-center"
          >
            <div className="text-6xl mb-4">📥</div>
            <div className="text-xl font-bold text-gray-800 mb-2">Download PDF Report</div>
            <div className="text-gray-600">Get a comprehensive progress report</div>
          </button>

          <button
            onClick={sendEmailReport}
            className="bg-white hover:bg-gray-50 rounded-xl p-8 shadow-lg transition-all text-center"
          >
            <div className="text-6xl mb-4">📧</div>
            <div className="text-xl font-bold text-gray-800 mb-2">Email Report</div>
            <div className="text-gray-600">Send weekly progress via email</div>
          </button>
        </div>

        {/* Report Preview */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h4 className="text-xl font-bold text-gray-700 mb-4">📊 Report Preview</h4>
          <div className="space-y-4 text-gray-700">
            <div className="flex justify-between">
              <span>Total Learning Time:</span>
              <span className="font-bold">Estimated 12+ hours</span>
            </div>
            <div className="flex justify-between">
              <span>Activities Completed:</span>
              <span className="font-bold">{stats.totalCompletions}</span>
            </div>
            <div className="flex justify-between">
              <span>Stars Earned:</span>
              <span className="font-bold">{stats.totalStars} ⭐</span>
            </div>
            <div className="flex justify-between">
              <span>Achievement Rate:</span>
              <span className="font-bold">
                {Math.round((stats.unlockedAchievements / stats.totalAchievements) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ icon, label, value, color }: any) {
  return (
    <div className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white shadow-lg`}>
      <div className="text-5xl mb-3">{icon}</div>
      <div className="text-4xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{label}</div>
    </div>
  );
}

// Helper Functions
function getModuleFromActivity(activityId: string): string {
  // Map activity to module
  if (activityId.includes('letter')) return 'letters';
  if (activityId.includes('number')) return 'numbers';
  if (activityId.includes('color')) return 'colors';
  if (activityId.includes('shape')) return 'shapes';
  if (activityId.includes('music')) return 'music';
  if (activityId.includes('logic')) return 'logic';
  if (activityId.includes('science')) return 'science';
  if (activityId.includes('geography')) return 'geography';
  if (activityId.includes('writing')) return 'writing';
  if (activityId.includes('physical')) return 'physical';
  return 'other';
}

function getModuleName(module: string): string {
  const names: Record<string, string> = {
    letters: 'Letters & Reading',
    numbers: 'Numbers & Math',
    colors: 'Colors & Art',
    shapes: 'Shapes & Patterns',
    music: 'Music & Rhythm',
    logic: 'Logic & Thinking',
    science: 'Science Exploration',
    geography: 'Geography',
    writing: 'Writing Skills',
    physical: 'Physical Education',
  };
  return names[module] || module;
}

function getModuleIcon(module: string): string {
  const icons: Record<string, string> = {
    letters: '📚',
    numbers: '🔢',
    colors: '🎨',
    shapes: '⭐',
    music: '🎵',
    logic: '🧩',
    science: '🔬',
    geography: '🌍',
    writing: '✍️',
    physical: '⚽',
  };
  return icons[module] || '📖';
}

function getActivityIcon(activityId: string): string {
  return getModuleIcon(getModuleFromActivity(activityId));
}

function getActivityName(activityId: string): string {
  return activityId.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getAchievementIcon(id: string): string {
  const icons: Record<string, string> = {
    first_star: '⭐',
    first_10_stars: '🌟',
    star_collector: '✨',
    century_club: '💯',
    letters_beginner: '📚',
    numbers_beginner: '🔢',
    artist: '🎨',
    logic_master: '🧩',
    scientist: '🔬',
    explorer: '🌍',
    author: '✍️',
    athlete: '⚽',
  };
  return icons[id] || '🏆';
}

function getAchievementName(id: string): string {
  return id.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function getTopModules(moduleProgress: any): [string, any][] {
  return Object.entries(moduleProgress)
    .sort(([, a]: any, [, b]: any) => b.stars - a.stars)
    .slice(0, 3);
}

function getBottomModules(moduleProgress: any): [string, any][] {
  return Object.entries(moduleProgress)
    .sort(([, a]: any, [, b]: any) => a.stars - b.stars)
    .slice(0, 3);
}
