// BASE MODULES - Interactive activities for Letters, Numbers, Colors, Shapes, Music
// Each activity receives { level, onComplete } props

import { useState, useEffect, useCallback } from 'react';

// ============================================================
// Shared quiz engine for consistent UX across activities
// ============================================================
interface QuizQuestion {
  prompt: string;
  options: { label: string; correct: boolean }[];
  hint?: string;
}

function QuizEngine({
  title,
  emoji,
  questions,
  starsReward,
  onComplete,
  colorScheme = 'blue',
}: {
  title: string;
  emoji: string;
  questions: QuizQuestion[];
  starsReward: number;
  onComplete: (stars: number) => void;
  colorScheme?: string;
}) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [done, setDone] = useState(false);

  const q = questions[current];

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    setShowResult(true);
    const isCorrect = q.options[index].correct;
    if (isCorrect) setScore((s) => s + 1);

    setTimeout(() => {
      if (current + 1 >= questions.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowResult(false);
      }
    }, 1200);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{pct >= 80 ? '\uD83C\uDF1F' : pct >= 50 ? '\uD83D\uDC4D' : '\uD83D\uDCAA'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-2">
          {pct >= 80 ? 'Amazing!' : pct >= 50 ? 'Good job!' : 'Keep practicing!'}
        </h3>
        <p className="text-xl text-gray-500 mb-2">{score} / {questions.length} correct</p>
        <div className="w-48 h-3 bg-gray-200 rounded-full mx-auto mb-6 overflow-hidden">
          <div className="h-full bg-green-400 rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <button
          onClick={() => onComplete(starsReward)}
          className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg"
        >
          Collect {starsReward} Stars!
        </button>
      </div>
    );
  }

  const colors: Record<string, string> = {
    blue: 'from-blue-400 to-blue-600',
    red: 'from-red-400 to-pink-500',
    green: 'from-green-400 to-emerald-500',
    yellow: 'from-yellow-400 to-orange-500',
    purple: 'from-purple-400 to-pink-500',
  };
  const gradient = colors[colorScheme] || colors.blue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-2">{emoji}</div>
        <h3 className="text-2xl font-black text-gray-800">{title}</h3>
        <p className="text-sm text-gray-400 mt-1">Question {current + 1} of {questions.length}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`}
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 text-center">
        <p className="text-2xl md:text-3xl font-bold text-gray-800">{q.prompt}</p>
        {q.hint && <p className="text-sm text-gray-400 mt-2">{q.hint}</p>}
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {q.options.map((opt, i) => {
          let bg = 'bg-white border-2 border-gray-200 hover:border-gray-400';
          if (showResult && selected === i) {
            bg = opt.correct
              ? 'bg-green-100 border-2 border-green-500 scale-105'
              : 'bg-red-100 border-2 border-red-400 scale-95 opacity-70';
          } else if (showResult && opt.correct) {
            bg = 'bg-green-50 border-2 border-green-300';
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`${bg} rounded-2xl p-4 text-center text-xl md:text-2xl font-bold transition-all duration-300 active:scale-95 shadow-sm`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// LETTERS MODULE (starsRequired: 0)
// ============================================================

// Level 1: Letter Recognition
export function LetterRecognition({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'Find the letter B', options: [{ label: 'B', correct: true }, { label: 'D', correct: false }, { label: 'P', correct: false }, { label: 'R', correct: false }] },
    { prompt: 'Find the letter A', options: [{ label: 'V', correct: false }, { label: 'A', correct: true }, { label: 'H', correct: false }, { label: 'N', correct: false }] },
    { prompt: 'Find the letter S', options: [{ label: 'Z', correct: false }, { label: 'C', correct: false }, { label: 'S', correct: true }, { label: '5', correct: false }] },
    { prompt: 'Find the letter M', options: [{ label: 'N', correct: false }, { label: 'W', correct: false }, { label: 'M', correct: true }, { label: 'H', correct: false }] },
    { prompt: 'Find the letter G', options: [{ label: 'C', correct: false }, { label: 'G', correct: true }, { label: 'Q', correct: false }, { label: 'O', correct: false }] },
  ];
  return <QuizEngine title="Letter Recognition" emoji="\uD83D\uDD24" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="red" />;
}

// Level 2: Letter Sounds
export function LetterSounds({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'Which letter says "buh"?', options: [{ label: 'B', correct: true }, { label: 'D', correct: false }, { label: 'P', correct: false }, { label: 'G', correct: false }], hint: 'Like in "ball"' },
    { prompt: 'Which letter says "sss"?', options: [{ label: 'Z', correct: false }, { label: 'S', correct: true }, { label: 'C', correct: false }, { label: 'X', correct: false }], hint: 'Like a snake!' },
    { prompt: 'Which letter says "mmm"?', options: [{ label: 'N', correct: false }, { label: 'W', correct: false }, { label: 'M', correct: true }, { label: 'H', correct: false }], hint: 'Like "yummy!"' },
    { prompt: 'Which letter says "tuh"?', options: [{ label: 'T', correct: true }, { label: 'D', correct: false }, { label: 'P', correct: false }, { label: 'K', correct: false }], hint: 'Like in "top"' },
    { prompt: 'Which letter says "fff"?', options: [{ label: 'V', correct: false }, { label: 'S', correct: false }, { label: 'H', correct: false }, { label: 'F', correct: true }], hint: 'Like in "fish"' },
  ];
  return <QuizEngine title="Letter Sounds" emoji="\uD83D\uDD0A" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="red" />;
}

// Level 3: Letter Matching (uppercase to lowercase)
export function LetterMatching({ level, onComplete }: any) {
  const [pairs] = useState([
    { upper: 'A', lower: 'a' }, { upper: 'B', lower: 'b' }, { upper: 'D', lower: 'd' },
    { upper: 'G', lower: 'g' }, { upper: 'R', lower: 'r' }, { upper: 'E', lower: 'e' },
  ]);
  const [matched, setMatched] = useState<number[]>([]);
  const [selectedUpper, setSelectedUpper] = useState<number | null>(null);
  const [wrongPair, setWrongPair] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const handleLowerClick = (index: number) => {
    if (selectedUpper === null || matched.includes(index)) return;
    if (selectedUpper === index) {
      setMatched((m) => [...m, index]);
      setSelectedUpper(null);
      if (matched.length + 1 >= pairs.length) {
        setTimeout(() => setDone(true), 800);
      }
    } else {
      setWrongPair(index);
      setTimeout(() => { setWrongPair(null); setSelectedUpper(null); }, 600);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDF1F'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-4">All Matched!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">Match the Letters!</h3>
        <p className="text-gray-500">Tap uppercase, then find its lowercase</p>
      </div>
      <div className="flex gap-6 justify-center">
        <div className="space-y-3">
          <p className="text-center text-sm font-bold text-gray-400">UPPERCASE</p>
          {pairs.map((p, i) => (
            <button key={i} onClick={() => !matched.includes(i) && setSelectedUpper(i)}
              className={`w-16 h-16 rounded-xl text-2xl font-black flex items-center justify-center transition-all ${
                matched.includes(i) ? 'bg-green-200 text-green-600 scale-90' :
                selectedUpper === i ? 'bg-blue-500 text-white scale-110 shadow-lg' :
                'bg-white border-2 border-gray-200 text-gray-800 active:scale-95'
              }`}>{p.upper}</button>
          ))}
        </div>
        <div className="space-y-3">
          <p className="text-center text-sm font-bold text-gray-400">lowercase</p>
          {pairs.map((p, i) => (
            <button key={i} onClick={() => handleLowerClick(i)}
              className={`w-16 h-16 rounded-xl text-2xl font-black flex items-center justify-center transition-all ${
                matched.includes(i) ? 'bg-green-200 text-green-600 scale-90' :
                wrongPair === i ? 'bg-red-200 text-red-500 animate-pulse' :
                'bg-white border-2 border-gray-200 text-gray-800 active:scale-95'
              }`}>{p.lower}</button>
          ))}
        </div>
      </div>
      <div className="text-center text-sm text-gray-400">{matched.length} / {pairs.length} matched</div>
    </div>
  );
}

// Level 4: Alphabet Order
export function AlphabetOrder({ level, onComplete }: any) {
  const sequence = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const [placed, setPlaced] = useState<string[]>([]);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);

  const shuffled = useState(() => [...sequence].sort(() => Math.random() - 0.5))[0];

  const handleTap = (letter: string) => {
    if (placed.includes(letter)) return;
    const nextExpected = sequence[placed.length];
    if (letter === nextExpected) {
      const newPlaced = [...placed, letter];
      setPlaced(newPlaced);
      if (newPlaced.length >= sequence.length) {
        setTimeout(() => setDone(true), 600);
      }
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDF1F'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-4">ABC Order!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">Put in ABC Order!</h3>
        <p className="text-gray-500">Tap the letters in alphabetical order</p>
      </div>
      {/* Placed letters */}
      <div className="flex gap-2 justify-center min-h-[60px] bg-gray-50 rounded-2xl p-3">
        {placed.map((l) => (
          <div key={l} className="w-12 h-12 bg-green-400 text-white rounded-xl flex items-center justify-center text-xl font-black">{l}</div>
        ))}
        {placed.length < sequence.length && (
          <div className={`w-12 h-12 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-300 text-xl ${wrong ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}>?</div>
        )}
      </div>
      {/* Available letters */}
      <div className={`flex flex-wrap gap-3 justify-center ${wrong ? 'animate-pulse' : ''}`}>
        {shuffled.map((l) => (
          <button key={l} onClick={() => handleTap(l)} disabled={placed.includes(l)}
            className={`w-14 h-14 rounded-xl text-2xl font-black flex items-center justify-center transition-all shadow-sm ${
              placed.includes(l) ? 'bg-gray-100 text-gray-300 cursor-default' :
              'bg-white border-2 border-gray-200 text-gray-800 active:scale-90 active:bg-blue-50'
            }`}>{l}</button>
        ))}
      </div>
      <p className="text-center text-sm text-gray-400">Next: letter #{placed.length + 1}</p>
    </div>
  );
}


