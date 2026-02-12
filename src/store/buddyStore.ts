import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ACHIEVEMENTS } from '../config/activities.config';

interface ActivityProgress {
  completed: boolean;
  starsEarned: number;
  attempts: number;
  lastPlayed: string | null;
}

interface BuddyState {
  // User info
  playerName: string;
  setPlayerName: (name: string) => void;

  // Progress tracking
  activityProgress: Record<string, ActivityProgress>;
  completeActivity: (activityId: string, starsEarned: number) => void;
  getActivityProgress: (activityId: string) => ActivityProgress;

  // Stats
  totalStars: number;
  totalCompleted: number;
  streak: number;

  // Achievements
  unlockedAchievements: string[];
  newAchievement: string | null;
  clearNewAchievement: () => void;

  // UI State
  currentScreen: 'splash' | 'menu' | 'module' | 'activity' | 'parent';
  setCurrentScreen: (screen: BuddyState['currentScreen']) => void;
  currentModuleId: string | null;
  setCurrentModuleId: (id: string | null) => void;
  currentActivityId: string | null;
  setCurrentActivityId: (id: string | null) => void;

  // Settings
  soundEnabled: boolean;
  toggleSound: () => void;
  musicVolume: number;
  setMusicVolume: (volume: number) => void;

  // Session
  sessionStartTime: string;
  sessionsCompleted: number;

  // Reset
  resetProgress: () => void;
}

const defaultProgress: ActivityProgress = {
  completed: false,
  starsEarned: 0,
  attempts: 0,
  lastPlayed: null,
};

export const useBuddyStore = create<BuddyState>()(
  persist(
    (set, get) => ({
      playerName: 'Buddy',
      setPlayerName: (name) => set({ playerName: name }),

      activityProgress: {},
      completeActivity: (activityId, starsEarned) => {
        const state = get();
        const prev = state.activityProgress[activityId] || { ...defaultProgress };
        const isNewCompletion = !prev.completed;
        const starDiff = Math.max(0, starsEarned - prev.starsEarned);

        const newProgress = {
          ...state.activityProgress,
          [activityId]: {
            completed: true,
            starsEarned: Math.max(prev.starsEarned, starsEarned),
            attempts: prev.attempts + 1,
            lastPlayed: new Date().toISOString(),
          },
        };

        const newTotalStars = state.totalStars + starDiff;
        const newTotalCompleted = state.totalCompleted + (isNewCompletion ? 1 : 0);
        const newStreak = state.streak + (isNewCompletion ? 1 : 0);

        // Check achievements
        let newAchievement: string | null = null;
        const unlocked = [...state.unlockedAchievements];

        for (const achievement of ACHIEVEMENTS) {
          if (unlocked.includes(achievement.id)) continue;

          let earned = false;
          if (achievement.id.includes('star')) {
            earned = newTotalStars >= achievement.requirement;
          } else if (achievement.id.includes('module')) {
            earned = newTotalCompleted >= achievement.requirement * 4;
          } else if (achievement.id.includes('streak')) {
            earned = newStreak >= achievement.requirement;
          } else {
            earned = newTotalCompleted >= achievement.requirement;
          }

          if (earned) {
            unlocked.push(achievement.id);
            newAchievement = achievement.id;
          }
        }

        set({
          activityProgress: newProgress,
          totalStars: newTotalStars,
          totalCompleted: newTotalCompleted,
          streak: newStreak,
          unlockedAchievements: unlocked,
          newAchievement,
        });
      },
      getActivityProgress: (activityId) => {
        return get().activityProgress[activityId] || { ...defaultProgress };
      },

      totalStars: 0,
      totalCompleted: 0,
      streak: 0,

      unlockedAchievements: [],
      newAchievement: null,
      clearNewAchievement: () => set({ newAchievement: null }),

      currentScreen: 'splash',
      setCurrentScreen: (screen) => set({ currentScreen: screen }),
      currentModuleId: null,
      setCurrentModuleId: (id) => set({ currentModuleId: id }),
      currentActivityId: null,
      setCurrentActivityId: (id) => set({ currentActivityId: id }),

      soundEnabled: true,
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      musicVolume: 0.5,
      setMusicVolume: (volume) => set({ musicVolume: volume }),

      sessionStartTime: new Date().toISOString(),
      sessionsCompleted: 0,

      resetProgress: () =>
        set({
          activityProgress: {},
          totalStars: 0,
          totalCompleted: 0,
          streak: 0,
          unlockedAchievements: [],
          newAchievement: null,
          sessionsCompleted: 0,
        }),
    }),
    {
      name: 'buddy-treehouse-storage',
    }
  )
);
