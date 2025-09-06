import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

const LiveThoughts: React.FC = () => {
  const { 
    lastSubGoal, 
    lastAction,
    currentState,
    modelAccuracy,
    isPlaying,
    phase
  } = useSimulationStore();

  const getPlannerThought = () => {
    if (!isPlaying) return null;
    
    if (!currentState.hasKey) {
      return modelAccuracy.planner > 50 
        ? "I need to get the key first! 🎯"
        : "Hmm, what should I do? 🤔";
    } else if (!currentState.doorOpen) {
      return modelAccuracy.planner > 50
        ? "Got the key! Now to the door! 🚪"
        : "I have something... now what? 🤷";
    }
    return "Task complete! 🎉";
  };

  const getDoerThought = () => {
    if (!isPlaying || !lastSubGoal) return null;
    
    const trained = modelAccuracy.doer > 50;
    
    switch (lastSubGoal) {
      case 'GoToKey':
        if (currentState.agentPos < currentState.keyPos) {
          return trained ? "Moving right to key ➡️" : "Maybe go right? 🤔";
        } else if (currentState.agentPos > currentState.keyPos) {
          return trained ? "Moving left to key ⬅️" : "Try left? 🤔";
        } else {
          return trained ? "Pick up the key! 🤏" : "What's this? 🤔";
        }
      
      case 'GoToDoor':
        if (currentState.agentPos < currentState.doorPos) {
          return trained ? "Moving right to door ➡️" : "Wander right? 🤔";
        } else if (currentState.agentPos > currentState.doorPos) {
          return trained ? "Moving left to door ⬅️" : "Wander left? 🤔";
        } else {
          return trained ? "Open the door! 🔓" : "Try opening? 🤔";
        }
      
      case 'OpenDoor':
        return trained ? "Opening! 🔓" : "Push? Pull? 🤷";
      
      default:
        return null;
    }
  };

  const plannerThought = getPlannerThought();
  const doerThought = getDoerThought();

  return (
    <div className="space-y-2">
      {/* Planner Thought */}
      <AnimatePresence>
        {plannerThought && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start space-x-2"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-base" title="Planner - High-level decision maker that sets goals">
              🧠
            </div>
            <div className="bg-blue-100 rounded-lg px-3 py-2 relative">
              <div className="absolute left-0 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-blue-100 -ml-2" />
              <p className="text-base font-medium text-blue-900">
                Planner: {plannerThought}
              </p>
              {lastSubGoal && (
                <p className="text-sm text-blue-700 mt-1">
                  Decision: {lastSubGoal}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Doer Thought */}
      <AnimatePresence>
        {doerThought && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-start space-x-2"
          >
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-base" title="Doer - Low-level executor that performs actions">
              🤖
            </div>
            <div className="bg-green-100 rounded-lg px-3 py-2 relative">
              <div className="absolute left-0 top-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-green-100 -ml-2" />
              <p className="text-base font-medium text-green-900">
                Doer: {doerThought}
              </p>
              {lastAction && (
                <p className="text-sm text-green-700 mt-1">
                  Action: {lastAction}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Training indicator */}
      {phase === 'training' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-purple-100 rounded-lg p-2 text-center"
          title="AI is learning from the training examples"
        >
          <p className="text-sm font-medium text-purple-900">
            📚 Learning from examples: "Key first, then door!"
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LiveThoughts;