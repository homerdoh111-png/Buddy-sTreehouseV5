// Activity Modal Component
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: any;
  children?: React.ReactNode;
}

export default function ActivityModal({ 
  isOpen, 
  onClose, 
  activity,
  children 
}: ActivityModalProps) {
  
  if (!activity) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className={`bg-gradient-to-r ${activity.gradient || 'from-blue-500 to-purple-500'} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-5xl">{activity.icon || '🎯'}</span>
                    <div>
                      <h2 className="text-3xl font-bold">{activity.name}</h2>
                      <p className="text-white/80">Level {activity.levelNumber || 1}</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X size={32} />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
                {children || (
                  <div className="text-center py-12">
                    <p className="text-gray-600 text-lg">
                      Activity content goes here
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