// ============================================================
// NUMBERS MODULE (starsRequired: 5)
// ============================================================

// Level 1: Counting
export function CountingGame({ level, onComplete }: any) {
  const problems = useState(() => [
    { emoji: '\uD83C\uDF4E', count: 3, name: 'apples' },
    { emoji: '\uD83C\uDF1F', count: 5, name: 'stars' },
    { emoji: '\uD83D\uDC3B', count: 2, name: 'bears' },
    { emoji: '\uD83C\uDF3B', count: 4, name: 'flowers' },
    { emoji: '\uD83D\uDE97', count: 6, name: 'cars' },
  ])[0];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  const p = problems[current];
  const makeOptions = (correct: number) => {
    const opts = new Set([correct]);
    while (opts.size < 4) opts.add(Math.max(1, correct + Math.floor(Math.random() * 5) - 2));
    return [...opts].sort(() => Math.random() - 0.5);
  };
  const options = useState(() => problems.map(pr => makeOptions(pr.count)))[0];

  const handleSelect = (num: number) => {
    if (selected !== null) return;
    setSelected(num);
    if (num === p.count) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= problems.length) {
        setDone(true);
      } else {
        setCurrent(c => c + 1);
        setSelected(null);
      }
    }, 1000);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{score >= 4 ? '\uD83C\uDF1F' : '\uD83D\uDCAA'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-2">{score}/{problems.length} correct!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="mt-4 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">Count the {p.name}!</h3>
        <p className="text-sm text-gray-400">{current + 1} / {problems.length}</p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 bg-blue-50 rounded-2xl p-6 min-h-[100px]">
        {[...Array(p.count)].map((_, i) => (
          <span key={i} className="text-5xl">{p.emoji}</span>
        ))}
      </div>
      <p className="text-center text-xl font-bold text-gray-700">How many {p.name}?</p>
      <div className="grid grid-cols-4 gap-3">
        {options[current].map((num) => (
          <button key={num} onClick={() => handleSelect(num)}
            className={`h-16 rounded-2xl text-2xl font-black transition-all ${
              selected === null ? 'bg-white border-2 border-gray-200 active:scale-95' :
              num === p.count ? 'bg-green-400 text-white scale-105' :
              selected === num ? 'bg-red-300 text-white scale-95 opacity-70' :
              'bg-gray-100 text-gray-400'
            }`}>{num}</button>
        ))}
      </div>
    </div>
  );
}

