// 🎵 APP.TSX - WITH YOUR SUNO JINGLE INTEGRATED!
// Buddy's Treehouse V2 - Complete with Custom Music

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './components/SplashScreen';
import { BuddyJinglePlayer } from './components/BuddyJinglePlayer';
import Buddy3DSimple from './components/Buddy3D-SIMPLE';
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

export default function App() {
  // UI State
  const [showSplash, setShowSplash] = useState(true);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showParentDashboard, setShowParentDashboard] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Animation State
  const [showConfetti, setShowConfetti] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState<any>(null);
  const [showStarCollection, setShowStarCollection] = useState<number>(0);

  // Music State
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(true);

  // Store
  const { totalStars, completeActivity } = useBuddyStore();

  // 🎵 INITIALIZE AUDIO SYSTEM
  useEffect(() => {
    // Preload critical sounds
    audioManager.preload([
      'success',
      'star_collect',
      'button_click',
      'achievement',
    ]);
  }, []);

  // 🎵 START BACKGROUND MUSIC AFTER SPLASH
  useEffect(() => {
    if (!showSplash && backgroundMusicEnabled) {
      // Wait a moment after splash completes
      setTimeout(() => {
        startBackgroundMusic();
      }, 1000);
    }
  }, [showSplash, backgroundMusicEnabled]);

  // 🎵 START YOUR SUNO JINGLE AS BACKGROUND MUSIC
  const startBackgroundMusic = () => {
    audioManager.play('buddy_background_music', {
      url: '/audio/buddy-jingle-loop.mp3', // Your jingle!
      loop: true,
      volume: 0.3, // 30% volume - subtle background
      fadeIn: 2.0, // 2-second fade in
    });
  };

  // 🎵 STOP BACKGROUND MUSIC
  const stopBackgroundMusic = () => {
    audioManager.stop('buddy_background_music', 0.5); // 0.5s fade out
  };

  // 🎵 PLAY CELEBRATION JINGLE ON MILESTONES
  useEffect(() => {
    if (totalStars === 25 || totalStars === 50 || totalStars === 100) {
      // Play celebration version of your jingle
      audioManager.play('celebration_jingle', {
        url: '/audio/buddy-jingle-celebration.mp3',
        volume: 0.8,
      });
    }
  }, [totalStars]);

  // Handle activity selection
  const handleActivityClick = (activity: any) => {
    playClick();
    setSelectedActivity(activity);
    setShowActivityModal(true);
    
    // Fade out background music during activity
    if (backgroundMusicEnabled) {
      audioManager.setVolume('buddy_background_music', 0.1);
    }
  };

  // Handle activity completion
  const handleActivityComplete = (stars: number) => {
    // Save progress to store
    if (selectedActivity) {
      completeActivity(selectedActivity.id, stars);
    }

    // Show star collection
    setShowStarCollection(stars);
    playStar();

    // Show confetti after stars
    setTimeout(() => {
      setShowConfetti(true);
      playSuccess();
    }, 2000);

    // Check for level up
    if (totalStars > 0 && totalStars % 25 === 0) {
      setTimeout(() => {
        setShowLevelUp(true);
      }, 3000);
    }

    // Close modal and restore music
    setTimeout(() => {
      setShowActivityModal(false);
      if (backgroundMusicEnabled) {
        audioManager.setVolume('buddy_background_music', 0.3);
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 relative overflow-hidden">
      
      {/* 🎬 SPLASH SCREEN WITH YOUR JINGLE */}
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            audioUrl="/audio/buddy-jingle-intro.mp3" // Your 20s intro!
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      {/* Animated Background */}
      {!showSplash && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      )}

      {/* Header */}
      {!showSplash && (
        <header className="relative z-10 p-6 flex justify-between items-center">
          <div className="text-white">
            <h1 className="text-6xl font-bold mb-2">Buddy's Treehouse</h1>
            <p className="text-2xl opacity-80">Learn, Play, Grow! 🌟</p>
          </div>

          <div className="flex gap-4">
            {/* Voice Recorder Button */}
            <button
              onClick={() => {
                playClick();
                setShowVoiceRecorder(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
            >
              🎤 Talk with Buddy
            </button>

            {/* Parent Dashboard Button */}
            <button
              onClick={() => {
                playClick();
                setShowParentDashboard(true);
              }}
              className="px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 flex items-center gap-3"
            >
              📊 Parent Dashboard
            </button>

            {/* Music Toggle */}
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
              className={`px-6 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 text-2xl font-bold ${
                backgroundMusicEnabled
                  ? 'bg-green-500 hover:bg-green-600 text-white'
                  : 'bg-gray-500 hover:bg-gray-600 text-white'
              }`}
            >
              {backgroundMusicEnabled ? '🎵' : '🔇'}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => {
                playClick();
                setShowSettings(true);
              }}
              className="px-6 py-4 bg-white/20 hover:bg-white/30 text-white text-2xl rounded-2xl shadow-lg transition-all transform hover:scale-105"
            >
              ⚙️
            </button>
          </div>
        </header>
      )}

      {/* Main Content */}
      {!showSplash && (
        <main className="relative z-10 container mx-auto px-6 py-12">
          
          {/* Stars Display */}
          <div className="text-center mb-12">
            <div className="inline-block bg-white/20 backdrop-blur-lg rounded-3xl px-12 py-6 shadow-2xl">
              <div className="text-6xl font-bold text-yellow-400 mb-2">
                ⭐ {totalStars} Stars
              </div>
              <div className="text-2xl text-white/80">Keep collecting to unlock more!</div>
            </div>
          </div>

          {/* 🐻 BUDDY WITH JINGLE PLAYER */}
          <div className="max-w-4xl mx-auto mb-12 relative">
            <div className="relative flex items-center justify-center">
              {/* 3D Buddy in background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Buddy3DSimple />
              </div>
              
              {/* Clickable Jingle Player on top */}
              <div className="relative z-20 mt-[300px]">
                <BuddyJinglePlayer 
                  jingleUrl="/audio/buddy-jingle-full.mp3" // Full song when clicked!
                  onPlay={() => {
                    // Lower background music when playing full song
                    if (backgroundMusicEnabled) {
                      audioManager.setVolume('buddy_background_music', 0.1);
                    }
                  }}
                  onEnd={() => {
                    // Restore background music volume
                    if (backgroundMusicEnabled) {
                      audioManager.setVolume('buddy_background_music', 0.3);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Activity Modules Grid */}
          <div className="grid grid-cols-5 gap-6 max-w-7xl mx-auto">
            {ACTIVITIES.map((module) => {
              const isLocked = totalStars < module.starsRequired;
              
              return (
                <button
                  key={module.id}
                  onClick={() => !isLocked && handleActivityClick(module)}
                  disabled={isLocked}
                  className={`relative group ${
                    isLocked 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'cursor-pointer transform hover:scale-110'
                  } transition-all`}
                >
                  <div className={`
                    bg-gradient-to-br ${module.gradient || 'from-white/20 to-white/10'}
                    backdrop-blur-lg rounded-3xl p-8 shadow-2xl
                    ${!isLocked && 'hover:shadow-3xl'}
                  `}>
                    
                    {/* Lock Icon */}
                    {isLocked && (
                      <div className="absolute top-4 right-4 text-4xl">🔒</div>
                    )}

                    {/* Module Icon */}
                    <div className="text-8xl mb-4 text-center">{module.icon}</div>
                    
                    {/* Module Name */}
                    <div className="text-2xl font-bold text-white text-center mb-2">
                      {module.name}
                    </div>

                    {/* Stars Required */}
                    {isLocked && (
                      <div className="text-center text-yellow-400 font-bold">
                        Unlock at {module.starsRequired} ⭐
                      </div>
                    )}

                    {/* Progress */}
                    {!isLocked && (
                      <div className="text-center text-white/80">
                        {module.levels.length} activities
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* Voice Recorder Modal */}
      <AnimatePresence>
        {showVoiceRecorder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-4xl w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-4xl font-bold">🎤 Talk with Buddy!</h2>
                <button
                  onClick={() => setShowVoiceRecorder(false)}
                  className="text-4xl hover:scale-110 transition-transform"
                >
                  ✕
                </button>
              </div>
              <BuddyVoiceRecorder />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Parent Dashboard */}
      <AnimatePresence>
        {showParentDashboard && (
          <ParentDashboard onClose={() => setShowParentDashboard(false)} />
        )}
      </AnimatePresence>

      {/* Activity Modal */}
      <AnimatePresence>
        {showActivityModal && selectedActivity && (
          <ActivityModal
            activity={selectedActivity}
            onClose={() => {
              setShowActivityModal(false);
              // Restore background music
              if (backgroundMusicEnabled) {
                audioManager.setVolume('buddy_background_music', 0.3);
              }
            }}
            onComplete={handleActivityComplete}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            musicEnabled={backgroundMusicEnabled}
            onMusicToggle={(enabled) => {
              if (enabled) {
                startBackgroundMusic();
              } else {
                stopBackgroundMusic();
              }
              setBackgroundMusicEnabled(enabled);
            }}
          />
        )}
      </AnimatePresence>

      {/* Animations */}
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
          <Confetti 
            duration={3000}
            onComplete={() => setShowConfetti(false)}
          />
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
    </div>
  );
}

// Settings Modal Component (with music controls)
function SettingsModal({ 
  onClose, 
  musicEnabled, 
  onMusicToggle 
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
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-4xl font-bold">⚙️ Settings</h2>
          <button
            onClick={onClose}
            className="text-4xl hover:scale-110 transition-transform"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Background Music Toggle */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-2xl font-bold mb-1">🎵 Buddy's Theme Song</h3>
                <p className="text-gray-600">Background music on main menu</p>
              </div>
              <button
                onClick={() => onMusicToggle(!musicEnabled)}
                className={`px-6 py-3 rounded-xl text-xl font-bold transition-all ${
                  musicEnabled
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {musicEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
          </div>

          {/* Master Volume */}
          <div>
            <label className="text-2xl font-bold mb-2 block">🔊 Master Volume</label>
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
            <div className="text-center text-gray-600 mt-2">
              {Math.round(masterVolume * 100)}%
            </div>
          </div>

          {/* Music Volume */}
          <div>
            <label className="text-2xl font-bold mb-2 block">🎵 Music Volume</label>
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
            <div className="text-center text-gray-600 mt-2">
              {Math.round(musicVolume * 100)}%
            </div>
          </div>

          {/* SFX Volume */}
          <div>
            <label className="text-2xl font-bold mb-2 block">🎮 Sound Effects</label>
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
            <div className="text-center text-gray-600 mt-2">
              {Math.round(sfxVolume * 100)}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
