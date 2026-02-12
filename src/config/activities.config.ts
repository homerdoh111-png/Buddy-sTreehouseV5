export interface Activity {
  id: string;
  title: string;
  description: string;
  icon: string;
  stars: number;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'quiz' | 'interactive' | 'creative' | 'matching' | 'sorting' | 'counting';
}

export interface LearningModule {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  activities: Activity[];
}

export const MODULES: LearningModule[] = [
  {
    id: 'logic',
    title: 'Logic & Thinking',
    icon: '🧩',
    color: '#9C27B0',
    description: 'Puzzles and problem-solving adventures',
    activities: [
      { id: 'logic-1', title: 'Pattern Finder', description: 'Find the next shape in the pattern', icon: '🔷', stars: 4, difficulty: 'easy', type: 'matching' },
      { id: 'logic-2', title: 'Sorting Safari', description: 'Sort animals by size', icon: '🦁', stars: 4, difficulty: 'easy', type: 'sorting' },
      { id: 'logic-3', title: 'Maze Runner', description: 'Help Buddy find the way home', icon: '🏃', stars: 4, difficulty: 'medium', type: 'interactive' },
      { id: 'logic-4', title: 'Odd One Out', description: 'Which one doesn\'t belong?', icon: '🔍', stars: 4, difficulty: 'medium', type: 'quiz' },
      { id: 'logic-5', title: 'Sequence Master', description: 'Complete the number sequence', icon: '🔢', stars: 4, difficulty: 'hard', type: 'interactive' },
    ],
  },
  {
    id: 'science',
    title: 'Science Explorer',
    icon: '🔬',
    color: '#4CAF50',
    description: 'Discover how the world works',
    activities: [
      { id: 'sci-1', title: 'Weather Watch', description: 'Learn about different weather types', icon: '🌤️', stars: 4, difficulty: 'easy', type: 'matching' },
      { id: 'sci-2', title: 'Plant Growth', description: 'Watch a seed become a flower', icon: '🌱', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'sci-3', title: 'Animal Homes', description: 'Match animals to their habitats', icon: '🏠', stars: 4, difficulty: 'medium', type: 'matching' },
      { id: 'sci-4', title: 'Body Parts', description: 'Learn about your amazing body', icon: '🫀', stars: 4, difficulty: 'medium', type: 'quiz' },
    ],
  },
  {
    id: 'math',
    title: 'Math Mountain',
    icon: '🔢',
    color: '#2196F3',
    description: 'Climb to the top with numbers',
    activities: [
      { id: 'math-1', title: 'Counting Stars', description: 'Count the stars in the sky', icon: '⭐', stars: 4, difficulty: 'easy', type: 'counting' },
      { id: 'math-2', title: 'Shape Builder', description: 'Build with geometric shapes', icon: '🔺', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'math-3', title: 'Addition Adventure', description: 'Add numbers together', icon: '➕', stars: 4, difficulty: 'medium', type: 'quiz' },
      { id: 'math-4', title: 'Number Line Jump', description: 'Jump along the number line', icon: '🦘', stars: 4, difficulty: 'medium', type: 'interactive' },
      { id: 'math-5', title: 'Subtraction Submarine', description: 'Subtract to dive deeper', icon: '🚢', stars: 4, difficulty: 'hard', type: 'quiz' },
    ],
  },
  {
    id: 'reading',
    title: 'Reading Rainbow',
    icon: '📚',
    color: '#FF9800',
    description: 'Adventures in letters and words',
    activities: [
      { id: 'read-1', title: 'Letter Land', description: 'Learn your ABCs with Buddy', icon: '🅰️', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'read-2', title: 'Rhyme Time', description: 'Find words that rhyme', icon: '🎵', stars: 4, difficulty: 'easy', type: 'matching' },
      { id: 'read-3', title: 'Story Builder', description: 'Create your own story', icon: '📖', stars: 4, difficulty: 'medium', type: 'creative' },
      { id: 'read-4', title: 'Sight Words', description: 'Practice reading common words', icon: '👀', stars: 4, difficulty: 'medium', type: 'quiz' },
    ],
  },
  {
    id: 'art',
    title: 'Art Studio',
    icon: '🎨',
    color: '#E91E63',
    description: 'Express yourself through art',
    activities: [
      { id: 'art-1', title: 'Color Mixer', description: 'Mix colors to make new ones', icon: '🌈', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'art-2', title: 'Drawing Fun', description: 'Draw with your finger', icon: '✏️', stars: 4, difficulty: 'easy', type: 'creative' },
      { id: 'art-3', title: 'Pattern Maker', description: 'Create beautiful patterns', icon: '🎭', stars: 4, difficulty: 'medium', type: 'creative' },
      { id: 'art-4', title: 'Collage Creator', description: 'Make a digital collage', icon: '🖼️', stars: 4, difficulty: 'medium', type: 'creative' },
    ],
  },
  {
    id: 'music',
    title: 'Music Meadow',
    icon: '🎵',
    color: '#673AB7',
    description: 'Make music and learn rhythm',
    activities: [
      { id: 'music-1', title: 'Drum Circle', description: 'Tap the rhythm pattern', icon: '🥁', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'music-2', title: 'Note Names', description: 'Learn musical notes', icon: '🎶', stars: 4, difficulty: 'easy', type: 'quiz' },
      { id: 'music-3', title: 'Sound Match', description: 'Match instruments to sounds', icon: '🎸', stars: 4, difficulty: 'medium', type: 'matching' },
      { id: 'music-4', title: 'Song Maker', description: 'Create your own melody', icon: '🎹', stars: 4, difficulty: 'hard', type: 'creative' },
    ],
  },
  {
    id: 'social',
    title: 'Friendship Forest',
    icon: '🤝',
    color: '#FF5722',
    description: 'Learn about feelings and friendship',
    activities: [
      { id: 'social-1', title: 'Emotion Explorer', description: 'Identify different emotions', icon: '😊', stars: 4, difficulty: 'easy', type: 'matching' },
      { id: 'social-2', title: 'Sharing Stories', description: 'Learn about sharing and kindness', icon: '💝', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'social-3', title: 'Manners Matter', description: 'Practice good manners', icon: '🙏', stars: 4, difficulty: 'medium', type: 'quiz' },
      { id: 'social-4', title: 'Teamwork Time', description: 'Work together to solve problems', icon: '🏆', stars: 4, difficulty: 'medium', type: 'interactive' },
    ],
  },
  {
    id: 'movement',
    title: 'Active Adventures',
    icon: '🏃',
    color: '#009688',
    description: 'Move your body and have fun',
    activities: [
      { id: 'move-1', title: 'Dance Party', description: 'Follow the dance moves', icon: '💃', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'move-2', title: 'Yoga Garden', description: 'Try fun yoga poses', icon: '🧘', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'move-3', title: 'Sports Quiz', description: 'Learn about different sports', icon: '⚽', stars: 4, difficulty: 'medium', type: 'quiz' },
    ],
  },
  {
    id: 'nature',
    title: 'Nature Nook',
    icon: '🌿',
    color: '#795548',
    description: 'Explore the natural world',
    activities: [
      { id: 'nature-1', title: 'Bug Hunt', description: 'Find and learn about insects', icon: '🐛', stars: 4, difficulty: 'easy', type: 'matching' },
      { id: 'nature-2', title: 'Tree ID', description: 'Identify different trees', icon: '🌳', stars: 4, difficulty: 'medium', type: 'quiz' },
      { id: 'nature-3', title: 'Ocean Explorer', description: 'Discover sea creatures', icon: '🐠', stars: 4, difficulty: 'medium', type: 'interactive' },
      { id: 'nature-4', title: 'Rock Collection', description: 'Sort different types of rocks', icon: '🪨', stars: 4, difficulty: 'hard', type: 'sorting' },
    ],
  },
  {
    id: 'coding',
    title: 'Code Canyon',
    icon: '💻',
    color: '#607D8B',
    description: 'Introduction to coding concepts',
    activities: [
      { id: 'code-1', title: 'Robot Commands', description: 'Give instructions to a robot', icon: '🤖', stars: 4, difficulty: 'easy', type: 'interactive' },
      { id: 'code-2', title: 'If-Then Game', description: 'Learn about conditions', icon: '🔀', stars: 4, difficulty: 'medium', type: 'quiz' },
      { id: 'code-3', title: 'Loop the Loop', description: 'Understand repeating patterns', icon: '🔄', stars: 4, difficulty: 'medium', type: 'interactive' },
      { id: 'code-4', title: 'Debug Detective', description: 'Find and fix the bug', icon: '🐞', stars: 4, difficulty: 'hard', type: 'interactive' },
      { id: 'code-5', title: 'Algorithm Adventure', description: 'Solve step-by-step challenges', icon: '📋', stars: 4, difficulty: 'hard', type: 'interactive' },
    ],
  },
];

