// Buddy's Treehouse V5 - 3D Immersive Experience
// Treehouse-centered layout with floating activities

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { BuddyJinglePlayer } from './components/BuddyJinglePlayer';
import { ParentDashboard } from './components/ParentDashboard';
import { BuddyVoiceRecorder } from './components/BuddyVoiceRecorder';
import ActivityModal from './components/ActivityModal';
import {
  Confetti,
  LevelUpAnimation,
  AchievementUnlockAnimation,
  StarCollectionAnimation,
} from './components/EnhancedAnimations';
import audioManager, { playClick, playSuccess, playStar } from './utils/audioManager';
import { useBuddyStore } from './store/buddyStore';
import { ACTIVITIES } from './config/activities.config';

// Lazy-load the 3D scene (heavy)
const TreehouseScene = lazy(() => import('./components/TreehouseScene'));

// Activity positions around the treehouse in a circular layout
const ACTIVITY_POSITIONS = [
  { x: -42, y: 8 },   // top-left
  { x: -20, y: 2 },   // left-upper
  { x: -44, y: 35 },  // left-middle
  { x: -22, y: 55 },  // left-lower
  { x: -40, y: 72 },  // bottom-left
  { x: 72, y: 8 },    // top-right
  { x: 52, y: 2 },    // right-upper
  { x: 74, y: 35 },   // right-middle
  { x: 52, y: 55 },   // right-lower
  { x: 70, y: 72 },   // bottom-right
];

export default function App() {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  // 3D/Animation State
  const [buddyMood, setBuddyMood] = useState<'idle' | 'talking' | 'laughing' | 'waving'>('idle');
  const [isBuddyTalking, setIsBuddyTalking] = useState(false);

  // Animation State
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [showStarCollection, setShowStarCollection] = useState<number>(0);

  // Music State
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);

  // Store
  const { totalStars, completeActivity } = useBuddyStore();

  // Initialize audio system
  useEffect(() => {
    audioManager.preload(['success', 'star_collect', 'button_click', 'achievement']);
  }, []);

  // Start background music after splash
  useEffect(() => {
    if (!showSplash && backgroundMusicEnabled) {
      setTimeout(() => startBackgroundMusic(), 1000);
    }
  }, [showSplash, backgroundMusicEnabled]);

  // Celebration jingle on milestones
  useEffect(() => {
    if (totalStars === 25 || totalStars === 50 || totalStars === 100) {
      audioManager.play('celebration_jingle', {
        url: '/audio/buddy-jingle-celebration.mp3',
        volume: 0.8,
      });
      setBuddyMood('laughing');
      setTimeout(() => setBuddyMood('idle'), 4000);
    }
  }, [totalStars]);

  const startBackgroundMusic = () => {
    audioManager.play('buddy_background_music', {
      url: '/audio/buddy-jingle-loop.mp3',
      loop: true,
      volume: 0.3,
      fadeIn: 2.0,
    });
  };

  const stopBackgroundMusic = () => {
    audioManager.stop('buddy_background_music', 0.5);
  };

  const handleActivityClick = (activity: any) => {
    playClick();
    setSelectedActivity(activity);
    setShowActivityModal(true);
    if (backgroundMusicEnabled) {
      audioManager.setVolume('buddy_background_music', 0.1);
    }
  };

  const handleActivityComplete = (stars: number) => {
    if (selectedActivity) {
      completeActivity(selectedActivity.id, stars);
    }
    setShowStarCollection(stars);
    playStar();
    setBuddyMood('laughing');

    setTimeout(() => {
      setShowConfetti(true);
      playSuccess();
    }, 2000);

    if (totalStars > 0 && totalStars % 25 === 0) {
      setTimeout(() => setShowLevelUp(true), 3000);
    }

    setTimeout(() => {
      setShowActivityModal(false);
      setBuddyMood('idle');
      if (backgroundMusicEnabled) {
        audioManager.setVolume('buddy_background_music', 0.3);
      }
    }, 4000);
  };

  const handleBuddyClick = () => {
    setBuddyMood('waving');
    setTimeout(() => setBuddyMood('idle'), 2000);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* ====== SPLASH SCREEN ====== */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            audioUrl="/audio/buddy-jingle-intro.mp3"
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {!showSplash && (
        <>
          {/* ====== 3D SCENE (BACKGROUND LAYER) ====== */}
          <Suspense fallback={<SceneLoadingFallback />}>
            <TreehouseScene
              buddyMood={buddyMood}
              isBuddyTalking={isBuddyTalking}
              onBuddyClick={handleBuddyClick}
            />
          </Suspense>

          {/* ====== UI OVERLAY ====== */}
          <div className="absolute inset-0 z-10 pointer-events-none">

            {/* ------ TOP BAR ------ */}
            <header className="pointer-events-auto flex justify-between items-start p-4">
              {/* Stars Counter */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-black/30 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-white/10"
              >
                <div className="text-3xl font-bold text-yellow-400 flex items-center gap-2">
                  <span className="text-2xl">&#11088;</span> {totalStars} Stars
                </div>
              </motion.div>

              {/* Title */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                  Buddy's Treehouse
                </h1>
                <p className="text-lg text-white/70 drop-shadow-lg">Learn, Play, Grow!</p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-2"
              >
                <button
                  onClick={() => { playClick(); setShowVoiceRecorder(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-red-500/80 to-pink-500/80 hover:from-red-500 hover:to-pink-500 text-white text-lg font-bold rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 border border-white/10"
                >
                  Talk with Buddy
                </button>
                <button
                  onClick={() => { playClick(); setShowParentDashboard(true); }}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500/80 to-blue-500/80 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-bold rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 border border-white/10"
                >
                  Parent Dashboard
                </button>
                <button
                  onClick={() => {
                    playClick();
                    if (backgroundMusicEnabled) {
                      stopBackgroundMusic();
                      setBackgroundMusicEnabled(false);
                    } else {
                      startBackgroundMusic();
                      setBackgroundMusicEnabled(true);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 text-lg font-bold border border-white/10 ${
                    backgroundMusicEnabled
                      ? 'bg-green-500/80 hover:bg-green-500 text-white'
                      : 'bg-gray-500/80 hover:bg-gray-500 text-white'
                  }`}
                >
                  {backgroundMusicEnabled ? '\u266B' : '\uD83D\uDD07'}
                </button>
                <button
                  onClick={() => { playClick(); setShowSettings(true); }}
                  className="px-3 py-2 bg-white/20 hover:bg-white/30 text-white text-lg rounded-xl shadow-lg backdrop-blur-sm transition-all transform hover:scale-105 border border-white/10"
                >
                  &#9881;
                </button>
              </motion.div>
            </header>

            {/* ------ FLOATING ACTIVITY BUBBLES ------ */}
            {ACTIVITIES.map((module, index) => {
              const pos = ACTIVITY_POSITIONS[index % ACTIVITY_POSITIONS.length];
              const isLocked = totalStars < module.starsRequired;

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: [0, -6, 0],
                  }}
                  transition={{
                    opacity: { delay: 0.3 + index * 0.1, duration: 0.5 },
                    scale: { delay: 0.3 + index * 0.1, duration: 0.5, type: 'spring' },
                    y: { delay: 1 + index * 0.1, duration: 3 + (index % 3), repeat: Infinity, ease: 'easeInOut' },
                  }}
                  className="absolute pointer-events-auto"
                  style={{
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                  }}
                >
                  <button
                    onClick={() => !isLocked && handleActivityClick(module)}
                    disabled={isLocked}
                    className={`group relative ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div
                      className={`
                        relative rounded-2xl p-4 w-36 transition-all duration-300
                        ${isLocked
                          ? 'bg-black/40 backdrop-blur-md border border-white/5'
                          : 'bg-white/15 backdrop-blur-xl border border-white/20 hover:bg-white/25 hover:border-white/40 hover:scale-110 hover:shadow-2xl'
                        }
                      `}
                    >
                      {/* Lock overlay */}
                      {isLocked && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl bg-black/20">
                          <span className="text-2xl">&#128274;</span>
                        </div>
                      )}

                      {/* Module icon */}
                      <div className={`text-5xl text-center mb-2 ${isLocked ? 'opacity-40 blur-[1px]' : ''}`}>
                        {module.icon}
                      </div>

                      {/* Module name */}
                      <div className={`text-sm font-bold text-center ${isLocked ? 'text-white/30' : 'text-white'}`}>
                        {module.name}
                      </div>

                      {/* Stars required or activity count */}
                      {isLocked ? (
                        <div className="text-xs text-center text-yellow-400/60 mt-1">
                          {module.starsRequired} &#11088;
                        </div>
                      ) : (
                        <div className="text-xs text-center text-white/50 mt-1">
                          {module.levels.length} activities
                        </div>
                      )}

                      {/* Glow effect on hover (unlocked only) */}
                      {!isLocked && (
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}

            {/* ------ BUDDY JINGLE PLAYER (bottom center) ------ */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <BuddyJinglePlayer
                  jingleUrl="/audio/buddy-jingle-full.mp3"
                  onPlay={() => {
                    setBuddyMood('talking');
                    if (backgroundMusicEnabled) {
                      audioManager.setVolume('buddy_background_music', 0.1);
                    }
                  }}
                  onEnd={() => {
                    setBuddyMood('idle');
                    if (backgroundMusicEnabled) {
                      audioManager.setVolume('buddy_background_music', 0.3);
                    }
                  }}
                />
              </motion.div>
            </div>
          </div>

          {/* ====== VOICE RECORDER SIDE PANEL (Buddy stays visible) ====== */}
          <AnimatePresence>
            {showVoiceRecorder && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-4 top-20 bottom-20 w-80 z-30 flex flex-col"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col h-full overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white">Talk with Buddy</h2>
                    <button
                      onClick={() => {
                        setShowVoiceRecorder(false);
                        setIsBuddyTalking(false);
                        setBuddyMood('idle');
                      }}
                      className="text-white/60 hover:text-white text-2xl hover:scale-110 transition-all"
                    >
                      &#10005;
                    </button>
                  </div>
                  {/* Voice Recorder */}
                  <div className="flex-1 overflow-y-auto p-4">
                    <BuddyVoiceRecorder
                      compact
                      onRecordingStart={() => {
                        setBuddyMood('idle');
                        setIsBuddyTalking(false);
                      }}
                      onRecordingStop={() => {
                        setBuddyMood('idle');
                      }}
                      onPlaybackStart={() => {
                        setBuddyMood('talking');
                        setIsBuddyTalking(true);
                      }}
                      onPlaybackEnd={() => {
                        setBuddyMood('idle');
                        setIsBuddyTalking(false);
                      }}
                      onJokeTelling={() => {
                        setBuddyMood('talking');
                        setIsBuddyTalking(true);
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showParentDashboard && (
              <ParentDashboard onClose={() => setShowParentDashboard(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showActivityModal && selectedActivity && (
              <ActivityModal
                activity={selectedActivity}
                onClose={() => {
                  setShowActivityModal(false);
                  if (backgroundMusicEnabled) {
                    audioManager.setVolume('buddy_background_music', 0.3);
                  }
                }}
                onComplete={handleActivityComplete}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSettings && (
              <SettingsModal
                onClose={() => setShowSettings(false)}
                musicEnabled={backgroundMusicEnabled}
                onMusicToggle={(enabled) => {
                  if (enabled) startBackgroundMusic();
                  else stopBackgroundMusic();
                  setBackgroundMusicEnabled(enabled);
                }}
              />
            )}
          </AnimatePresence>

          {/* ====== ANIMATIONS ====== */}
          <AnimatePresence>
            {showStarCollection > 0 && (
              <StarCollectionAnimation
                stars={showStarCollection}
                onComplete={() => setShowStarCollection(0)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showConfetti && (
              <Confetti duration={3000} onComplete={() => setShowConfetti(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showLevelUp && (
              <LevelUpAnimation onComplete={() => setShowLevelUp(false)} />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showAchievement && (
              <AchievementUnlockAnimation
                achievement={showAchievement}
                onComplete={() => setShowAchievement(null)}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}

// ====== SCENE LOADING FALLBACK ======
function SceneLoadingFallback() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white text-3xl font-bold animate-pulse"
      >
        Loading Buddy's Treehouse...
      </motion.div>
    </div>
  );
}

// ====== SETTINGS MODAL ======
function SettingsModal({
  onClose,
  musicEnabled,
  onMusicToggle,
}: {
  onClose: () => void;
  musicEnabled: boolean;
  onMusicToggle: (enabled: boolean) => void;
}) {
  const [masterVolume, setMasterVolume] = useState(0.7);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [sfxVolume, setSfxVolume] = useState(0.8);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-8 max-w-2xl w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">&#9881; Settings</h2>
          <button onClick={onClose} className="text-4xl hover:scale-110 transition-transform">
            &#10005;
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">Buddy's Theme Song</h3>
                <p className="text-gray-600">Background music on main menu</p>
              </div>
              <button
                onClick={() => onMusicToggle(!musicEnabled)}
                className={`px-6 py-3 rounded-xl text-xl font-bold transition-all ${
                  musicEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-2xl font-bold mb-2 block">Master Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={masterVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setMasterVolume(vol);
                audioManager.setMasterVolume(vol);
              }}
              className="w-full h-4 rounded-full"
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(masterVolume * 100)}%</div>
          </div>

          <div>
            <label className="text-2xl font-bold mb-2 block">Music Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setMusicVolume(vol);
                audioManager.setVolume('buddy_background_music', vol);
              }}
              className="w-full h-4 rounded-full"
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(musicVolume * 100)}%</div>
          </div>

          <div>
            <label className="text-2xl font-bold mb-2 block">Sound Effects</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                setSfxVolume(vol);
                audioManager.setSFXVolume(vol);
              }}
              className="w-full h-4 rounded-full"
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(sfxVolume * 100)}%</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
