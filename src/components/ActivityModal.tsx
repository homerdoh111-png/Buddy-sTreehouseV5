import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { useBuddyStore } from '../store/buddyStore';
import { audioManager } from '../utils/audioManager';
import { ConfettiCelebration, StarBurst } from './EnhancedAnimations';
import type { Activity } from '../config/activities.config';

interface ActivityModalProps {
  activity: Activity;
  onClose: () => void;
}

// Simple quiz/activity engine
function generateQuestion(activity: Activity) {
  const questions: Record<string, { question: string; options: string[]; correct: number }[]> = {
    quiz: [
      { question: 'What color is the sky on a clear day?', options: ['Red', 'Blue', 'Green', 'Purple'], correct: 1 },
      { question: 'How many legs does a dog have?', options: ['2', '3', '4', '6'], correct: 2 },
      { question: 'What sound does a cat make?', options: ['Woof', 'Meow', 'Moo', 'Baa'], correct: 1 },
      { question: 'Which fruit is yellow?', options: ['Apple', 'Grape', 'Banana', 'Blueberry'], correct: 2 },
    ],
    matching: [
      { question: 'Which animal lives in water?', options: ['Dog', 'Cat', 'Fish', 'Bird'], correct: 2 },
      { question: 'Match: What comes after Monday?', options: ['Wednesday', 'Tuesday', 'Friday', 'Sunday'], correct: 1 },
      { question: 'Which shape has 3 sides?', options: ['Square', 'Circle', 'Triangle', 'Rectangle'], correct: 2 },
    ],
    counting: [
      { question: 'Count: 🍎🍎🍎 How many apples?', options: ['2', '3', '4', '5'], correct: 1 },
      { question: 'What is 2 + 1?', options: ['2', '3', '4', '5'], correct: 1 },
      { question: 'Count: ⭐⭐⭐⭐⭐ How many stars?', options: ['3', '4', '5', '6'], correct: 2 },
    ],
    sorting: [
      { question: 'Which is the biggest?', options: ['Ant', 'Cat', 'Elephant', 'Mouse'], correct: 2 },
      { question: 'Which comes first in ABC order?', options: ['Cat', 'Apple', 'Dog', 'Banana'], correct: 1 },
    ],
    interactive: [
      { question: 'Tap the correct answer: What is 1 + 1?', options: ['1', '2', '3', '4'], correct: 1 },
      { question: 'Which direction does the sun rise?', options: ['West', 'East', 'North', 'South'], correct: 1 },
    ],
    creative: [
      { question: 'Which color do you get mixing red and blue?', options: ['Green', 'Purple', 'Orange', 'Brown'], correct: 1 },
      { question: 'What season comes after winter?', options: ['Summer', 'Spring', 'Fall', 'Winter'], correct: 1 },
    ],
  };

  const pool = questions[activity.type] || questions.quiz;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function ActivityModal({ activity, onClose }: ActivityModalProps) {
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(() => generateQuestion(activity));
  const totalQuestions = 4;

  const completeActivity = useBuddyStore((s) => s.completeActivity);
  const soundEnabled = useBuddyStore((s) => s.soundEnabled);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null) return;

      setSelectedAnswer(index);
      const correct = index === currentQuestion.correct;
      setIsCorrect(correct);

      if (correct) {
        setScore((s) => s + 1);
        if (soundEnabled) audioManager.playSfx('success');
      } else {
        if (soundEnabled) audioManager.playSfx('error');
      }

      setShowResult(true);

      setTimeout(() => {
        if (step + 1 >= totalQuestions) {
          // Activity complete
          const finalScore = correct ? score + 1 : score;
          const stars = Math.ceil((finalScore / totalQuestions) * activity.stars);
          completeActivity(activity.id, stars);
          setShowCelebration(true);
          if (soundEnabled) {
            audioManager.playSfx('celebrate');
            audioManager.playCelebration();
          }
        } else {
          setStep((s) => s + 1);
          setSelectedAnswer(null);
          setShowResult(false);
          setIsCorrect(false);
          setCurrentQuestion(generateQuestion(activity));
        }
      }, 1200);
    },
    [selectedAnswer, currentQuestion, step, totalQuestions, score, activity, completeActivity, soundEnabled]
  );

  const starsEarned = Math.ceil((score / totalQuestions) * activity.stars);

  return (
    <>
      <ConfettiCelebration show={showCelebration} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && !showCelebration && onClose()}
      >
        <motion.div
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {!showCelebration ? (
            <>
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activity.icon}</span>
                  <div>
                    <h2 className="font-buddy text-xl text-gray-800">{activity.title}</h2>
                    <p className="font-body text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  &times;
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                <motion.div
                  className="bg-treehouse-green h-2 rounded-full"
                  animate={{ width: `${((step + 1) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                >
                  <p className="font-body text-lg text-gray-800 text-center mb-6 font-semibold">
                    {currentQuestion.question}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {currentQuestion.options.map((option, i) => {
                      let btnClass = 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-gray-800';
                      if (showResult && selectedAnswer !== null) {
                        if (i === currentQuestion.correct) {
                          btnClass = 'bg-green-100 border-green-500 text-green-800';
                        } else if (i === selectedAnswer && !isCorrect) {
                          btnClass = 'bg-red-100 border-red-400 text-red-800';
                        } else {
                          btnClass = 'bg-gray-50 border-gray-200 text-gray-400';
                        }
                      }

                      return (
                        <motion.button
                          key={i}
                          whileHover={selectedAnswer === null ? { scale: 1.03 } : {}}
                          whileTap={selectedAnswer === null ? { scale: 0.97 } : {}}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`p-4 rounded-xl border-2 font-body font-semibold text-base transition-all ${btnClass}`}
                        >
                          {option}
                          {showResult && i === currentQuestion.correct && ' ✅'}
                          {showResult && i === selectedAnswer && !isCorrect && i !== currentQuestion.correct && ' ❌'}
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Score */}
              <div className="mt-6 text-center font-body text-sm text-gray-500">
                Question {step + 1} of {totalQuestions} | Score: {score}/{step + (showResult ? 1 : 0)}
              </div>
            </>
          ) : (
            /* Celebration Screen */
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center py-6"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-7xl mb-4"
              >
                🎉
              </motion.div>
              <StarBurst show={true} count={starsEarned} />
              <h2 className="font-buddy text-3xl text-treehouse-bark mb-2">Amazing Job!</h2>
              <p className="font-body text-gray-600 mb-4">
                You scored {score} out of {totalQuestions}!
              </p>
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: activity.stars }, (_, i) => (
                  <motion.span
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.2, type: 'spring' }}
                    className="text-3xl"
                  >
                    {i < starsEarned ? '⭐' : '☆'}
                  </motion.span>
                ))}
              </div>
              <p className="font-buddy text-lg text-treehouse-gold mb-6">
                +{starsEarned} Stars!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="px-8 py-3 bg-treehouse-green hover:bg-green-600 text-white font-buddy text-lg rounded-full shadow-lg"
              >
                Continue
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
