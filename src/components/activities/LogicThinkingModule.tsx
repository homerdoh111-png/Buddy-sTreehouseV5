// LOGIC & THINKING MODULE - 4 Complete Activities
// Develops critical thinking, problem-solving, and reasoning skills

import { useState } from 'react';

// ===========================================
// LOGIC ACTIVITIES (Unlock at 25 stars)
// ===========================================

// Level 1: Same & Different (Spot the Difference)
export function SameAndDifferent({ level, onComplete }: any) {
  const [currentPuzzle, setCurrentPuzzle] = useState(0);
  const [foundDifferences, setFoundDifferences] = useState<number[]>([]);
  
  const puzzles = [
    {
      title: "Buddy's Bedroom",
      emoji: "🛏️",
      differences: [
        { id: 1, name: "Missing pillow", position: { x: 30, y: 30 } },
        { id: 2, name: "Different color blanket", position: { x: 60, y: 50 } },
        { id: 3, name: "Extra toy", position: { x: 20, y: 70 } }
      ]
    },
    {
      title: "Kitchen Scene",
      emoji: "🍳",
      differences: [
        { id: 1, name: "Missing apple", position: { x: 40, y: 40 } },
        { id: 2, name: "Different cup", position: { x: 70, y: 30 } },
        { id: 3, name: "Extra spoon", position: { x: 50, y: 60 } }
      ]
    },
    {
      title: "Forest Path",
      emoji: "🌲",
      differences: [
        { id: 1, name: "Different tree", position: { x: 25, y: 35 } },
        { id: 2, name: "Extra bird", position: { x: 65, y: 25 } },
        { id: 3, name: "Missing flower", position: { x: 45, y: 75 } }
      ]
    }
  ];

  const puzzle = puzzles[currentPuzzle];

  const handleClick = (differenceId: number) => {
    if (!foundDifferences.includes(differenceId)) {
      const newFound = [...foundDifferences, differenceId];
      setFoundDifferences(newFound);
      
      if (newFound.length === puzzle.differences.length) {
        setTimeout(() => {
          if (currentPuzzle + 1 >= puzzles.length) {
            onComplete(level.starsReward);
          } else {
            setCurrentPuzzle(currentPuzzle + 1);
            setFoundDifferences([]);
          }
        }, 1500);
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Find What's Different! 🔍</h3>
        <p className="text-xl text-gray-600">Find all 3 differences!</p>
        <div className="text-6xl mt-4">{puzzle.emoji}</div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-center gap-4">
          {puzzle.differences.map((diff) => (
            <div
              key={diff.id}
              className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                foundDifferences.includes(diff.id)
                  ? 'bg-green-500 scale-110'
                  : 'bg-gray-200'
              }`}
            >
              {foundDifferences.includes(diff.id) ? '✓' : '?'}
            </div>
          ))}
        </div>
      </div>

      {/* Picture Area */}
      <div className="grid grid-cols-2 gap-6">
        {/* Left Picture */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-9xl mb-4">{puzzle.emoji}</div>
              <div className="text-2xl font-bold text-gray-700">{puzzle.title}</div>
            </div>
          </div>
        </div>

        {/* Right Picture (with differences) */}
        <div className="relative">
          <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 h-96 flex items-center justify-center">
            <div className="text-center relative">
              <div className="text-9xl mb-4">{puzzle.emoji}</div>
              <div className="text-2xl font-bold text-gray-700">{puzzle.title}</div>
              
              {/* Clickable difference spots */}
              {puzzle.differences.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => handleClick(diff.id)}
                  disabled={foundDifferences.includes(diff.id)}
                  className={`absolute w-20 h-20 rounded-full border-4 transition-all ${
                    foundDifferences.includes(diff.id)
                      ? 'bg-green-500 border-green-600'
                      : 'bg-red-500/20 border-red-500 hover:bg-red-500/40'
                  }`}
                  style={{
                    left: `${diff.position.x}%`,
                    top: `${diff.position.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                >
                  {foundDifferences.includes(diff.id) && (
                    <span className="text-4xl text-white">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hints */}
      <div className="text-center text-gray-600">
        <p className="text-lg">💡 Look carefully at both pictures and click on the differences!</p>
      </div>
    </div>
  );
}

// Level 2: Opposites Matching
export function OppositesMatching({ level, onComplete }: any) {
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selected, setSelected] = useState<string | null>(null);
  
  const opposites = [
    { word1: 'Hot', emoji1: '🔥', word2: 'Cold', emoji2: '❄️' },
    { word1: 'Big', emoji1: '🐘', word2: 'Small', emoji2: '🐁' },
    { word1: 'Happy', emoji1: '😊', word2: 'Sad', emoji2: '😢' },
    { word1: 'Up', emoji1: '⬆️', word2: 'Down', emoji2: '⬇️' },
    { word1: 'Fast', emoji1: '🐆', word2: 'Slow', emoji2: '🐌' }
  ];

  const handleSelect = (word: string) => {
    if (Object.keys(matches).includes(word) || Object.values(matches).includes(word)) {
      return; // Already matched
    }

    if (!selected) {
      setSelected(word);
    } else {
      // Check if it's a match
      const pair = opposites.find(
        (opp) => 
          (opp.word1 === selected && opp.word2 === word) ||
          (opp.word2 === selected && opp.word1 === word)
      );

      if (pair) {
        const newMatches = { ...matches, [selected]: word };
        setMatches(newMatches);
        setSelected(null);
        
        if (Object.keys(newMatches).length === opposites.length) {
          setTimeout(() => onComplete(level.starsReward), 1000);
        }
      } else {
        // Not a match - reset
        setTimeout(() => setSelected(null), 500);
      }
    }
  };

  const allWords = opposites.flatMap(opp => [
    { word: opp.word1, emoji: opp.emoji1 },
    { word: opp.word2, emoji: opp.emoji2 }
  ]).sort(() => Math.random() - 0.5);

  const isMatched = (word: string) => 
    Object.keys(matches).includes(word) || Object.values(matches).includes(word);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Match the Opposites! ⚖️</h3>
        <p className="text-xl text-gray-600">Find words that mean the opposite!</p>
      </div>

      {/* Progress */}
      <div className="text-center text-3xl font-bold text-gray-700">
        {Object.keys(matches).length} / {opposites.length} matched
      </div>

      {/* Word Cards */}
      <div className="grid grid-cols-5 gap-4">
        {allWords.map(({ word, emoji }) => (
          <button
            key={word}
            onClick={() => handleSelect(word)}
            disabled={isMatched(word)}
            className={`p-6 rounded-3xl transition-all ${
              isMatched(word)
                ? 'bg-green-500 text-white scale-95 opacity-60'
                : selected === word
                ? 'bg-blue-500 text-white scale-110 shadow-2xl ring-4 ring-blue-300'
                : 'bg-white hover:bg-gray-50 hover:scale-105 shadow-lg'
            }`}
          >
            <div className="text-6xl mb-3">{emoji}</div>
            <div className="text-xl font-bold">{word}</div>
          </button>
        ))}
      </div>

      {/* Matched Pairs Display */}
      {Object.keys(matches).length > 0 && (
        <div className="bg-white rounded-3xl p-6">
          <h4 className="text-2xl font-bold text-gray-700 mb-4">Matched Pairs:</h4>
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(matches).map(([word1, word2]) => (
              <div key={word1} className="bg-green-100 px-6 py-3 rounded-xl">
                <span className="text-xl font-bold text-gray-800">
                  {word1} ⟷ {word2}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Level 3: Pattern Detective (What Comes Next?)
export function PatternDetective({ level, onComplete }: any) {
  const [currentPattern, setCurrentPattern] = useState(0);
  
  const patterns = [
    {
      sequence: ['🔴', '🔵', '🔴', '🔵', '🔴'],
      missing: 5,
      options: ['🔵', '🔴', '🟡', '🟢'],
      answer: '🔵',
      type: 'AB Pattern'
    },
    {
      sequence: ['⭐', '⭐', '❤️', '⭐', '⭐'],
      missing: 5,
      options: ['⭐', '❤️', '💙', '🌟'],
      answer: '❤️',
      type: 'AAB Pattern'
    },
    {
      sequence: ['🍎', '🍊', '🍋', '🍎', '🍊'],
      missing: 5,
      options: ['🍋', '🍎', '🍊', '🍇'],
      answer: '🍋',
      type: 'ABC Pattern'
    },
    {
      sequence: ['🟢', '🟢', '🔵', '🔵', '🟢'],
      missing: 5,
      options: ['🟢', '🔵', '🔴', '🟡'],
      answer: '🟢',
      type: 'AABB Pattern'
    }
  ];

  const pattern = patterns[currentPattern];

  const handleAnswer = (answer: string) => {
    if (answer === pattern.answer) {
      if (currentPattern + 1 >= patterns.length) {
        setTimeout(() => onComplete(level.starsReward), 1000);
      } else {
        setCurrentPattern(currentPattern + 1);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Pattern Detective! 🕵️</h3>
        <p className="text-xl text-gray-600">What comes next in the pattern?</p>
        <div className="mt-4 px-6 py-3 bg-purple-100 rounded-2xl inline-block">
          <span className="text-lg font-bold text-purple-700">{pattern.type}</span>
        </div>
      </div>

      {/* Pattern Display */}
      <div className="bg-white rounded-3xl p-8">
        <div className="flex justify-center items-center gap-6">
          {pattern.sequence.map((item, i) => (
            <div
              key={i}
              className="w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-7xl"
            >
              {item}
            </div>
          ))}
          
          {/* Missing element */}
          <div className="w-28 h-28 bg-yellow-200 border-4 border-yellow-500 border-dashed rounded-2xl flex items-center justify-center text-7xl">
            ?
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-4 gap-6 max-w-3xl mx-auto">
        {pattern.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            className="aspect-square bg-white hover:bg-purple-50 rounded-3xl text-8xl transition-all hover:scale-110 shadow-lg"
          >
            {option}
          </button>
        ))}
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <p className="text-lg text-gray-600">
          💡 Look at the pattern carefully. What should come next?
        </p>
      </div>
    </div>
  );
}

// Level 4: Point of View (Empathy & Perspective)
export function PointOfView({ level, onComplete }: any) {
  const [currentScenario, setCurrentScenario] = useState(0);
  
  const scenarios = [
    {
      situation: "Buddy's friend dropped their ice cream on the ground.",
      emoji: "🍦",
      question: "How does Buddy's friend feel?",
      options: [
        { feeling: "Sad", emoji: "😢", correct: true },
        { feeling: "Happy", emoji: "😊", correct: false },
        { feeling: "Angry", emoji: "😠", correct: false }
      ]
    },
    {
      situation: "Buddy got a new toy for his birthday!",
      emoji: "🎁",
      question: "How does Buddy feel?",
      options: [
        { feeling: "Excited", emoji: "🤩", correct: true },
        { feeling: "Bored", emoji: "😑", correct: false },
        { feeling: "Scared", emoji: "😨", correct: false }
      ]
    },
    {
      situation: "A friend took Buddy's favorite book without asking.",
      emoji: "📚",
      question: "How does Buddy feel?",
      options: [
        { feeling: "Upset", emoji: "😟", correct: true },
        { feeling: "Proud", emoji: "😌", correct: false },
        { feeling: "Silly", emoji: "🤪", correct: false }
      ]
    },
    {
      situation: "Buddy helped a friend learn something new!",
      emoji: "⭐",
      question: "How does Buddy feel?",
      options: [
        { feeling: "Proud", emoji: "😊", correct: true },
        { feeling: "Worried", emoji: "😰", correct: false },
        { feeling: "Tired", emoji: "😴", correct: false }
      ]
    }
  ];

  const scenario = scenarios[currentScenario];

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      if (currentScenario + 1 >= scenarios.length) {
        setTimeout(() => onComplete(level.starsReward), 1000);
      } else {
        setCurrentScenario(currentScenario + 1);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">How Do They Feel? 💭</h3>
        <p className="text-xl text-gray-600">Think about others' feelings!</p>
      </div>

      {/* Scenario */}
      <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12">
        <div className="text-center">
          <div className="text-9xl mb-6">{scenario.emoji}</div>
          <p className="text-3xl text-gray-800 font-medium leading-relaxed mb-8">
            {scenario.situation}
          </p>
          <div className="text-2xl font-bold text-purple-700">
            {scenario.question}
          </div>
        </div>
      </div>

      {/* Feeling Options */}
      <div className="grid grid-cols-3 gap-8">
        {scenario.options.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option.correct)}
            className="bg-white hover:bg-purple-50 rounded-3xl p-12 transition-all hover:scale-105 shadow-xl"
          >
            <div className="text-9xl mb-6">{option.emoji}</div>
            <div className="text-3xl font-bold text-gray-800">{option.feeling}</div>
          </button>
        ))}
      </div>

      {/* Progress */}
      <div className="text-center text-gray-600">
        <p className="text-lg">Scenario {currentScenario + 1} of {scenarios.length}</p>
      </div>
    </div>
  );
}
