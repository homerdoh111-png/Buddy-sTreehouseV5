import { motion } from 'framer-motion';

export type HomeDockAction =
  | 'learn'
  | 'play'
  | 'explore'
  | 'rewards'
  | 'parent'
  | 'music'
  | 'settings';

type DockItem = {
  id: HomeDockAction;
  label: string;
  emoji: string;
  variant?: 'primary' | 'secondary';
};

const ITEMS: DockItem[] = [
  { id: 'play', label: 'Play', emoji: '🎮', variant: 'primary' },
  { id: 'learn', label: 'Learn', emoji: '📚', variant: 'primary' },
  { id: 'explore', label: 'Explore', emoji: '🌳' },
  { id: 'rewards', label: 'Rewards', emoji: '⭐' },
  { id: 'music', label: 'Music', emoji: '🎵' },
];

export function HomeDock({
  onAction,
  reducedMotion = false,
}: {
  onAction: (action: HomeDockAction) => void;
  reducedMotion?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="absolute left-0 right-0 bottom-3 md:bottom-4 z-30 pointer-events-none"
    >
      <div className="mx-auto w-[min(720px,calc(100%-24px))]" data-testid="home-dock">
        <div className="pointer-events-auto bg-black/35 backdrop-blur-xl border border-white/10 shadow-2xl rounded-3xl px-3 py-2 md:px-4 md:py-3">
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {ITEMS.map((item, idx) => (
              <motion.button
                key={item.id}
                data-testid={`dock-${item.id}`}
                onClick={() => onAction(item.id)}
                whileTap={{ scale: 0.95 }}
                animate={
                  reducedMotion
                    ? undefined
                    : {
                        y: [0, -2, 0],
                      }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : {
                        delay: 0.8 + idx * 0.08,
                        duration: 2.6,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }
                }
                className={
                  `flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 md:py-3 ` +
                  `border border-white/10 shadow-lg active:shadow-inner ` +
                  (item.variant === 'primary'
                    ? 'bg-gradient-to-b from-white/18 to-white/8'
                    : 'bg-white/10')
                }
                aria-label={item.label}
              >
                <div className="text-2xl md:text-3xl leading-none">{item.emoji}</div>
                <div className="text-[11px] md:text-xs font-bold text-white/90">{item.label}</div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
