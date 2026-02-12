// SCIENCE MODULE - 4 Complete Activities
// Exploration, discovery, and scientific thinking

import { useState } from 'react';
import { motion } from 'framer-motion';

// ===========================================
// SCIENCE ACTIVITIES (Unlock at 30 stars)
// ===========================================

// Level 1: Day & Night Cycle
export function DayNightCycle({ level, onComplete }: any) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [understood, setUnderstood] = useState<boolean[]>([]);
  
  const phases = [
    {
      title: "Morning - The Sun Rises",
      emoji: "🌅",
      time: "6:00 AM",
      description: "The Sun comes up in the east. The sky becomes bright and colorful!",
      color: "from-orange-300 to-yellow-200"
    },
    {
      title: "Daytime - The Sun is High",
      emoji: "☀️",
      time: "12:00 PM",
      description: "The Sun is high in the sky. It's bright and warm outside!",
      color: "from-blue-300 to-blue-100"
    },
    {
      title: "Evening - The Sun Sets",
      emoji: "🌆",
      time: "6:00 PM",
      description: "The Sun goes down in the west. The sky turns orange and pink!",
      color: "from-orange-400 to-pink-300"
    },
    {
      title: "Night - The Moon Appears",
      emoji: "🌙",
      time: "9:00 PM",
      description: "The Moon and stars come out. It's time to sleep!",
      color: "from-indigo-900 to-purple-800"
    }
  ];

  const phase = phases[currentPhase];

  const handleNext = () => {
    const newUnderstood = [...understood, true];
    setUnderstood(newUnderstood);
    
    if (currentPhase + 1 >= phases.length) {
      setTimeout(() => onComplete(level.starsReward), 500);
    } else {
      setCurrentPhase(currentPhase + 1);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Day & Night Cycle 🌍</h3>
        <p className="text-xl text-gray-600">Learn how Earth spins!</p>
      </div>

      {/* Current Phase */}
      <motion.div
        key={currentPhase}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-gradient-to-br ${phase.color} rounded-3xl p-16 text-center shadow-2xl`}
      >
        <div className="text-9xl mb-6">{phase.emoji}</div>
        <h4 className="text-4xl font-bold text-white mb-4">{phase.title}</h4>
        <div className="text-3xl font-bold text-white/90 mb-6">{phase.time}</div>
        <p className="text-2xl text-white leading-relaxed max-w-2xl mx-auto">
          {phase.description}
        </p>
      </motion.div>

      {/* Earth Animation */}
      <div className="flex justify-center items-center gap-12">
        <div className="text-center">
          <div className="text-8xl mb-3">🌍</div>
          <div className="text-lg font-bold text-gray-700">Earth Spins!</div>
        </div>
        <div className="text-6xl text-gray-400">→</div>
        <div className="text-center">
          <div className="text-8xl mb-3">{phase.emoji}</div>
          <div className="text-lg font-bold text-gray-700">{phase.title.split(' - ')[0]}</div>
        </div>
      </div>

      {/* Progress */}
      <div className="flex justify-center gap-3">
        {phases.map((_, i) => (
          <div
            key={i}
            className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
              i < currentPhase
                ? 'bg-green-500'
                : i === currentPhase
                ? 'bg-blue-500 scale-125'
                : 'bg-gray-200'
            }`}
          >
            {i < currentPhase ? '✓' : i === currentPhase ? '👁️' : (i + 1)}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleNext}
          className="px-16 py-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-3xl font-bold rounded-3xl hover:scale-105 transition-all shadow-xl"
        >
          {currentPhase + 1 >= phases.length ? 'Got It! 🎉' : 'Next Phase →'}
        </button>
      </div>
    </div>
  );
}

