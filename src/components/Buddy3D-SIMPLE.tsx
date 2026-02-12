import { motion } from 'framer-motion';
import { useState } from 'react';

interface Buddy3DProps {
  size?: 'small' | 'medium' | 'large';
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  onClick?: () => void;
}

const MOODS = {
  happy: { emoji: '🐻', animation: { rotate: [-3, 3, -3] } },
  excited: { emoji: '🐻', animation: { scale: [1, 1.1, 1], rotate: [-5, 5, -5] } },
  thinking: { emoji: '🐻', animation: { y: [0, -5, 0] } },
  celebrating: { emoji: '🐻', animation: { rotate: [-10, 10, -10], scale: [1, 1.2, 1] } },
};

const SIZES = {
  small: 'text-6xl',
  medium: 'text-8xl',
  large: 'text-[120px]',
};

export default function Buddy3DSimple({ size = 'medium', mood = 'happy', onClick }: Buddy3DProps) {
  const [isClicked, setIsClicked] = useState(false);
  const config = MOODS[mood];
  const sizeClass = SIZES[size];

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 500);
    onClick?.();
  };

  return (
    <motion.div
      className={`${sizeClass} cursor-pointer select-none relative inline-block`}
      animate={isClicked ? { scale: [1, 1.3, 1], rotate: [0, 360] } : config.animation}
      transition={
        isClicked
          ? { duration: 0.5 }
          : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
      }
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {config.emoji}
      {/* Speech bubble on click */}
      {isClicked && (
        <motion.div
          initial={{ opacity: 0, scale: 0, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: -20 }}
          exit={{ opacity: 0 }}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 py-1 shadow-md text-sm font-body whitespace-nowrap"
        >
          {mood === 'celebrating' ? 'Woohoo! 🎉' : mood === 'thinking' ? 'Hmm... 🤔' : 'Hi there! 👋'}
        </motion.div>
      )}
      {/* Stars around Buddy when celebrating */}
      {mood === 'celebrating' && (
        <>
          <motion.span
            className="absolute -top-2 -left-2 text-xl"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          >
            ⭐
          </motion.span>
          <motion.span
            className="absolute -top-2 -right-2 text-xl"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
          >
            ✨
          </motion.span>
          <motion.span
            className="absolute -bottom-2 left-0 text-xl"
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.6 }}
          >
            🌟
          </motion.span>
        </>
      )}
    </motion.div>
  );
}
