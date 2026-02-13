// Buddy 3D Character - Simplified Version
import { motion } from 'framer-motion';

interface Buddy3DSimpleProps {
  mood?: 'happy' | 'excited' | 'thinking' | 'celebrating';
  onClick?: () => void;
  className?: string;
}

export default function Buddy3DSimple({ 
  mood = 'happy', 
  onClick,
  className = '' 
}: Buddy3DSimpleProps) {
  
  const getMoodAnimation = () => {
    switch (mood) {
      case 'excited':
        return {
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, 0],
          transition: { repeat: Infinity, duration: 1 }
        };
      case 'thinking':
        return {
          rotate: [0, -3, 3, 0],
          transition: { repeat: Infinity, duration: 2 }
        };
      case 'celebrating':
        return {
          y: [0, -20, 0],
          rotate: [0, 360],
          transition: { repeat: Infinity, duration: 1.5 }
        };
      default: // happy
        return {
          y: [0, -10, 0],
          transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        };
    }
  };

  return (
    <motion.div
      animate={getMoodAnimation()}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`cursor-pointer select-none ${className}`}
      style={{ width: 120, height: 120 }}
    >
      <div className="relative w-full h-full">
        {/* Buddy's Body */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-2xl">
          {/* Face */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-16 h-16">
            {/* Eyes */}
            <div className="flex gap-4 justify-center mb-2">
              <motion.div 
                className="w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full ml-1 mt-0.5" />
              </motion.div>
              <motion.div 
                className="w-3 h-3 bg-white rounded-full"
                animate={{ scale: [1, 0.8, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
              >
                <div className="w-1.5 h-1.5 bg-black rounded-full ml-1 mt-0.5" />
              </motion.div>
            </div>
            
            {/* Nose */}
            <div className="w-2 h-1.5 bg-amber-900 rounded-full mx-auto mb-1" />
            
            {/* Mouth */}
            <motion.div 
              className="w-6 h-3 border-2 border-amber-900 rounded-b-full mx-auto"
              animate={mood === 'celebrating' ? { scaleX: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.5 }}
            />
          </div>
          
          {/* Ears */}
          <div className="absolute top-2 left-2 w-6 h-8 bg-amber-600 rounded-full transform -rotate-45" />
          <div className="absolute top-2 right-2 w-6 h-8 bg-amber-600 rounded-full transform rotate-45" />
        </div>
      </div>
    </motion.div>
  );
}
