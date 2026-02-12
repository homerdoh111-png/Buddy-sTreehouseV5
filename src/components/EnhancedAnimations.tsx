import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
}

export function ConfettiCelebration({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
      const newPieces: ConfettiPiece[] = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.5,
        rotation: Math.random() * 720,
      }));
      setPieces(newPieces);
    } else {
      setPieces([]);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[100]">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{ y: -20, x: `${piece.x}vw`, opacity: 1, rotate: 0 }}
              animate={{ y: '110vh', opacity: 0, rotate: piece.rotation }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.5, delay: piece.delay, ease: 'easeIn' }}
              style={{ backgroundColor: piece.color }}
              className="absolute w-3 h-3 rounded-sm"
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}

export function StarBurst({ show, count = 5 }: { show: boolean; count?: number }) {
  return (
    <AnimatePresence>
      {show && (
        <div className="relative inline-block">
          {Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2;
            const x = Math.cos(angle) * 60;
            const y = Math.sin(angle) * 60;

            return (
              <motion.span
                key={i}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 0], x, y, opacity: [1, 1, 0] }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
                className="absolute text-2xl"
                style={{ left: '50%', top: '50%' }}
              >
                ⭐
              </motion.span>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}

export function FloatingEmojis({ emojis = ['🎉', '⭐', '🌟', '✨', '💫'] }: { emojis?: string[] }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {emojis.map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-3xl"
          initial={{ y: '100vh', x: `${15 + i * 18}vw`, opacity: 0 }}
          animate={{ y: '-10vh', opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3, delay: i * 0.3, repeat: Infinity, repeatDelay: 5 }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  );
}

export function PulseRing({ color = '#FFD700' }: { color?: string }) {
  return (
    <motion.div
      className="absolute inset-0 rounded-full border-4"
      style={{ borderColor: color }}
      animate={{ scale: [1, 1.5, 2], opacity: [0.6, 0.3, 0] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function AchievementPopup({
  title,
  description,
  icon,
  onClose,
}: {
  title: string;
  description: string;
  icon: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={{ y: -100, opacity: 0, scale: 0.5 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: -100, opacity: 0 }}
      className="fixed top-20 left-1/2 -translate-x-1/2 z-[200] bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-5 shadow-2xl flex items-center gap-4 min-w-[300px]"
      onClick={onClose}
    >
      <motion.span
        className="text-5xl"
        animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 0.5, repeat: 3 }}
      >
        {icon}
      </motion.span>
      <div>
        <h3 className="font-buddy text-white text-lg">Achievement Unlocked!</h3>
        <p className="font-buddy text-yellow-100 text-base">{title}</p>
        <p className="font-body text-yellow-50 text-sm">{description}</p>
      </div>
    </motion.div>
  );
}
