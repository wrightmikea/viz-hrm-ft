import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';
import { Position } from '../../core/game/types';

const WorldTrack: React.FC = () => {
  const { currentState, actionFeedback } = useSimulationStore();
  const tiles = [0, 1, 2, 3, 4] as Position[];

  const getTileContent = (position: Position) => {
    const items = [];
    
    if (currentState.agentPos === position) {
      items.push(
        <motion.div
          key="agent"
          className="text-3xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          🧍
        </motion.div>
      );
    }
    
    if (currentState.keyPos === position && !currentState.hasKey) {
      items.push(
        <motion.div
          key="key"
          className="text-2xl"
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🔑
        </motion.div>
      );
    }
    
    if (currentState.doorPos === position) {
      items.push(
        <motion.div
          key="door"
          className="text-3xl"
          animate={{ 
            rotate: currentState.doorOpen ? 25 : 0
          }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          {currentState.doorOpen ? '🚪' : '🚪'}
        </motion.div>
      );
    }
    
    return items;
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-8">
      <h2 className="text-xl font-bold text-gray-800">1D World</h2>
      
      <div className="flex space-x-2">
        {tiles.map((position) => (
          <motion.div
            key={position}
            className="relative w-20 h-20 bg-gray-200 rounded-lg border-2 border-gray-300 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            animate={{
              backgroundColor: currentState.agentPos === position ? '#fef3c7' : '#e5e7eb',
              borderColor: currentState.agentPos === position ? '#f59e0b' : '#9ca3af'
            }}
          >
            <span className="absolute top-1 left-2 text-xs text-gray-500">{position}</span>
            <div className="flex flex-col items-center justify-center">
              {getTileContent(position)}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg"
          >
            {actionFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center space-x-4 mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Has Key:</span>
          <motion.div
            animate={{ scale: currentState.hasKey ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentState.hasKey ? '✅' : '❌'}
          </motion.div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Door:</span>
          <motion.div
            animate={{ scale: currentState.doorOpen ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentState.doorOpen ? '🔓' : '🔒'}
          </motion.div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Steps:</span>
          <span className={`font-mono ${currentState.steps > 15 ? 'text-red-600' : 'text-gray-800'}`}>
            {currentState.steps}/{currentState.maxSteps}
          </span>
        </div>
      </div>

      {currentState.isComplete && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-4 text-2xl"
        >
          🎉 Task Complete! 🎉
        </motion.div>
      )}
    </div>
  );
};

export default WorldTrack;