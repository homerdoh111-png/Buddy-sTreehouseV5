// Buddy Store - State Management with Zustand
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

interface ActivityProgress {
  [activityId: string]: {
    completed: boolean;
    starsEarned: number;
    attempts: number;
    lastPlayed?: Date;
  };
}

interface FunActivityRecord {
  timesPlayed: number;
  lastPlayed?: Date;
}

interface BuddyState {
  // Progress
  totalStars: number;
  level: number;
  activityProgress: ActivityProgress;

  // Fun Activities (Treehouse Interior)
  funActivitiesPlayed: Record<string, FunActivityRecord>;
  buddyHappiness: number; // 0-100, affected by fun activities
  buddyEnergy: number;    // 0-100, decreases over play, restored by bedtime

  // Achievements
  achievements: Achievement[];

  // Settings
  soundEnabled: boolean;
  musicEnabled: boolean;

  // Actions
  addStars: (amount: number) => void;
  completeActivity: (activityId: string, starsEarned: number) => void;
  playFunActivity: (activityId: string) => void;
  setBuddyHappiness: (value: number) => void;
  setBuddyEnergy: (value: number) => void;
  unlockAchievement: (achievementId: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  resetProgress: () => void;
}

const initialAchievements: Achievement[] = [
  {
    id: 'first_star',
    title: 'First Star',
    description: 'Earn your very first star!',
    icon: '⭐',
    unlocked: false,
  },
  {
    id: 'ten_stars',
    title: 'Star Collector',
    description: 'Collect 10 stars',
    icon: '🌟',
    unlocked: false,
  },
  {
    id: 'twenty_five_stars',
    title: 'Rising Star',
    description: 'Collect 25 stars',
    icon: '✨',
    unlocked: false,
  },
  {
    id: 'fifty_stars',
    title: 'Star Master',
    description: 'Collect 50 stars',
    icon: '💫',
    unlocked: false,
  },
  {
    id: 'complete_module',
    title: 'Module Master',
    description: 'Complete all activities in a module',
    icon: '🎓',
    unlocked: false,
  },
  {
    id: 'perfect_score',
    title: 'Perfect Performance',
    description: 'Get a perfect score on any activity',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'five_days_streak',
    title: 'Consistent Learner',
    description: 'Play for 5 days in a row',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'all_modules',
    title: 'Learning Champion',
    description: 'Unlock all learning modules',
    icon: '👑',
    unlocked: false,
  },
  {
    id: 'hundred_stars',
    title: 'Century Star',
    description: 'Collect 100 stars',
    icon: '🌠',
    unlocked: false,
  },
  {
    id: 'complete_all',
    title: 'Ultimate Explorer',
    description: 'Complete all activities',
    icon: '🎯',
    unlocked: false,
  },
];

export const useBuddyStore = create<BuddyState>()(
  persist(
    (set, get) => ({
      // Initial State
      totalStars: 0,
      level: 1,
      activityProgress: {},
      funActivitiesPlayed: {},
      buddyHappiness: 70,
      buddyEnergy: 100,
      achievements: initialAchievements,
      soundEnabled: true,
      musicEnabled: true,

      // Add Stars
      addStars: (amount: number) => {
        set((state) => {
          const newTotal = state.totalStars + amount;
          const newLevel = Math.floor(newTotal / 10) + 1;
          
          // Check for star-based achievements
          const updatedAchievements = state.achievements.map((ach) => {
            if (!ach.unlocked) {
              if (ach.id === 'first_star' && newTotal >= 1) {
                return { ...ach, unlocked: true, unlockedAt: new Date() };
              }
              if (ach.id === 'ten_stars' && newTotal >= 10) {
                return { ...ach, unlocked: true, unlockedAt: new Date() };
              }
              if (ach.id === 'twenty_five_stars' && newTotal >= 25) {
                return { ...ach, unlocked: true, unlockedAt: new Date() };
              }
              if (ach.id === 'fifty_stars' && newTotal >= 50) {
                return { ...ach, unlocked: true, unlockedAt: new Date() };
              }
              if (ach.id === 'hundred_stars' && newTotal >= 100) {
                return { ...ach, unlocked: true, unlockedAt: new Date() };
              }
            }
            return ach;
          });

          return {
            totalStars: newTotal,
            level: newLevel,
            achievements: updatedAchievements,
          };
        });
      },

      // Complete Activity
      completeActivity: (activityId: string, starsEarned: number) => {
        set((state) => {
          const progress = state.activityProgress[activityId] || {
            completed: false,
            starsEarned: 0,
            attempts: 0,
          };

          const updatedProgress = {
            ...state.activityProgress,
            [activityId]: {
              completed: true,
              starsEarned: Math.max(progress.starsEarned, starsEarned),
              attempts: progress.attempts + 1,
              lastPlayed: new Date(),
            },
          };

          return {
            activityProgress: updatedProgress,
          };
        });

        // Add stars
        get().addStars(starsEarned);
      },

      // Play Fun Activity
      playFunActivity: (activityId: string) => {
        set((state) => {
          const existing = state.funActivitiesPlayed[activityId] || { timesPlayed: 0 };
          return {
            funActivitiesPlayed: {
              ...state.funActivitiesPlayed,
              [activityId]: {
                timesPlayed: existing.timesPlayed + 1,
                lastPlayed: new Date(),
              },
            },
          };
        });
      },

      // Set Buddy Happiness
      setBuddyHappiness: (value: number) => {
        set({ buddyHappiness: Math.max(0, Math.min(100, value)) });
      },

      // Set Buddy Energy
      setBuddyEnergy: (value: number) => {
        set({ buddyEnergy: Math.max(0, Math.min(100, value)) });
      },

      // Unlock Achievement
      unlockAchievement: (achievementId: string) => {
        set((state) => ({
          achievements: state.achievements.map((ach) =>
            ach.id === achievementId && !ach.unlocked
              ? { ...ach, unlocked: true, unlockedAt: new Date() }
              : ach
          ),
        }));
      },

      // Toggle Sound
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),

      // Toggle Music
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),

      // Reset Progress
      resetProgress: () =>
        set({
          totalStars: 0,
          level: 1,
          activityProgress: {},
          funActivitiesPlayed: {},
          buddyHappiness: 70,
          buddyEnergy: 100,
          achievements: initialAchievements,
        }),
    }),
    {
      name: 'buddy-storage',
    }
  )
);
