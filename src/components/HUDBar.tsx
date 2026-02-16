import { playClick } from '../utils/audioManager';

export function HUDBar({
  left,
  title,
  right,
}: {
  left?: React.ReactNode;
  title?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div
      className="pointer-events-auto relative z-50 flex items-center justify-between px-4 pt-4 pb-3"
      style={{
        paddingLeft: 'calc(env(safe-area-inset-left) + 16px)',
        paddingRight: 'calc(env(safe-area-inset-right) + 16px)',
        paddingTop: 'calc(env(safe-area-inset-top) + 16px)',
      }}
    >
      <div className="flex items-center gap-2 min-w-[96px]">{left}</div>
      <div className="flex-1 text-center select-none">{title}</div>
      <div className="flex items-center justify-end gap-2 min-w-[96px]">{right}</div>
    </div>
  );
}

export function RoundIconButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onPointerDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        playClick();
        onPress();
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        playClick();
        onPress();
      }}
      className="w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-black active:scale-90 transition-transform"
    >
      {children}
    </button>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-2">{children}</div>;
}
