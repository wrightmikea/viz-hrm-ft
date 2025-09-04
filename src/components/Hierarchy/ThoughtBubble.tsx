import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Thought } from '../../core/model/HRM';

interface ThoughtBubbleProps {
  thought: Thought | null;
  position?: 'left' | 'right' | 'top' | 'bottom';
}

const ThoughtBubble: React.FC<ThoughtBubbleProps> = ({ thought, position = 'top' }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'left':
        return 'right-full mr-2';
      case 'right':
        return 'left-full ml-2';
      case 'bottom':
        return 'top-full mt-2';
      case 'top':
      default:
        return 'bottom-full mb-2';
    }
  };

  const getTailPosition = () => {
    switch (position) {
      case 'left':
        return 'right-0 mr-[-8px] border-r-white border-l-transparent border-t-transparent border-b-transparent';
      case 'right':
        return 'left-0 ml-[-8px] border-l-white border-r-transparent border-t-transparent border-b-transparent';
      case 'bottom':
        return 'top-0 mt-[-8px] border-b-white border-t-transparent border-l-transparent border-r-transparent';
      case 'top':
      default:
        return 'bottom-0 mb-[-8px] border-t-white border-b-transparent border-l-transparent border-r-transparent';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'planner':
        return 'bg-blue-100 border-blue-300';
      case 'doer':
        return 'bg-green-100 border-green-300';
      case 'memory':
        return 'bg-purple-100 border-purple-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <AnimatePresence>
      {thought && (
        <motion.div
          className={`absolute ${getPositionClasses()} z-10`}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <div className={`relative px-4 py-2 rounded-lg border-2 ${getTypeColor(thought.type)} shadow-lg`}>
            <p className="text-sm font-medium text-gray-800 whitespace-nowrap">
              {thought.content}
            </p>
            <div className={`absolute w-0 h-0 border-8 ${getTailPosition()}`} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThoughtBubble;