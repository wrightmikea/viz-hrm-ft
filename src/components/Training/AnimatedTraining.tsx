import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

interface AnimatedTrainingProps {
  onComplete?: () => void;
}

const AnimatedTraining: React.FC<AnimatedTrainingProps> = ({ onComplete }) => {
  const { trainingEpisodes, setPhase } = useSimulationStore();
  const [currentExample, setCurrentExample] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [learnedConcepts, setLearnedConcepts] = useState<string[]>([]);

  useEffect(() => {
    if (isProcessing && trainingEpisodes.length > 0) {
      const episode = trainingEpisodes[currentExample];
      if (!episode) return;

      // Calculate speed - first example slow, then faster
      const baseDelay = currentExample === 0 ? 1000 : Math.max(100, 500 / (currentExample + 1));
      
      const timer = setTimeout(() => {
        if (currentStep < episode.actions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Move to next example
          if (currentExample < Math.min(9, trainingEpisodes.length - 1)) {
            setCurrentExample(currentExample + 1);
            setCurrentStep(0);
            
            // Add learned concepts progressively
            if (currentExample === 2) {
              setLearnedConcepts(prev => [...prev, "Key comes before door"]);
            }
            if (currentExample === 5) {
              setLearnedConcepts(prev => [...prev, "Move towards targets"]);
            }
            if (currentExample === 8) {
              setLearnedConcepts(prev => [...prev, "Pick when at key, Open when at door"]);
            }
          } else {
            // Training complete
            setIsProcessing(false);
            setLearnedConcepts([]); // Clear learned concepts when training completes
            if (onComplete) onComplete();
          }
        }
      }, baseDelay);

      return () => clearTimeout(timer);
    }
  }, [currentExample, currentStep, isProcessing, trainingEpisodes, onComplete]);

  const startTraining = () => {
    setIsProcessing(true);
    setCurrentExample(0);
    setCurrentStep(0);
    setLearnedConcepts([]);
    setPhase('training');
  };

  if (!isProcessing && currentExample === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-3">
        <h3 className="text-sm font-bold mb-2">Ready to Train</h3>
        <p className="text-xs text-gray-600 mb-3">
          The AI will study {trainingEpisodes.length} examples, starting slowly then speeding up.
        </p>
        <motion.button
          onClick={startTraining}
          className="w-full px-4 py-2 bg-green-500 text-white rounded font-medium hover:bg-green-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🎓 Start Training Animation
        </motion.button>
      </div>
    );
  }

  const episode = trainingEpisodes[currentExample];
  if (!episode) return null;

  const progress = ((currentExample + (currentStep / episode.actions.length)) / Math.min(10, trainingEpisodes.length)) * 100;

  return (
    <div className="bg-white rounded-lg shadow p-3 space-y-3">
      {/* Training Header */}
      <div>
        <h3 className="text-sm font-bold">Training in Progress</h3>
        <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
          <span>Processing Example {currentExample + 1}/{Math.min(10, trainingEpisodes.length)}</span>
          <span>Speed: {currentExample === 0 ? '1x' : `${currentExample + 1}x`}</span>
        </div>
      </div>

      {/* Current Example Visualization */}
      <div className="bg-gray-50 rounded p-2">
        <div className="flex items-center space-x-1 mb-2">
          <span className="text-xs font-medium">Path:</span>
          {/* Show mini world with current position */}
          <div className="flex space-x-0.5">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded text-xs flex items-center justify-center ${
                  i === episode.states[currentStep]?.agentPos ? 'bg-blue-500' :
                  i === episode.states[0].keyPos ? 'bg-yellow-200' :
                  i === episode.states[0].doorPos ? 'bg-green-200' :
                  'bg-gray-200'
                }`}
              >
                {i === episode.states[currentStep]?.agentPos ? '🧍' :
                 i === episode.states[0].keyPos && !episode.states[currentStep]?.hasKey ? '🔑' :
                 i === episode.states[0].doorPos ? '🚪' : ''}
              </div>
            ))}
          </div>
        </div>

        {/* Action sequence */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-medium">Actions:</span>
          <div className="flex space-x-0.5">
            {episode.actions.map((action, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: i <= currentStep ? 1 : 0.3,
                  scale: i === currentStep ? 1.2 : 1
                }}
                className="text-xs"
              >
                {action === 'Left' ? '←' : 
                 action === 'Right' ? '→' : 
                 action === 'Pick' ? '🤏' : '🔓'}
              </motion.span>
            ))}
          </div>
        </div>
      </div>

      {/* Learning Visualization */}
      <div className="space-y-2">
        <div className="text-xs font-medium">AI is learning:</div>
        
        {/* Planner Learning */}
        <motion.div 
          className="bg-blue-50 rounded p-2"
          animate={{ 
            borderColor: currentStep === 0 ? '#3b82f6' : '#dbeafe',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs">🧠 Planner:</span>
            <div className="flex items-center space-x-1">
              <div className="w-20 bg-blue-200 rounded-full h-1.5">
                <motion.div
                  className="bg-blue-500 h-1.5 rounded-full"
                  animate={{ width: `${30 + progress * 0.65}%` }}
                />
              </div>
              <span className="text-xs font-mono">{Math.round(30 + progress * 0.65)}%</span>
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            {episode.states[currentStep]?.hasKey ? "Go to door after getting key" : "Get key first"}
          </p>
        </motion.div>

        {/* Doer Learning */}
        <motion.div 
          className="bg-green-50 rounded p-2"
          animate={{ 
            borderColor: currentStep > 0 ? '#10b981' : '#d1fae5',
            borderWidth: '2px'
          }}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs">🤖 Doer:</span>
            <div className="flex items-center space-x-1">
              <div className="w-20 bg-green-200 rounded-full h-1.5">
                <motion.div
                  className="bg-green-500 h-1.5 rounded-full"
                  animate={{ width: `${40 + progress * 0.55}%` }}
                />
              </div>
              <span className="text-xs font-mono">{Math.round(40 + progress * 0.55)}%</span>
            </div>
          </div>
          <p className="text-xs text-green-700 mt-1">
            Action {currentStep + 1}: {episode.actions[currentStep]} 
            {episode.actions[currentStep] === 'Pick' && " (at key position)"}
            {episode.actions[currentStep] === 'Open' && " (at door with key)"}
          </p>
        </motion.div>
      </div>

      {/* Learned Concepts */}
      <AnimatePresence>
        {learnedConcepts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-purple-50 rounded p-2"
          >
            <div className="text-xs font-medium text-purple-900 mb-1">💡 Concepts Learned:</div>
            {learnedConcepts.map((concept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-purple-700"
              >
                ✓ {concept}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overall Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Overall Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full"
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedTraining;