import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';
import { Position } from '../../core/game/types';

const WideWorld: React.FC = () => {
  const { currentState, actionFeedback, currentEpisode } = useSimulationStore();
  const tiles = Array.from({ length: currentState.worldSize }, (_, i) => i as Position);

  const getTileContent = (position: Position) => {
    const items = [];
    
    if (currentState.agentPos === position) {
      items.push(
        <motion.div
          key="agent"
          className="text-2xl absolute"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          title="Agent - The AI character learning to solve the puzzle"
        >
          🧍
        </motion.div>
      );
    }
    
    if (currentState.keyPos === position && !currentState.hasKey) {
      items.push(
        <motion.div
          key="key"
          className="text-xl absolute"
          animate={{ 
            rotate: [0, 10, -10, 0],
            y: [0, -3, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          title="Key - Must be picked up before opening the door"
        >
          🔑
        </motion.div>
      );
    }
    
    if (currentState.doorPos === position) {
      items.push(
        <motion.div
          key="door"
          className="text-2xl absolute"
          animate={{ 
            rotate: currentState.doorOpen ? 25 : 0
          }}
          transition={{ type: "spring", stiffness: 100 }}
          title={currentState.doorOpen ? "Door - Opened! Task complete!" : "Door - Can only be opened with the key"}
        >
          🚪
        </motion.div>
      );
    }
    
    return items;
  };

  const optimalSteps = currentEpisode?.optimalSteps || 0;
  const efficiency = optimalSteps > 0 ? Math.round((optimalSteps / currentState.steps) * 100) : 100;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* World Grid */}
      <div className="flex space-x-1 mb-3">
        {tiles.map((position) => {
          const hasKey = currentState.keyPos === position && !currentState.hasKey;
          const hasDoor = currentState.doorPos === position;
          const hasAgent = currentState.agentPos === position;
          const isEmpty = !hasKey && !hasDoor && !hasAgent;
          
          return (
            <motion.div
              key={position}
              className={`relative flex-1 h-16 bg-gray-100 rounded border-2 flex items-center justify-center ${
                currentState.agentPos === position ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              title={isEmpty ? `Empty space at position ${position} - The agent can move here` : undefined}
            >
              <span className="absolute top-0.5 left-1 text-xs text-gray-400">{position}</span>
              {getTileContent(position)}
            </motion.div>
          );
        })}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Steps:</span>
            <span className={`font-mono font-bold ${currentState.steps > 30 ? 'text-red-600' : 'text-gray-800'}`}>
              {currentState.steps}/{currentState.maxSteps}
            </span>
          </div>
          
          {optimalSteps > 0 && (
            <div className="flex items-center space-x-1">
              <span className="text-gray-600">Optimal:</span>
              <span className="font-mono text-green-600">{optimalSteps}</span>
            </div>
          )}
          
          {currentState.steps > 0 && optimalSteps > 0 && (
            <div className="flex items-center space-x-1 group relative">
              <span className="text-gray-600 cursor-help" 
                    title={`Efficiency = (optimal steps ${optimalSteps} / actual steps ${currentState.steps}) × 100 = ${efficiency}%`}>
                Efficiency:
              </span>
              <span className={`font-mono font-bold cursor-help ${
                efficiency >= 80 ? 'text-green-600' : 
                efficiency >= 50 ? 'text-yellow-600' : 'text-red-600'
              }`}
                    title={efficiency > 100 ? 
                      `${efficiency}% means the AI found a path shorter than the expected optimal path!` :
                      `${efficiency}% efficiency (${100-efficiency}% longer than optimal)`
                    }>
                {efficiency}%
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Key:</span>
            <span>{currentState.hasKey ? '✅' : '❌'}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span className="text-gray-600">Door:</span>
            <span>{currentState.doorOpen ? '🔓' : '🔒'}</span>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      <AnimatePresence>
        {(actionFeedback || currentState.isComplete || currentState.isFailed) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-2 px-3 py-1 rounded text-sm text-center ${
              currentState.isComplete ? 'bg-green-100 text-green-800' :
              currentState.isFailed ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
          >
            {currentState.isComplete ? '🎉 Task Complete!' :
             currentState.isFailed ? '❌ Task Failed - Out of steps!' :
             actionFeedback}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WideWorld;