// Level 2: Number Recognition
export function NumberRecognition({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'Which is the number 7?', options: [{ label: '1', correct: false }, { label: '7', correct: true }, { label: 'L', correct: false }, { label: 'T', correct: false }] },
    { prompt: 'Which is the number 3?', options: [{ label: 'E', correct: false }, { label: '8', correct: false }, { label: '3', correct: true }, { label: 'B', correct: false }] },
    { prompt: 'Which is the number 9?', options: [{ label: '9', correct: true }, { label: '6', correct: false }, { label: 'P', correct: false }, { label: 'q', correct: false }] },
    { prompt: 'Which is the number 5?', options: [{ label: 'S', correct: false }, { label: '2', correct: false }, { label: '5', correct: true }, { label: '8', correct: false }] },
    { prompt: 'Which is the number 10?', options: [{ label: 'IO', correct: false }, { label: '10', correct: true }, { label: '01', correct: false }, { label: '1O', correct: false }] },
  ];
  return <QuizEngine title="Number Recognition" emoji="\uD83D\uDD22" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="blue" />;
}

// Level 3: Simple Math
export function SimpleMath({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: '1 + 1 = ?', options: [{ label: '1', correct: false }, { label: '2', correct: true }, { label: '3', correct: false }, { label: '0', correct: false }] },
    { prompt: '2 + 3 = ?', options: [{ label: '4', correct: false }, { label: '6', correct: false }, { label: '5', correct: true }, { label: '3', correct: false }] },
    { prompt: '4 - 1 = ?', options: [{ label: '3', correct: true }, { label: '5', correct: false }, { label: '2', correct: false }, { label: '4', correct: false }] },
    { prompt: '3 + 3 = ?', options: [{ label: '5', correct: false }, { label: '6', correct: true }, { label: '9', correct: false }, { label: '7', correct: false }] },
    { prompt: '5 - 2 = ?', options: [{ label: '2', correct: false }, { label: '4', correct: false }, { label: '7', correct: false }, { label: '3', correct: true }] },
  ];
  return <QuizEngine title="Simple Math" emoji="\u2795" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="blue" />;
}

