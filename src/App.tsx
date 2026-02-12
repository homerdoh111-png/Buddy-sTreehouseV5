import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import { useBuddyStore } from './store/buddyStore';
import { MODULES, ACHIEVEMENTS, TOTAL_STARS } from './config/activities.config';
import SplashScreen from './components/SplashScreen';
import Buddy3DSimple from './components/Buddy3D-SIMPLE';
import BuddyJinglePlayer from './components/BuddyJinglePlayer';
import BuddyVoiceRecorder from './components/BuddyVoiceRecorder';
import ParentDashboard from './components/ParentDashboard';
import { AchievementPopup } from './components/EnhancedAnimations';
import LogicThinkingModule from './components/activities/LogicThinkingModule';
import ScienceModule from './components/activities/ScienceModule';
import {
  MathModule,
  ReadingModule,
  ArtModule,
  MusicModule,
  SocialModule,
  MovementModule,
  NatureModule,
  CodingModule,
} from './components/activities/RemainingModules';

const MODULE_COMPONENTS: Record<string, React.ComponentType> = {
  logic: LogicThinkingModule,
  science: ScienceModule,
  math: MathModule,
  reading: ReadingModule,
  art: ArtModule,
  music: MusicModule,
  social: SocialModule,
  movement: MovementModule,
  nature: NatureModule,
  coding: CodingModule,
};

function MainMenu() {
  const {
    totalStars,
    totalCompleted,
    unlockedAchievements,
    setCurrentScreen,
    setCurrentModuleId,
    getActivityProgress,
  } = useBuddyStore();

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 relative overflow-hidden">
      {/* Audio controls */}
      <BuddyJinglePlayer />

      {/* Sky decorations */}
      <motion.div
        className="absolute top-6 left-8 text-5xl opacity-50"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        ☁️
      </motion.div>
      <motion.div
        className="absolute top-16 right-16 text-4xl opacity-40"
        animate={{ x: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        ☁️
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        {/* Header with Buddy */}
        <div className="text-center mb-6">
          <Buddy3DSimple size="large" mood={totalStars > 50 ? 'celebrating' : 'happy'} />
          <h1 className="font-buddy text-4xl md:text-5xl text-treehouse-bark mt-2 drop-shadow">
            Buddy's Treehouse
          </h1>

          {/* Stats bar */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span className="font-buddy text-treehouse-bark">{totalStars}/{TOTAL_STARS}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow flex items-center gap-2">
              <span className="text-xl">✅</span>
              <span className="font-buddy text-treehouse-bark">{totalCompleted}</span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <span className="font-buddy text-treehouse-bark">{unlockedAchievements.length}/{ACHIEVEMENTS.length}</span>
            </div>
          </div>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
          {MODULES.map((mod, index) => {
            const completedCount = mod.activities.filter(
              (a) => getActivityProgress(a.id).completed
            ).length;
            const isComplete = completedCount === mod.activities.length;

            return (
              <motion.button
                key={mod.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentModuleId(mod.id)}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-lg hover:shadow-xl transition-shadow text-center relative overflow-hidden group"
              >
                {/* Completion badge */}
                {isComplete && (
                  <div className="absolute -top-1 -right-1 text-xl">✅</div>
                )}

                <motion.span
                  className="text-4xl inline-block"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.4 }}
                >
                  {mod.icon}
                </motion.span>
                <h3 className="font-buddy text-sm text-gray-800 mt-2 leading-tight">{mod.title}</h3>

                {/* Progress dots */}
                <div className="flex justify-center gap-1 mt-2">
                  {mod.activities.map((a) => (
                    <div
                      key={a.id}
                      className={`w-2 h-2 rounded-full ${
                        getActivityProgress(a.id).completed ? 'bg-green-400' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Hover color accent */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: mod.color }}
                />
              </motion.button>
            );
          })}
        </div>

        {/* Voice Recorder */}
        <div className="mb-8">
          <BuddyVoiceRecorder />
        </div>

        {/* Bottom bar */}
        <div className="flex justify-center gap-4 pb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentScreen('parent')}
            className="px-6 py-2 bg-white/80 hover:bg-white rounded-full font-body text-sm text-gray-600 shadow"
          >
            👨‍👩‍👧 Parent Dashboard
          </motion.button>
        </div>
      </div>

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-500 to-green-400 rounded-t-[40%]" />
    </div>
  );
}

export default function App() {
  const currentScreen = useBuddyStore((s) => s.currentScreen);
  const currentModuleId = useBuddyStore((s) => s.currentModuleId);
  const newAchievement = useBuddyStore((s) => s.newAchievement);
  const clearNewAchievement = useBuddyStore((s) => s.clearNewAchievement);

  const achievementData = newAchievement
    ? ACHIEVEMENTS.find((a) => a.id === newAchievement)
    : null;

  // If a module is selected, show the module view
  if (currentModuleId && currentScreen === 'menu') {
    const ModuleComponent = MODULE_COMPONENTS[currentModuleId];
    if (ModuleComponent) {
      return (
        <>
          <ModuleComponent />
          <AnimatePresence>
            {achievementData && (
              <AchievementPopup
                title={achievementData.title}
                description={achievementData.description}
                icon={achievementData.icon}
                onClose={clearNewAchievement}
              />
            )}
          </AnimatePresence>
        </>
      );
    }
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && <SplashScreen key="splash" />}
        {currentScreen === 'menu' && <MainMenu key="menu" />}
        {currentScreen === 'parent' && <ParentDashboard key="parent" />}
      </AnimatePresence>

      {/* Achievement popup */}
      <AnimatePresence>
        {achievementData && (
          <AchievementPopup
            title={achievementData.title}
            description={achievementData.description}
            icon={achievementData.icon}
            onClose={clearNewAchievement}
          />
        )}
      </AnimatePresence>
    </>
  );
}