// Level 2: Solar System Explorer
export function SolarSystemExplorer({ level, onComplete }: any) {
  const [visitedPlanets, setVisitedPlanets] = useState<string[]>([]);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  
  const celestialBodies = [
    {
      name: "Sun",
      emoji: "☀️",
      type: "Star",
      fact: "The Sun is a big ball of hot gas that gives us light and warmth!",
      color: "from-yellow-400 to-orange-500"
    },
    {
      name: "Earth",
      emoji: "🌍",
      type: "Planet",
      fact: "Earth is our home! It has water, air, and life.",
      color: "from-blue-400 to-green-400"
    },
    {
      name: "Moon",
      emoji: "🌙",
      type: "Moon",
      fact: "The Moon goes around Earth. It has no air or water.",
      color: "from-gray-300 to-gray-400"
    },
    {
      name: "Mars",
      emoji: "🔴",
      type: "Planet",
      fact: "Mars is called the Red Planet. It's cold and dusty!",
      color: "from-red-400 to-orange-500"
    }
  ];

  const handleVisit = (planetName: string) => {
    setSelectedPlanet(planetName);
  };

  const handleLearn = () => {
    if (selectedPlanet && !visitedPlanets.includes(selectedPlanet)) {
      const newVisited = [...visitedPlanets, selectedPlanet];
      setVisitedPlanets(newVisited);
      
      if (newVisited.length === celestialBodies.length) {
        setTimeout(() => {
          setSelectedPlanet(null);
          setTimeout(() => onComplete(level.starsReward), 500);
        }, 2000);
      } else {
        setTimeout(() => setSelectedPlanet(null), 2000);
      }
    }
  };

  const selected = celestialBodies.find(b => b.name === selectedPlanet);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Solar System Explorer 🚀</h3>
        <p className="text-xl text-gray-600">Visit planets and learn about space!</p>
        <div className="mt-4">
          <span className="text-2xl font-bold text-purple-600">
            {visitedPlanets.length} / {celestialBodies.length} visited
          </span>
        </div>
      </div>

      {/* Selected Planet Detail */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${selected.color} rounded-3xl p-12 text-center`}
        >
          <div className="text-9xl mb-6">{selected.emoji}</div>
          <h4 className="text-5xl font-bold text-white mb-4">{selected.name}</h4>
          <div className="text-2xl text-white/90 mb-6">Type: {selected.type}</div>
          <p className="text-2xl text-white leading-relaxed max-w-3xl mx-auto mb-8">
            {selected.fact}
          </p>
          
          {!visitedPlanets.includes(selected.name) && (
            <button
              onClick={handleLearn}
              className="px-12 py-4 bg-white text-gray-800 text-2xl font-bold rounded-2xl hover:scale-105 transition-all"
            >
              I Learned This! ✓
            </button>
          )}
        </motion.div>
      )}

      {/* Celestial Bodies Grid */}
      <div className="grid grid-cols-4 gap-6">
        {celestialBodies.map(body => (
          <button
            key={body.name}
            onClick={() => handleVisit(body.name)}
            disabled={selectedPlanet !== null}
            className={`p-8 rounded-3xl transition-all ${
              visitedPlanets.includes(body.name)
                ? 'bg-green-500 opacity-70'
                : selectedPlanet === body.name
                ? 'bg-blue-500 scale-110'
                : 'bg-white hover:bg-gray-50 hover:scale-105'
            } shadow-xl`}
          >
            <div className="text-8xl mb-4">{body.emoji}</div>
            <div className="text-xl font-bold text-gray-800">{body.name}</div>
            {visitedPlanets.includes(body.name) && (
              <div className="text-4xl mt-2">✓</div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Level 3: Animal Classification
export function AnimalClassification({ level, onComplete }: any) {
  const [sorted, setSorted] = useState<{[key: string]: string}>({});
  const [draggedAnimal, setDraggedAnimal] = useState<string | null>(null);
  
  const animals = [
    { name: "Dog", emoji: "🐕", type: "mammal" },
    { name: "Cat", emoji: "🐱", type: "mammal" },
    { name: "Robin", emoji: "🐦", type: "bird" },
    { name: "Eagle", emoji: "🦅", type: "bird" },
    { name: "Goldfish", emoji: "🐠", type: "fish" },
    { name: "Shark", emoji: "🦈", type: "fish" },
    { name: "Snake", emoji: "🐍", type: "reptile" },
    { name: "Turtle", emoji: "🐢", type: "reptile" }
  ];

  const categories = [
    {
      type: "mammal",
      name: "Mammals",
      emoji: "🐾",
      description: "Have fur, feed babies milk",
      color: "from-orange-200 to-red-200"
    },
    {
      type: "bird",
      name: "Birds",
      emoji: "🪶",
      description: "Have feathers, can fly",
      color: "from-blue-200 to-cyan-200"
    },
    {
      type: "fish",
      name: "Fish",
      emoji: "🌊",
      description: "Live in water, have fins",
      color: "from-blue-300 to-teal-200"
    },
    {
      type: "reptile",
      name: "Reptiles",
      emoji: "🦎",
      description: "Have scales, cold-blooded",
      color: "from-green-200 to-lime-200"
    }
  ];

  const handleSort = (animalName: string, categoryType: string) => {
    const animal = animals.find(a => a.name === animalName);
    if (animal && animal.type === categoryType) {
      const newSorted = { ...sorted, [animalName]: categoryType };
      setSorted(newSorted);
      
      if (Object.keys(newSorted).length === animals.length) {
        setTimeout(() => onComplete(level.starsReward), 1000);
      }
    }
  };

  const remainingAnimals = animals.filter(a => !sorted[a.name]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Sort the Animals! 🦁</h3>
        <p className="text-xl text-gray-600">Put each animal in the right group!</p>
        <div className="mt-4 text-2xl font-bold text-green-600">
          {Object.keys(sorted).length} / {animals.length} sorted
        </div>
      </div>

      {/* Animals to Sort */}
      {remainingAnimals.length > 0 && (
        <div className="bg-white rounded-3xl p-6">
          <h4 className="text-2xl font-bold text-gray-700 mb-4 text-center">Animals to Sort:</h4>
          <div className="flex gap-4 flex-wrap justify-center">
            {remainingAnimals.map(animal => (
              <div
                key={animal.name}
                className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex flex-col items-center justify-center cursor-move shadow-lg hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-2">{animal.emoji}</div>
                <div className="text-sm font-bold text-gray-700">{animal.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-2 gap-6">
        {categories.map(category => {
          const animalsInCategory = Object.entries(sorted)
            .filter(([_, type]) => type === category.type)
            .map(([name, _]) => animals.find(a => a.name === name)!);

          return (
            <div
              key={category.type}
              className={`bg-gradient-to-br ${category.color} rounded-3xl p-8 min-h-[300px]`}
            >
              <div className="text-center mb-6">
                <div className="text-6xl mb-3">{category.emoji}</div>
                <h4 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h4>
                <p className="text-sm text-gray-600 italic">{category.description}</p>
              </div>

              {/* Drop Zone - Click any remaining animal to sort it here */}
              {remainingAnimals.length > 0 && (
                <div className="mb-4">
                  <div className="text-center">
                    {remainingAnimals.filter(a => a.type === category.type).map(animal => (
                      <button
                        key={animal.name}
                        onClick={() => handleSort(animal.name, category.type)}
                        className="m-2 px-6 py-3 bg-white hover:bg-gray-50 rounded-xl text-lg font-bold transition-all hover:scale-105"
                      >
                        Click to add {animal.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sorted Animals */}
              <div className="flex gap-3 flex-wrap justify-center">
                {animalsInCategory.map(animal => (
                  <div
                    key={animal.name}
                    className="w-24 h-24 bg-white rounded-2xl flex flex-col items-center justify-center shadow-lg"
                  >
                    <div className="text-5xl mb-1">{animal.emoji}</div>
                    <div className="text-xs font-bold text-gray-700">{animal.name}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Level 4: Simple Experiments (Sink or Float)
export function SimpleExperiments({ level, onComplete }: any) {
  const [tested, setTested] = useState<{[key: string]: 'sink' | 'float'}>({});
  const [currentItem, setCurrentItem] = useState<string | null>(null);
  
  const items = [
    { name: "Apple", emoji: "🍎", result: "float" },
    { name: "Rock", emoji: "🪨", result: "sink" },
    { name: "Leaf", emoji: "🍃", result: "float" },
    { name: "Coin", emoji: "🪙", result: "sink" },
    { name: "Ball", emoji: "⚽", result: "float" },
    { name: "Key", emoji: "🔑", result: "sink" }
  ];

  const handleTest = (itemName: string, guess: 'sink' | 'float') => {
    const item = items.find(i => i.name === itemName);
    if (item) {
      const newTested = { ...tested, [itemName]: item.result as 'sink' | 'float' };
      setTested(newTested);
      setCurrentItem(null);
      
      if (Object.keys(newTested).length === items.length) {
        setTimeout(() => onComplete(level.starsReward), 1500);
      }
    }
  };

  const remainingItems = items.filter(i => !tested[i.name]);
  const selected = items.find(i => i.name === currentItem);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-4xl font-bold text-gray-800 mb-3">Sink or Float? 🌊</h3>
        <p className="text-xl text-gray-600">Test what sinks and what floats in water!</p>
        <div className="mt-4 text-2xl font-bold text-blue-600">
          {Object.keys(tested).length} / {items.length} tested
        </div>
      </div>

      {/* Selected Item Test */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl p-12"
        >
          <div className="text-center mb-8">
            <div className="text-9xl mb-6">{selected.emoji}</div>
            <h4 className="text-4xl font-bold text-gray-800 mb-4">{selected.name}</h4>
            <p className="text-2xl text-gray-600">Will it sink or float?</p>
          </div>

          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto">
            <button
              onClick={() => handleTest(selected.name, 'sink')}
              className="py-12 bg-gradient-to-br from-gray-400 to-gray-600 hover:from-gray-500 hover:to-gray-700 rounded-3xl transition-all hover:scale-105 shadow-xl"
            >
              <div className="text-7xl mb-4">⬇️</div>
              <div className="text-3xl font-bold text-white">SINK</div>
            </button>
            <button
              onClick={() => handleTest(selected.name, 'float')}
              className="py-12 bg-gradient-to-br from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 rounded-3xl transition-all hover:scale-105 shadow-xl"
            >
              <div className="text-7xl mb-4">⬆️</div>
              <div className="text-3xl font-bold text-white">FLOAT</div>
            </button>
          </div>
        </motion.div>
      )}

      {/* Items to Test */}
      {!selected && remainingItems.length > 0 && (
        <div className="bg-white rounded-3xl p-8">
          <h4 className="text-2xl font-bold text-gray-700 mb-6 text-center">Choose an item to test:</h4>
          <div className="grid grid-cols-6 gap-6">
            {remainingItems.map(item => (
              <button
                key={item.name}
                onClick={() => setCurrentItem(item.name)}
                className="aspect-square bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 rounded-3xl flex flex-col items-center justify-center transition-all hover:scale-110 shadow-lg"
              >
                <div className="text-6xl mb-2">{item.emoji}</div>
                <div className="text-sm font-bold text-gray-700">{item.name}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {Object.keys(tested).length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {/* Sinks */}
          <div className="bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl p-8">
            <h4 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              ⬇️ Sinks
            </h4>
            <div className="flex gap-4 flex-wrap justify-center">
              {items.filter(i => tested[i.name] === 'sink').map(item => (
                <div key={item.name} className="text-6xl">{item.emoji}</div>
              ))}
            </div>
          </div>

          {/* Floats */}
          <div className="bg-gradient-to-br from-blue-200 to-cyan-200 rounded-3xl p-8">
            <h4 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              ⬆️ Floats
            </h4>
            <div className="flex gap-4 flex-wrap justify-center">
              {items.filter(i => tested[i.name] === 'float').map(item => (
                <div key={item.name} className="text-6xl">{item.emoji}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