// Level 4: Number Patterns
export function NumberPatterns({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: '1, 2, 3, __?', options: [{ label: '4', correct: true }, { label: '5', correct: false }, { label: '2', correct: false }, { label: '6', correct: false }], hint: 'Count up by 1' },
    { prompt: '2, 4, 6, __?', options: [{ label: '7', correct: false }, { label: '10', correct: false }, { label: '8', correct: true }, { label: '9', correct: false }], hint: 'Skip counting by 2' },
    { prompt: '10, 9, 8, __?', options: [{ label: '6', correct: false }, { label: '7', correct: true }, { label: '11', correct: false }, { label: '5', correct: false }], hint: 'Count backwards' },
    { prompt: '5, 10, 15, __?', options: [{ label: '25', correct: false }, { label: '16', correct: false }, { label: '20', correct: true }, { label: '18', correct: false }], hint: 'Skip counting by 5' },
    { prompt: '1, 1, 2, 2, 3, __?', options: [{ label: '4', correct: false }, { label: '3', correct: true }, { label: '2', correct: false }, { label: '5', correct: false }], hint: 'Each number repeats twice' },
  ];
  return <QuizEngine title="Number Patterns" emoji="\uD83D\uDD23" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="blue" />;
}


// ============================================================
// COLORS MODULE (starsRequired: 10)
// ============================================================

// Level 1: Color Recognition
export function ColorRecognition({ level, onComplete }: any) {
  const rounds = useState(() => [
    { color: 'bg-red-500', name: 'RED', options: ['RED', 'BLUE', 'GREEN', 'YELLOW'] },
    { color: 'bg-blue-500', name: 'BLUE', options: ['RED', 'BLUE', 'PURPLE', 'GREEN'] },
    { color: 'bg-green-500', name: 'GREEN', options: ['YELLOW', 'BLUE', 'GREEN', 'ORANGE'] },
    { color: 'bg-yellow-400', name: 'YELLOW', options: ['ORANGE', 'YELLOW', 'RED', 'WHITE'] },
    { color: 'bg-purple-500', name: 'PURPLE', options: ['PINK', 'BLUE', 'PURPLE', 'RED'] },
  ])[0];
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const r = rounds[current];

  const handleSelect = (name: string) => {
    if (selected) return;
    setSelected(name);
    if (name === r.name) setScore(s => s + 1);
    setTimeout(() => {
      if (current + 1 >= rounds.length) setDone(true);
      else { setCurrent(c => c + 1); setSelected(null); }
    }, 1000);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDF08'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-2">{score}/{rounds.length} correct!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="mt-4 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">What color is this?</h3>
        <p className="text-sm text-gray-400">{current + 1} / {rounds.length}</p>
      </div>
      <div className="flex justify-center">
        <div className={`w-32 h-32 ${r.color} rounded-3xl shadow-xl`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {r.options.map(name => (
          <button key={name} onClick={() => handleSelect(name)}
            className={`py-4 rounded-2xl text-xl font-bold transition-all ${
              selected === null ? 'bg-white border-2 border-gray-200 active:scale-95' :
              name === r.name ? 'bg-green-400 text-white' :
              selected === name ? 'bg-red-300 text-white opacity-70' :
              'bg-gray-100 text-gray-400'
            }`}>{name}</button>
        ))}
      </div>
    </div>
  );
}

// Level 2: Color Mixing
export function ColorMixing({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: '\uD83D\uDD34 Red + \uD83D\uDD35 Blue = ?', options: [{ label: '\uD83D\uDFE2 Green', correct: false }, { label: '\uD83D\uDFE3 Purple', correct: true }, { label: '\uD83D\uDFE0 Orange', correct: false }, { label: '\uD83D\uDFE1 Yellow', correct: false }] },
    { prompt: '\uD83D\uDD34 Red + \uD83D\uDFE1 Yellow = ?', options: [{ label: '\uD83D\uDFE0 Orange', correct: true }, { label: '\uD83D\uDFE2 Green', correct: false }, { label: '\uD83D\uDFE3 Purple', correct: false }, { label: '\uD83E\uDEA4 Pink', correct: false }] },
    { prompt: '\uD83D\uDD35 Blue + \uD83D\uDFE1 Yellow = ?', options: [{ label: '\uD83D\uDFE3 Purple', correct: false }, { label: '\uD83D\uDFE0 Orange', correct: false }, { label: '\uD83D\uDFE2 Green', correct: true }, { label: '\u26AB Brown', correct: false }] },
    { prompt: '\uD83D\uDD34 Red + \u26AA White = ?', options: [{ label: '\uD83E\uDEA4 Pink', correct: true }, { label: '\uD83D\uDFE0 Orange', correct: false }, { label: '\uD83D\uDFE1 Yellow', correct: false }, { label: '\uD83D\uDFE3 Purple', correct: false }] },
  ];
  return <QuizEngine title="Color Mixing" emoji="\uD83C\uDFA8" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="yellow" />;
}

