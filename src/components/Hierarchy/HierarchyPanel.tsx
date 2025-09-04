import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

const HierarchyPanel: React.FC = () => {
  const { 
    lastSubGoal, 
    lastAction, 
    currentState,
    hierarchyEnabled,
    plannerFrozen,
    doerFrozen,
    modelAccuracy
  } = useSimulationStore();

  const subGoalEmoji = {
    'GoToKey': '🔑',
    'GoToDoor': '🚪',
    'OpenDoor': '🔓'
  };

  const actionEmoji = {
    'Left': '⬅️',
    'Right': '➡️',
    'Pick': '🤏',
    'Open': '🔓'
  };

  return (
    <div className="flex flex-col space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-gray-800">Hierarchical Reasoning Model</h2>
      
      {/* Planner */}
      <div className="relative">
        <motion.div
          className={`p-4 rounded-lg border-2 ${
            plannerFrozen ? 'bg-gray-100 border-gray-400' : 'bg-blue-50 border-blue-400'
          }`}
          animate={{
            scale: lastSubGoal ? [1, 1.05, 1] : 1,
            borderColor: plannerFrozen ? '#9ca3af' : '#60a5fa'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">🧠 Planner</h3>
            {plannerFrozen && <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">FROZEN</span>}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            Selects sub-goals based on world state
          </div>
          
          <AnimatePresence mode="wait">
            {lastSubGoal && (
              <motion.div
                key={lastSubGoal}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2 bg-white p-2 rounded"
              >
                <span className="text-2xl">{subGoalEmoji[lastSubGoal]}</span>
                <span className="font-mono">{lastSubGoal}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-2 text-xs text-gray-500">
            Accuracy: {Math.round(modelAccuracy.planner)}%
          </div>
        </motion.div>

        {/* Connection Arrow */}
        {hierarchyEnabled && (
          <motion.div
            className="absolute left-1/2 transform -translate-x-1/2 my-2"
            animate={{ opacity: lastSubGoal ? 1 : 0.3 }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40">
              <motion.path
                d="M20 5 L20 35 L15 30 M20 35 L25 30"
                stroke="#60a5fa"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }}
              />
            </svg>
          </motion.div>
        )}
      </div>

      {/* Doer */}
      <div className="relative">
        <motion.div
          className={`p-4 rounded-lg border-2 ${
            doerFrozen ? 'bg-gray-100 border-gray-400' : 'bg-green-50 border-green-400'
          }`}
          animate={{
            scale: lastAction ? [1, 1.05, 1] : 1,
            borderColor: doerFrozen ? '#9ca3af' : '#34d399'
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-lg">🤖 Doer</h3>
            {doerFrozen && <span className="text-xs bg-gray-500 text-white px-2 py-1 rounded">FROZEN</span>}
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            Executes actions to achieve sub-goals
          </div>
          
          <AnimatePresence mode="wait">
            {lastAction && (
              <motion.div
                key={lastAction}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center space-x-2 bg-white p-2 rounded"
              >
                <span className="text-2xl">{actionEmoji[lastAction]}</span>
                <span className="font-mono">{lastAction}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-2 text-xs text-gray-500">
            Accuracy: {Math.round(modelAccuracy.doer)}%
          </div>
        </motion.div>
      </div>

      {/* Memory Chip */}
      <motion.div
        className="p-3 bg-purple-50 border-2 border-purple-400 rounded-lg"
        animate={{
          borderColor: currentState.hasKey ? '#c084fc' : '#e9d5ff'
        }}
      >
        <h3 className="font-semibold mb-2">💾 Memory</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm">holding_key:</span>
          <motion.div
            className={`px-2 py-1 rounded text-white text-xs font-mono ${
              currentState.hasKey ? 'bg-green-500' : 'bg-red-500'
            }`}
            animate={{ scale: currentState.hasKey ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
          >
            {currentState.hasKey ? 'true' : 'false'}
          </motion.div>
        </div>
      </motion.div>

      {/* Hierarchy Toggle Indicator */}
      {!hierarchyEnabled && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 bg-yellow-100 border-2 border-yellow-400 rounded-lg text-center"
        >
          <span className="text-sm font-semibold text-yellow-800">
            ⚠️ Hierarchy Disabled - Running in Flat Mode
          </span>
        </motion.div>
      )}
    </div>
  );
};

export default HierarchyPanel;