// Buddy's Treehouse V5 - 3D Immersive Experience
// Treehouse-centered layout with floating activities + interactive interior

import { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { ParentDashboard } from './components/ParentDashboard';
import { BuddyVoiceRecorder } from './components/BuddyVoiceRecorder';
import { HomeDock } from './components/HomeDock';
import { HUDBar, Pill, RoundIconButton } from './components/HUDBar';
import ActivityModal from './components/ActivityModal';
import TreehouseInterior3D from './components/TreehouseInterior3D';
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

// Treehouse should always be available (Tom-style)
const TREEHOUSE_UNLOCK_STARS = 0;

// Activity positions around the treehouse in an orbital ring
const ACTIVITY_POSITIONS = [
  { x: 14, y: 26 },   // left-upper
  { x: 10, y: 48 },   // mid-left
  { x: 14, y: 70 },   // left-lower
  { x: 32, y: 13 },   // top-left
  { x: 32, y: 84 },   // bottom-left
  { x: 68, y: 13 },   // top-right
  { x: 68, y: 84 },   // bottom-right
  { x: 86, y: 26 },   // right-upper
  { x: 90, y: 48 },   // mid-right
  { x: 86, y: 70 },   // right-lower
];

export default function App() {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState<'exterior' | 'interior'>('exterior');
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  // Hybrid home UX
  const [showBubbles, setShowBubbles] = useState(false);
  const [showRewards, setShowRewards] = useState(false);

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

  // Derived
  const treehouseUnlocked = true;

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

  const toggleBackgroundMusic = () => {
    playClick();
    if (backgroundMusicEnabled) {
      stopBackgroundMusic();
      setBackgroundMusicEnabled(false);
    } else {
      startBackgroundMusic();
      setBackgroundMusicEnabled(true);
    }
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

  // Click 3D Buddy → open voice recorder to talk
  const handleBuddyClick = () => {
    playClick();
    setBuddyMood('waving');
    setShowVoiceRecorder(true);
    setTimeout(() => setBuddyMood('idle'), 2000);
  };

  const openRewards = () => {
    playClick();
    setShowRewards(true);
    setTimeout(() => setShowRewards(false), 3500);
  };

  // Click treehouse → enter interior (if unlocked)
  const handleTreehouseClick = () => {
    playClick();
    setCurrentView('interior');
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
          {/* ====== INTERIOR VIEW ====== */}
          {currentView === 'interior' && (
            <TreehouseInterior3D
              onBack={() => setCurrentView('exterior')}
              onBuddyClick={() => {
                playClick();
                setShowVoiceRecorder(true);
              }}
              onToggleMusic={toggleBackgroundMusic}
              musicEnabled={backgroundMusicEnabled}
              totalStars={totalStars}
              debug={new URLSearchParams(window.location.search).has('debug3d')}
            />
          )}

          {/* ====== EXTERIOR VIEW ====== */}
          {currentView === 'exterior' && (
            <>
              {/* 3D SCENE (BACKGROUND LAYER) */}
              <Suspense fallback={<SceneLoadingFallback />}>
                <TreehouseScene
                  buddyMood={buddyMood}
                  isBuddyTalking={isBuddyTalking}
                  onBuddyClick={handleBuddyClick}
                  onTreehouseClick={handleTreehouseClick}
                  treehouseUnlocked={treehouseUnlocked}
                />
              </Suspense>

              {/* UI OVERLAY */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {/* ------ TOP BAR (Unified HUD) ------ */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                  <HUDBar
                    left={<div className="w-12 h-12" aria-hidden />}
                    title={<div className="text-lg md:text-xl font-black text-white drop-shadow-lg">Treehouse</div>}
                    right={
                      <>
                        <RoundIconButton
                          label={backgroundMusicEnabled ? 'Music On' : 'Music Off'}
                          onPress={toggleBackgroundMusic}
                        >
                          {backgroundMusicEnabled ? '♫' : '🔇'}
                        </RoundIconButton>
                        <Pill>
                          <span className="text-yellow-300 font-extrabold">⭐ {totalStars}</span>
                        </Pill>
                      </>
                    }
                  />
                </motion.div>

                {/* ------ "TAP BUDDY TO TALK" HINT ------ */}
                {!showVoiceRecorder && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2 }}
                    className="absolute bottom-6 left-[15%] pointer-events-none"
                  >
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-black/40 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/10"
                    >
                      <p className="text-white/80 text-sm font-medium">&#128072; Tap Buddy to talk!</p>
                    </motion.div>
                  </motion.div>
                )}

                {/* ------ HYBRID HOME DOCK (Talking-Tom style) ------ */}
                <HomeDock
                  onAction={(action) => {
                    switch (action) {
                      case 'music':
                        toggleBackgroundMusic();
                        break;
                      case 'parent':
                        setShowParentDashboard(true);
                        break;
                      case 'settings':
                        setShowSettings(true);
                        break;
                      case 'rewards':
                        openRewards();
                        break;
                      case 'explore':
                        // Explore = show/hide floating bubbles so the environment stays interactive.
                        playClick();
                        setShowBubbles((v) => !v);
                        break;
                      case 'learn':
                      case 'play':
                        // For now, map to bubbles (quick access). We'll refine once you pick exact UX.
                        playClick();
                        setShowBubbles(true);
                        break;
                      default:
                        break;
                    }
                  }}
                />

                {/* ------ QUICK REWARDS TOAST ------ */}
                <AnimatePresence>
                  {showRewards && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.98 }}
                      className="absolute bottom-24 md:bottom-28 left-1/2 -translate-x-1/2 pointer-events-none z-30"
                    >
                      <div className="bg-black/55 backdrop-blur-xl rounded-2xl px-5 py-3 border border-white/15 shadow-2xl text-center">
                        <div className="text-white font-extrabold text-lg">⭐ {totalStars} Stars</div>
                        <div className="text-white/70 text-xs mt-1">Keep playing to unlock more!</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ------ TREEHOUSE ENTER BUTTON (small, not competing with dock) ------ */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="absolute bottom-24 md:bottom-28 left-3 md:left-4 pointer-events-auto z-20"
                >
                  <button
                    onClick={handleTreehouseClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl shadow-xl backdrop-blur-md border transition-all active:scale-95 ${
                      treehouseUnlocked
                        ? 'bg-amber-500/75 border-amber-300/30 text-white'
                        : 'bg-black/35 border-white/10 text-white/70'
                    }`}
                  >
                    <span className="text-xl">{treehouseUnlocked ? '🏠' : '🔒'}</span>
                    <span className="font-extrabold text-sm">
                      {treehouseUnlocked ? 'Treehouse' : `${TREEHOUSE_UNLOCK_STARS - totalStars}⭐`}
                    </span>
                  </button>
                </motion.div>

                {/* ------ FLOATING ACTIVITY BUBBLES (now opt-in via Explore/Play/Learn) ------ */}
                {showBubbles && ACTIVITIES.map((module, index) => { 
                  const pos = ACTIVITY_POSITIONS[index % ACTIVITY_POSITIONS.length];
                  const isLocked = totalStars < module.starsRequired;

                  return (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: [0, -8, 0],
                      }}
                      transition={{
                        opacity: { delay: 0.3 + index * 0.1, duration: 0.5 },
                        scale: { delay: 0.3 + index * 0.1, duration: 0.5, type: 'spring' },
                        y: { delay: 1 + index * 0.15, duration: 3 + (index % 3), repeat: Infinity, ease: 'easeInOut' },
                      }}
                      className="absolute pointer-events-auto"
                      style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <button
                        onClick={() => !isLocked && handleActivityClick(module)}
                        disabled={isLocked}
                        className={`group relative flex flex-col items-center ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {/* Round icon circle */}
                        <div
                          className={`
                            relative w-[60px] h-[60px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-all duration-300 shadow-lg
                            ${isLocked
                              ? 'bg-black/50 backdrop-blur-md border-2 border-white/10'
                              : 'bg-white/20 backdrop-blur-xl border-2 border-white/30 active:scale-90 active:bg-white/40'
                            }
                          `}
                        >
                          {isLocked && (
                            <div className="absolute inset-0 flex items-center justify-center z-10 rounded-full bg-black/30">
                              <span className="text-lg">&#128274;</span>
                            </div>
                          )}
                          <span className={`text-2xl md:text-3xl ${isLocked ? 'opacity-30 blur-[1px]' : ''}`}>
                            {module.icon}
                          </span>
                          {!isLocked && (
                            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                          )}
                        </div>
                        <span className={`mt-1 text-[10px] md:text-[11px] font-bold text-center whitespace-nowrap drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] ${isLocked ? 'text-white/30' : 'text-white'}`}>
                          {module.name}
                        </span>
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {/* ====== VOICE RECORDER SIDE PANEL (click Buddy to open) ====== */}
          <AnimatePresence>
            {showVoiceRecorder && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-2 top-16 bottom-8 w-72 md:right-4 md:top-20 md:bottom-20 md:w-80 z-30 flex flex-col"
              >
                <div className="bg-black/40 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl flex flex-col h-full overflow-hidden">
                  {/* Header */}
                  <div className="flex justify-between items-center p-3 md:p-4 border-b border-white/10">
                    <h2 className="text-lg md:text-xl font-bold text-white">Talk with Buddy</h2>
                    <button
                      onClick={() => {
                        setShowVoiceRecorder(false);
                        setIsBuddyTalking(false);
                        setBuddyMood('idle');
                      }}
                      className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white text-xl active:scale-90 transition-all"
                    >
                      &#10005;
                    </button>
                  </div>
                  {/* Voice Recorder */}
                  <div className="flex-1 overflow-y-auto p-3 md:p-4">
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
    <>
      {/* Backdrop - click to close */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold">&#9881; Settings</h2>
            <button onClick={onClose} className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl active:scale-90 transition-transform">
              &#10005;
            </button>
          </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-5 md:p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-1">Background Music</h3>
                <p className="text-gray-600 text-sm">Music only - sound effects stay on</p>
              </div>
              <button
                onClick={() => onMusicToggle(!musicEnabled)}
                className={`px-6 py-3 rounded-xl text-lg md:text-xl font-bold transition-all active:scale-95 ${
                  musicEnabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xl md:text-2xl font-bold mb-2 block">Master Volume</label>
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
              className="w-full h-6 rounded-full appearance-none bg-gray-200 cursor-pointer"
              style={{ WebkitAppearance: 'none' }}
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(masterVolume * 100)}%</div>
          </div>

          <div>
            <label className="text-xl md:text-2xl font-bold mb-2 block">Music Volume</label>
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
              className="w-full h-6 rounded-full appearance-none bg-gray-200 cursor-pointer"
              style={{ WebkitAppearance: 'none' }}
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(musicVolume * 100)}%</div>
          </div>

          <div>
            <label className="text-xl md:text-2xl font-bold mb-2 block">Sound Effects</label>
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
              className="w-full h-6 rounded-full appearance-none bg-gray-200 cursor-pointer"
              style={{ WebkitAppearance: 'none' }}
            />
            <div className="text-center text-gray-600 mt-2">{Math.round(sfxVolume * 100)}%</div>
          </div>
        </div>
        </motion.div>
      </div>
    </>
  );
}