// Level 3: Rainbow Order
export function RainbowOrder({ level, onComplete }: any) {
  const rainbowColors = [
    { name: 'Red', color: 'bg-red-500' },
    { name: 'Orange', color: 'bg-orange-500' },
    { name: 'Yellow', color: 'bg-yellow-400' },
    { name: 'Green', color: 'bg-green-500' },
    { name: 'Blue', color: 'bg-blue-500' },
    { name: 'Purple', color: 'bg-purple-500' },
  ];
  const [placed, setPlaced] = useState<number[]>([]);
  const [wrong, setWrong] = useState(false);
  const [done, setDone] = useState(false);
  const shuffled = useState(() => rainbowColors.map((_, i) => i).sort(() => Math.random() - 0.5))[0];

  const handleTap = (index: number) => {
    if (placed.includes(index)) return;
    if (index === placed.length) {
      const newPlaced = [...placed, index];
      setPlaced(newPlaced);
      if (newPlaced.length >= rainbowColors.length) setTimeout(() => setDone(true), 600);
    } else {
      setWrong(true);
      setTimeout(() => setWrong(false), 400);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDF08'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-4">Rainbow Complete!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">{'\uD83C\uDF08'} Build the Rainbow!</h3>
        <p className="text-gray-500">Tap colors in rainbow order: Red first!</p>
      </div>
      {/* Rainbow built so far */}
      <div className="flex gap-2 justify-center min-h-[50px]">
        {placed.map(i => (
          <div key={i} className={`w-12 h-12 ${rainbowColors[i].color} rounded-xl shadow-md`} />
        ))}
        <div className={`w-12 h-12 border-2 border-dashed rounded-xl ${wrong ? 'border-red-400 bg-red-50' : 'border-gray-300'}`} />
      </div>
      {/* Available colors */}
      <div className="flex flex-wrap gap-3 justify-center">
        {shuffled.map(i => (
          <button key={i} onClick={() => handleTap(i)} disabled={placed.includes(i)}
            className={`flex flex-col items-center gap-1 transition-all ${placed.includes(i) ? 'opacity-30' : 'active:scale-90'}`}>
            <div className={`w-16 h-16 ${rainbowColors[i].color} rounded-xl shadow-md ${placed.includes(i) ? '' : 'border-2 border-white'}`} />
            <span className="text-xs font-bold text-gray-600">{rainbowColors[i].name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}


// ============================================================
// SHAPES MODULE (starsRequired: 15)
// ============================================================

// Level 1: Shape Recognition
export function ShapeRecognition({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'Which one is a Triangle? \u25B3', options: [{ label: '\u25CB Circle', correct: false }, { label: '\u25B3 Triangle', correct: true }, { label: '\u25A1 Square', correct: false }, { label: '\u2B50 Star', correct: false }] },
    { prompt: 'Which one is a Circle? \u25CB', options: [{ label: '\u25A1 Square', correct: false }, { label: '\u25C7 Diamond', correct: false }, { label: '\u25CB Circle', correct: true }, { label: '\u2B21 Hexagon', correct: false }] },
    { prompt: 'How many sides does a square have?', options: [{ label: '3', correct: false }, { label: '4', correct: true }, { label: '5', correct: false }, { label: '6', correct: false }] },
    { prompt: 'Which shape has 3 sides?', options: [{ label: '\u25A1 Square', correct: false }, { label: '\u25CB Circle', correct: false }, { label: '\u25B3 Triangle', correct: true }, { label: '\u2B23 Pentagon', correct: false }] },
    { prompt: 'Which shape is round?', options: [{ label: '\u25B3 Triangle', correct: false }, { label: '\u25A1 Square', correct: false }, { label: '\u25C7 Diamond', correct: false }, { label: '\u25CB Circle', correct: true }] },
  ];
  return <QuizEngine title="Shape Recognition" emoji="\u25B3" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="green" />;
}

// Level 2: Shape Sorting
export function ShapeSorting({ level, onComplete }: any) {
  const items = useState(() => [
    { shape: '\u25CB', type: 'round', label: 'Circle' },
    { shape: '\u25A1', type: 'straight', label: 'Square' },
    { shape: '\u25B3', type: 'straight', label: 'Triangle' },
    { shape: '\uD83C\uDF1D', type: 'round', label: 'Moon' },
    { shape: '\u25C7', type: 'straight', label: 'Diamond' },
    { shape: '\u26BD', type: 'round', label: 'Ball' },
  ].sort(() => Math.random() - 0.5))[0];
  const [sorted, setSorted] = useState<Record<string, string[]>>({ round: [], straight: [] });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [done, setDone] = useState(false);

  const handleSort = (bucket: string) => {
    if (currentIdx >= items.length || feedback) return;
    const item = items[currentIdx];
    const correct = item.type === bucket;
    setFeedback(correct ? 'correct' : 'wrong');
    if (correct) {
      setSorted(s => ({ ...s, [bucket]: [...s[bucket], item.shape] }));
    }
    setTimeout(() => {
      setFeedback(null);
      const next = correct ? currentIdx + 1 : currentIdx;
      if (next >= items.length) setDone(true);
      else setCurrentIdx(next);
    }, 800);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDF1F'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-4">All Sorted!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  const currentItem = items[currentIdx];
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">Sort the Shapes!</h3>
        <p className="text-gray-500">Is it round or has straight edges?</p>
      </div>
      {/* Current shape */}
      <div className={`text-center py-6 bg-gray-50 rounded-2xl transition-all ${feedback === 'correct' ? 'bg-green-50' : feedback === 'wrong' ? 'bg-red-50 animate-pulse' : ''}`}>
        <div className="text-7xl">{currentItem.shape}</div>
        <p className="text-lg font-bold text-gray-700 mt-2">{currentItem.label}</p>
        <p className="text-sm text-gray-400">{currentIdx + 1} / {items.length}</p>
      </div>
      {/* Buckets */}
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleSort('round')} className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 text-center active:scale-95 transition-all">
          <div className="text-3xl mb-1">{'\u25CB'}</div>
          <p className="font-bold text-blue-700">Round</p>
          <div className="flex gap-1 justify-center mt-2">{sorted.round.map((s, i) => <span key={i} className="text-xl">{s}</span>)}</div>
        </button>
        <button onClick={() => handleSort('straight')} className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 text-center active:scale-95 transition-all">
          <div className="text-3xl mb-1">{'\u25B3'}</div>
          <p className="font-bold text-green-700">Straight edges</p>
          <div className="flex gap-1 justify-center mt-2">{sorted.straight.map((s, i) => <span key={i} className="text-xl">{s}</span>)}</div>
        </button>
      </div>
    </div>
  );
}

// Level 3: Shape Building (identify shapes in pictures)
export function ShapeBuilding({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'A door is shaped like a...', options: [{ label: '\u25A1 Rectangle', correct: true }, { label: '\u25B3 Triangle', correct: false }, { label: '\u25CB Circle', correct: false }, { label: '\u2B50 Star', correct: false }] },
    { prompt: 'A wheel is shaped like a...', options: [{ label: '\u25A1 Square', correct: false }, { label: '\u25CB Circle', correct: true }, { label: '\u25B3 Triangle', correct: false }, { label: '\u25C7 Diamond', correct: false }] },
    { prompt: 'A slice of pizza is shaped like a...', options: [{ label: '\u25CB Circle', correct: false }, { label: '\u25A1 Square', correct: false }, { label: '\u25B3 Triangle', correct: true }, { label: '\u2B50 Star', correct: false }] },
    { prompt: 'A clock face is shaped like a...', options: [{ label: '\u25B3 Triangle', correct: false }, { label: '\u25C7 Diamond', correct: false }, { label: '\u25A1 Square', correct: false }, { label: '\u25CB Circle', correct: true }] },
    { prompt: 'A roof of a house looks like a...', options: [{ label: '\u25B3 Triangle', correct: true }, { label: '\u25A1 Square', correct: false }, { label: '\u25CB Circle', correct: false }, { label: '\u2B21 Hexagon', correct: false }] },
  ];
  return <QuizEngine title="Shapes in Real Life" emoji="\uD83C\uDFE0" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="green" />;
}


// ============================================================
// MUSIC MODULE (starsRequired: 20)
// ============================================================

// Level 1: Rhythm Patterns - Tap the rhythm
export function RhythmPatterns({ level, onComplete }: any) {
  const patterns = [
    { label: 'Slow', beats: [0, 800, 1600] },
    { label: 'Fast', beats: [0, 300, 600, 900] },
    { label: 'Mixed', beats: [0, 400, 800, 1000, 1400] },
  ];
  const [currentPattern, setCurrentPattern] = useState(0);
  const [phase, setPhase] = useState<'listen' | 'play' | 'result'>('listen');
  const [taps, setTaps] = useState<number[]>([]);
  const [tapStart, setTapStart] = useState(0);
  const [activeBeat, setActiveBeat] = useState(-1);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const pattern = patterns[currentPattern];

  const playDemo = useCallback(() => {
    setPhase('listen');
    setActiveBeat(-1);
    pattern.beats.forEach((t, i) => {
      setTimeout(() => setActiveBeat(i), t);
    });
    setTimeout(() => {
      setActiveBeat(-1);
      setPhase('play');
      setTaps([]);
      setTapStart(Date.now());
    }, (pattern.beats[pattern.beats.length - 1] || 0) + 600);
  }, [currentPattern]);

  useEffect(() => { playDemo(); }, [currentPattern]);

  const handleTap = () => {
    if (phase !== 'play') return;
    const t = Date.now() - tapStart;
    const newTaps = [...taps, t];
    setTaps(newTaps);
    setActiveBeat(newTaps.length - 1);
    setTimeout(() => setActiveBeat(-1), 150);

    if (newTaps.length >= pattern.beats.length) {
      // Score: check timing accuracy
      let goodTaps = 0;
      newTaps.forEach((tap, i) => {
        if (Math.abs(tap - pattern.beats[i]) < 400) goodTaps++;
      });
      const passed = goodTaps >= Math.ceil(pattern.beats.length * 0.5);
      if (passed) setScore(s => s + 1);
      setPhase('result');
      setTimeout(() => {
        if (currentPattern + 1 >= patterns.length) setDone(true);
        else setCurrentPattern(c => c + 1);
      }, 1500);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{'\uD83C\uDFB5'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-2">{score}/{patterns.length} rhythms!</h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="mt-4 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">{'\uD83E\uDD41'} Copy the Rhythm!</h3>
        <p className="text-gray-500">Pattern {currentPattern + 1} of {patterns.length}: {pattern.label}</p>
      </div>
      {/* Beat visualization */}
      <div className="flex justify-center gap-3">
        {pattern.beats.map((_, i) => (
          <div key={i} className={`w-10 h-10 rounded-full transition-all duration-150 ${activeBeat === i ? 'bg-purple-500 scale-125' : 'bg-gray-200'}`} />
        ))}
      </div>
      <div className="text-center">
        <p className={`text-lg font-bold ${phase === 'listen' ? 'text-purple-500' : phase === 'play' ? 'text-green-500' : 'text-blue-500'}`}>
          {phase === 'listen' ? 'Watch the pattern...' : phase === 'play' ? `Tap! (${taps.length}/${pattern.beats.length})` : score > 0 ? 'Nice rhythm!' : 'Try to match the timing!'}
        </p>
      </div>
      {/* Tap button */}
      <div className="flex justify-center">
        <button onPointerDown={handleTap} disabled={phase !== 'play'}
          className={`w-32 h-32 rounded-full text-4xl font-black transition-all shadow-xl ${
            phase === 'play' ? 'bg-gradient-to-br from-purple-400 to-pink-500 text-white active:scale-90' : 'bg-gray-200 text-gray-400'
          }`}>
          {'\uD83E\uDD41'}
        </button>
      </div>
    </div>
  );
}

// Level 2: Instrument Sounds
export function InstrumentSounds({ level, onComplete }: any) {
  const questions: QuizQuestion[] = [
    { prompt: 'Which makes a "boom boom" sound?', options: [{ label: '\uD83E\uDD41 Drum', correct: true }, { label: '\uD83C\uDFB9 Piano', correct: false }, { label: '\uD83C\uDFB8 Guitar', correct: false }, { label: '\uD83C\uDFBA Trumpet', correct: false }] },
    { prompt: 'Which has strings you strum?', options: [{ label: '\uD83E\uDD41 Drum', correct: false }, { label: '\uD83C\uDFB8 Guitar', correct: true }, { label: '\uD83C\uDFBA Trumpet', correct: false }, { label: '\uD83C\uDFB5 Flute', correct: false }] },
    { prompt: 'Which has black and white keys?', options: [{ label: '\uD83C\uDFB8 Guitar', correct: false }, { label: '\uD83E\uDD41 Drum', correct: false }, { label: '\uD83C\uDFB9 Piano', correct: true }, { label: '\uD83C\uDFBA Trumpet', correct: false }] },
    { prompt: 'Which do you blow into?', options: [{ label: '\uD83C\uDFB9 Piano', correct: false }, { label: '\uD83C\uDFBA Trumpet', correct: true }, { label: '\uD83E\uDD41 Drum', correct: false }, { label: '\uD83C\uDFB8 Guitar', correct: false }] },
  ];
  return <QuizEngine title="Instrument Sounds" emoji="\uD83C\uDFBC" questions={questions} starsReward={level?.starsReward || 3} onComplete={onComplete} colorScheme="purple" />;
}

// Level 3: Music Memory (Simon-says style)
export function MusicMemory({ level, onComplete }: any) {
  const colorButtons = [
    { id: 0, color: 'bg-red-500', activeColor: 'bg-red-300', label: 'Red' },
    { id: 1, color: 'bg-blue-500', activeColor: 'bg-blue-300', label: 'Blue' },
    { id: 2, color: 'bg-green-500', activeColor: 'bg-green-300', label: 'Green' },
    { id: 3, color: 'bg-yellow-400', activeColor: 'bg-yellow-200', label: 'Yellow' },
  ];
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [phase, setPhase] = useState<'watch' | 'play' | 'result'>('watch');
  const [round, setRound] = useState(0);
  const [done, setDone] = useState(false);
  const maxRounds = 4;

  const playSequence = useCallback((seq: number[]) => {
    setPhase('watch');
    seq.forEach((id, i) => {
      setTimeout(() => setActiveButton(id), i * 600 + 300);
      setTimeout(() => setActiveButton(null), i * 600 + 550);
    });
    setTimeout(() => {
      setPhase('play');
      setPlayerInput([]);
    }, seq.length * 600 + 600);
  }, []);

  useEffect(() => {
    const newSeq = [...sequence, Math.floor(Math.random() * 4)];
    setSequence(newSeq);
    playSequence(newSeq);
  }, [round]);

  const handlePress = (id: number) => {
    if (phase !== 'play') return;
    setActiveButton(id);
    setTimeout(() => setActiveButton(null), 200);

    const newInput = [...playerInput, id];
    setPlayerInput(newInput);

    // Check if wrong
    if (id !== sequence[newInput.length - 1]) {
      setPhase('result');
      setTimeout(() => setDone(true), 1200);
      return;
    }

    // Check if completed sequence
    if (newInput.length === sequence.length) {
      setPhase('result');
      setTimeout(() => {
        if (round + 1 >= maxRounds) setDone(true);
        else setRound(r => r + 1);
      }, 1000);
    }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="text-7xl mb-4">{round >= maxRounds ? '\uD83C\uDF1F' : '\uD83D\uDCAA'}</div>
        <h3 className="text-3xl font-black text-gray-800 mb-2">
          {round >= maxRounds ? 'Perfect memory!' : `Reached round ${round + 1}!`}
        </h3>
        <button onClick={() => onComplete(level?.starsReward || 3)} className="mt-4 px-8 py-4 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xl font-bold rounded-2xl active:scale-95 transition-transform shadow-lg">
          Collect {level?.starsReward || 3} Stars!
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-black text-gray-800">{'\uD83E\uDDE0'} Music Memory!</h3>
        <p className="text-gray-500">
          {phase === 'watch' ? 'Watch the pattern...' : `Your turn! (${playerInput.length}/${sequence.length})`}
        </p>
        <p className="text-sm text-gray-400">Round {round + 1} of {maxRounds}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
        {colorButtons.map(btn => (
          <button key={btn.id} onPointerDown={() => handlePress(btn.id)} disabled={phase !== 'play'}
            className={`h-24 rounded-2xl transition-all duration-150 shadow-lg ${
              activeButton === btn.id ? `${btn.activeColor} scale-110` : `${btn.color} ${phase === 'play' ? 'active:scale-95' : 'opacity-80'}`
            }`}
          />
        ))}
      </div>
    </div>
  );
}
