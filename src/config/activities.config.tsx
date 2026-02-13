// Activities Configuration
// This file defines all available learning modules and their activities

import { 
  SameAndDifferent, 
  OppositesMatching, 
  PatternDetective, 
  PointOfView 
} from '../components/activities/LogicThinkingModule';

import {
  DayNightCycle,
  SolarSystemExplorer,
  AnimalClassification,
  SimpleExperiments,
} from '../components/activities/ScienceModule';

import {
  BuddysHomeTour,
  NeighborhoodExplorer,
  GlobeExplorer,
  LetterTracing,
  SpellCVCWords,
  SentenceBuilder,
  StoryCreator,
  BalanceChallenge,
  SimonSaysGame,
  DanceParty,
} from '../components/activities/RemainingModules';

export interface Activity {
  levelNumber: number;
  activity: string;
  component: React.ComponentType<any>;
  starsReward: number;
}

export interface Module {
  id: string;
  name: string;
  icon: string;
  starsRequired: number;
  gradient: string;
  levels: Activity[];
}

// Placeholder components for base modules (these would normally exist)
const PlaceholderActivity = ({ level, onComplete }: { level: any; onComplete: (stars: number) => void }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-6">🚧</div>
    <p className="text-2xl text-gray-600 mb-6">Activity Coming Soon!</p>
    <button
      onClick={() => onComplete(level?.starsReward || 3)}
      className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xl font-bold rounded-2xl hover:scale-105 transition-all shadow-lg"
    >
      Complete & Earn Stars
    </button>
  </div>
);

export const ACTIVITIES: Module[] = [
  // Base Modules (Placeholders for now)
  {
    id: 'letters',
    name: 'Letters',
    icon: '🔤',
    starsRequired: 0,
    gradient: 'from-red-400 to-pink-500',
    levels: [
      { levelNumber: 1, activity: 'letter-recognition', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 2, activity: 'letter-sounds', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 3, activity: 'letter-matching', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 4, activity: 'alphabet-song', component: PlaceholderActivity, starsReward: 3 },
    ],
  },
  
  {
    id: 'numbers',
    name: 'Numbers',
    icon: '🔢',
    starsRequired: 5,
    gradient: 'from-blue-400 to-indigo-500',
    levels: [
      { levelNumber: 1, activity: 'counting', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 2, activity: 'number-recognition', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 3, activity: 'simple-math', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 4, activity: 'number-patterns', component: PlaceholderActivity, starsReward: 3 },
    ],
  },
  
  {
    id: 'colors',
    name: 'Colors',
    icon: '🎨',
    starsRequired: 10,
    gradient: 'from-yellow-400 to-orange-500',
    levels: [
      { levelNumber: 1, activity: 'color-recognition', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 2, activity: 'color-mixing', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 3, activity: 'rainbow-order', component: PlaceholderActivity, starsReward: 3 },
    ],
  },
  
  {
    id: 'shapes',
    name: 'Shapes',
    icon: '⬜',
    starsRequired: 15,
    gradient: 'from-green-400 to-teal-500',
    levels: [
      { levelNumber: 1, activity: 'shape-recognition', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 2, activity: 'shape-sorting', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 3, activity: 'shape-building', component: PlaceholderActivity, starsReward: 3 },
    ],
  },
  
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    starsRequired: 20,
    gradient: 'from-purple-400 to-pink-500',
    levels: [
      { levelNumber: 1, activity: 'rhythm-patterns', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 2, activity: 'instrument-sounds', component: PlaceholderActivity, starsReward: 3 },
      { levelNumber: 3, activity: 'music-memory', component: PlaceholderActivity, starsReward: 3 },
    ],
  },

  // NEW V5 MODULES
  {
    id: 'logic',
    name: 'Logic & Thinking',
    icon: '🧩',
    starsRequired: 25,
    gradient: 'from-purple-400 to-indigo-500',
    levels: [
      { levelNumber: 1, activity: 'same-different', component: SameAndDifferent, starsReward: 4 },
      { levelNumber: 2, activity: 'opposites', component: OppositesMatching, starsReward: 4 },
      { levelNumber: 3, activity: 'patterns', component: PatternDetective, starsReward: 4 },
      { levelNumber: 4, activity: 'empathy', component: PointOfView, starsReward: 4 },
    ],
  },
  
  {
    id: 'science',
    name: 'Science',
    icon: '🔬',
    starsRequired: 30,
    gradient: 'from-green-400 to-teal-500',
    levels: [
      { levelNumber: 1, activity: 'day-night', component: DayNightCycle, starsReward: 4 },
      { levelNumber: 2, activity: 'solar-system', component: SolarSystemExplorer, starsReward: 4 },
      { levelNumber: 3, activity: 'animals', component: AnimalClassification, starsReward: 4 },
      { levelNumber: 4, activity: 'experiments', component: SimpleExperiments, starsReward: 4 },
    ],
  },
  
  {
    id: 'geography',
    name: 'Geography',
    icon: '🌍',
    starsRequired: 35,
    gradient: 'from-blue-400 to-cyan-500',
    levels: [
      { levelNumber: 1, activity: 'home-tour', component: BuddysHomeTour, starsReward: 4 },
      { levelNumber: 2, activity: 'neighborhood', component: NeighborhoodExplorer, starsReward: 4 },
      { levelNumber: 3, activity: 'globe', component: GlobeExplorer, starsReward: 4 },
    ],
  },
  
  {
    id: 'writing',
    name: 'Writing',
    icon: '✍️',
    starsRequired: 40,
    gradient: 'from-yellow-400 to-orange-500',
    levels: [
      { levelNumber: 1, activity: 'tracing', component: LetterTracing, starsReward: 4 },
      { levelNumber: 2, activity: 'spelling', component: SpellCVCWords, starsReward: 4 },
      { levelNumber: 3, activity: 'sentences', component: SentenceBuilder, starsReward: 4 },
      { levelNumber: 4, activity: 'story', component: StoryCreator, starsReward: 4 },
    ],
  },
  
  {
    id: 'physical',
    name: 'Physical Ed',
    icon: '⚽',
    starsRequired: 45,
    gradient: 'from-red-400 to-pink-500',
    levels: [
      { levelNumber: 1, activity: 'balance', component: BalanceChallenge, starsReward: 4 },
      { levelNumber: 2, activity: 'simon-says', component: SimonSaysGame, starsReward: 4 },
      { levelNumber: 3, activity: 'dance', component: DanceParty, starsReward: 4 },
    ],
  },
];

// Calculate total possible stars
export const TOTAL_POSSIBLE_STARS = ACTIVITIES.reduce(
  (total, module) => total + module.levels.reduce((sum, level) => sum + level.starsReward, 0),
  0
);

// Get module by ID
export const getModuleById = (id: string) => 
  ACTIVITIES.find(module => module.id === id);

// Get unlocked modules based on stars
export const getUnlockedModules = (totalStars: number) =>
  ACTIVITIES.filter(module => totalStars >= module.starsRequired);
