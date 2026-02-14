// Bedtime Game - Put Buddy to bed!
// Inspired by Talking Tom 2 bedtime mechanic
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BedtimeGameProps {
  onClose: () => void;
  onComplete: (energyRestored: number) => void;
}

type BedtimeStep = 'standing' | 'walking' | 'in_bed' | 'tucked' | 'lights_off' | 'sleeping';

export default function BedtimeGame({ onClose, onComplete }: BedtimeGameProps) {
  const [step, setStep] = useState<BedtimeStep>('standing');
  const [lightsOn, setLightsOn] = useState(true);
  const [showZzz, setShowZzz] = useState(false);
  const [complete, setComplete] = useState(false);

  const nextStep = () => {
    switch (step) {
      case 'standing':
        // Buddy walks to bed
        setStep('walking');
        setTimeout(() => setStep('in_bed'), 1200);
        break;
      case 'in_bed':
        // Tuck Buddy in
        setStep('tucked');
        break;
      case 'tucked':
        // Turn off lights
        setLightsOn(false);
        setStep('lights_off');
        setTimeout(() => {
          setStep('sleeping');
          setShowZzz(true);
          setTimeout(() => setComplete(true), 2500);
        }, 1000);
        break;
    }
  };

  const getInstruction = () => {
    switch (step) {
      case 'standing': return 'Tap Buddy to walk to bed';
      case 'walking': return 'Buddy is walking to bed...';
      case 'in_bed': return 'Tap to tuck Buddy in';
      case 'tucked': return 'Tap the lamp to turn off lights';
      case 'lights_off': return 'Shh... Buddy is falling asleep';
      case 'sleeping': return 'Sweet dreams, Buddy!';
    }
  };

  const getBuddyPosition = () => {
    switch (step) {
      case 'standing': return { x: '25%', y: '45%' };
      case 'walking': return { x: '55%', y: '50%' };
      case 'in_bed':
      case 'tucked':
      case 'lights_off':
      case 'sleeping':
        return { x: '55%', y: '52%' };
    }
  };

  const pos = getBuddyPosition();

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col touch-none select-none overflow-hidden transition-colors duration-1000"
      style={{
        background: lightsOn
          ? 'linear-gradient(to bottom, #1e3a5f, #2d5a87, #1a3a5f)'
          : 'linear-gradient(to bottom, #0a1628, #0f1f3a, #0a1628)',
      }}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 pt-6 relative z-20">
        <button
          onClick={onClose}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold active:scale-90 transition-transform"
        >
          &larr;
        </button>
        <div className={`text-xl font-bold transition-colors duration-700 ${lightsOn ? 'text-blue-100' : 'text-blue-300/50'}`}>
          Bedtime
        </div>
        <div className="w-12" />
      </div>

      {/* Stars and Moon (visible when lights off) */}
      <div className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${lightsOn ? 'opacity-20' : 'opacity-100'}`}>
        {/* Moon */}
        <div className="absolute top-[8%] right-[15%] text-7xl">
          &#127769;
        </div>
        {/* Stars */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-xl"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.3 }}
            style={{
              left: `${10 + (i * 7.5) % 85}%`,
              top: `${5 + (i * 11) % 30}%`,
            }}
          >
            &#11088;
          </motion.div>
        ))}
      </div>

      {/* Room Scene */}
      <div className="flex-1 relative">
        {/* Window */}
        <div className="absolute top-[5%] left-[12%] w-24 h-28 border-4 border-amber-800/60 rounded-t-xl bg-gradient-to-b from-indigo-900/50 to-indigo-800/30">
          <div className="absolute inset-0 border-r-2 border-b-2 border-amber-800/40" style={{ right: '50%', bottom: '50%' }} />
        </div>

        {/* Bed */}
        <div className="absolute right-[15%] top-[42%] w-[35%]">
          {/* Headboard */}
          <div className="w-full h-16 bg-amber-800 rounded-t-2xl border-2 border-amber-900 shadow-inner">
            <div className="w-full h-full bg-gradient-to-b from-amber-700 to-amber-800 rounded-t-2xl" />
          </div>
          {/* Mattress */}
          <div className="w-full h-20 bg-blue-200 rounded-b-lg border-2 border-amber-900 border-t-0 relative">
            {/* Pillow */}
            <div className="absolute top-1 left-2 right-[50%] h-8 bg-white rounded-xl shadow-sm border border-gray-200" />
            {/* Blanket (shown when tucked) */}
            {(step === 'tucked' || step === 'lights_off' || step === 'sleeping') && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-b-lg overflow-hidden"
              >
                <div className="absolute top-2 left-0 right-0 h-0.5 bg-blue-300/50" />
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-blue-300/30" />
              </motion.div>
            )}
          </div>
          {/* Bed frame legs */}
          <div className="flex justify-between px-2">
            <div className="w-3 h-6 bg-amber-900 rounded-b" />
            <div className="w-3 h-6 bg-amber-900 rounded-b" />
          </div>
        </div>

        {/* Lamp */}
        <button
          onClick={() => step === 'tucked' && nextStep()}
          className={`absolute left-[15%] top-[40%] transition-all ${step === 'tucked' ? 'active:scale-90 cursor-pointer' : 'cursor-default'}`}
        >
          <div className="flex flex-col items-center">
            {/* Lampshade */}
            <div className={`w-16 h-12 rounded-t-full transition-colors duration-500 ${lightsOn ? 'bg-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.4)]' : 'bg-gray-600'}`}>
              <div className={`w-full h-full rounded-t-full ${lightsOn ? 'bg-gradient-to-b from-yellow-200 to-yellow-400' : 'bg-gradient-to-b from-gray-500 to-gray-600'}`} />
            </div>
            {/* Lamp base */}
            <div className="w-3 h-8 bg-amber-700" />
            <div className="w-10 h-2 bg-amber-700 rounded-full" />
          </div>
          {/* Light glow */}
          {lightsOn && (
            <div className="absolute -inset-8 bg-yellow-300/10 rounded-full blur-xl pointer-events-none" />
          )}
        </button>

        {/* Buddy */}
        <motion.div
          className="absolute z-10"
          animate={{
            left: pos.x,
            top: pos.y,
          }}
          transition={{ type: 'spring', damping: 15, stiffness: 80 }}
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <button
            onClick={() => (step === 'standing' || step === 'in_bed') && nextStep()}
            className={`${step === 'standing' || step === 'in_bed' ? 'active:scale-95 cursor-pointer' : 'cursor-default'}`}
          >
            <motion.div
              animate={
                step === 'walking'
                  ? { y: [0, -5, 0], rotate: [0, 3, -3, 0] }
                  : step === 'sleeping'
                  ? { scale: [1, 1.02, 1] }
                  : {}
              }
              transition={
                step === 'walking'
                  ? { duration: 0.4, repeat: Infinity }
                  : step === 'sleeping'
                  ? { duration: 2, repeat: Infinity }
                  : {}
              }
              className="text-center"
            >
              <div className="text-[90px] leading-none">
                {step === 'sleeping' || step === 'lights_off' ? '&#128564;' : step === 'tucked' ? '&#128522;' : '&#128059;'}
              </div>
            </motion.div>
          </button>

          {/* Zzz animation */}
          {showZzz && (
            <div className="absolute -top-4 -right-4">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                  animate={{
                    opacity: [0, 1, 0],
                    y: [-10 * i, -40 - 20 * i],
                    x: [0, 15 + 5 * i],
                    scale: [0.5 + i * 0.2, 1 + i * 0.2],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.8,
                  }}
                  className="absolute text-blue-200 font-black text-xl"
                >
                  Z
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-[28%] bg-gradient-to-t from-amber-900/40 to-transparent" />

        {/* Instruction */}
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-[8%] left-0 right-0 text-center"
        >
          <span className={`text-lg font-bold px-6 py-3 rounded-2xl ${lightsOn ? 'bg-white/20 text-white' : 'bg-white/10 text-blue-200/70'}`}>
            {getInstruction()}
          </span>
        </motion.div>
      </div>

      {/* Complete Overlay */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              className="bg-gradient-to-b from-indigo-900 to-indigo-950 rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full border border-indigo-700"
            >
              <div className="text-6xl mb-4">&#127769;</div>
              <h2 className="text-3xl font-black text-blue-100 mb-2">Sweet Dreams!</h2>
              <p className="text-lg text-blue-300 mb-6">
                Buddy is sleeping peacefully. Energy restored!
              </p>
              <button
                onClick={() => { onComplete(100); onClose(); }}
                className="px-8 py-3 bg-gradient-to-r from-indigo-400 to-purple-500 text-white font-bold text-lg rounded-2xl active:scale-95 transition-transform shadow-lg"
              >
                Goodnight!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