export const ACHIEVEMENTS = [
  { id: 'first-star', title: 'First Star!', description: 'Earn your first star', icon: '⭐', requirement: 1 },
  { id: 'ten-stars', title: 'Star Collector', description: 'Earn 10 stars', icon: '🌟', requirement: 10 },
  { id: 'fifty-stars', title: 'Star Master', description: 'Earn 50 stars', icon: '💫', requirement: 50 },
  { id: 'hundred-stars', title: 'Superstar', description: 'Earn 100 stars', icon: '🏅', requirement: 100 },
  { id: 'all-stars', title: 'Ultimate Champion', description: 'Earn all 164 stars', icon: '👑', requirement: 164 },
  { id: 'first-module', title: 'Explorer', description: 'Complete your first module', icon: '🗺️', requirement: 1 },
  { id: 'five-modules', title: 'Adventurer', description: 'Complete 5 modules', icon: '🧭', requirement: 5 },
  { id: 'all-modules', title: 'World Traveler', description: 'Complete all 10 modules', icon: '🌍', requirement: 10 },
  { id: 'streak-3', title: 'On a Roll', description: 'Complete 3 activities in a row', icon: '🔥', requirement: 3 },
  { id: 'streak-7', title: 'Weekly Warrior', description: 'Complete 7 activities in a row', icon: '⚡', requirement: 7 },
  { id: 'creative-king', title: 'Creative King', description: 'Complete all art activities', icon: '🎨', requirement: 4 },
  { id: 'science-star', title: 'Science Star', description: 'Complete all science activities', icon: '🔬', requirement: 4 },
];

export const TOTAL_STARS = MODULES.reduce(
  (total, mod) => total + mod.activities.reduce((sum, act) => sum + act.stars, 0),
  0
);

export const TOTAL_ACTIVITIES = MODULES.reduce(
  (total, mod) => total + mod.activities.length,
  0
);
