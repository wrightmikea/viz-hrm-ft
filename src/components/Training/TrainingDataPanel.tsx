import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';
import { Episode } from '../../core/game/types';

const TrainingDataPanel: React.FC = () => {
  const { trainingEpisodes, isTraining, trainingProgress } = useSimulationStore();

  const renderMiniEpisode = (episode: Episode, index: number) => {
    const isHighlighted = isTraining && Math.floor((trainingProgress / 100) * trainingEpisodes.length) === index;
    
    return (
      <motion.div
        key={episode.id}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: isHighlighted ? 1.05 : 1,
          borderColor: isHighlighted ? '#3b82f6' : '#e5e7eb'
        }}
        transition={{ delay: index * 0.05 }}
        className={`p-2 border-2 rounded-lg bg-white ${isHighlighted ? 'shadow-lg' : ''}`}
      >
        <div className="text-xs font-semibold mb-1">Example {index + 1}</div>
        
        {/* Mini visualization of the episode path */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex space-x-0.5">
            {episode.actions.slice(0, 8).map((action, i) => (
              <span key={i} className="text-xs">
                {action === 'Left' ? '←' : 
                 action === 'Right' ? '→' : 
                 action === 'Pick' ? '🤏' : '🔓'}
              </span>
            ))}
            {episode.actions.length > 8 && <span className="text-xs">...</span>}
          </div>
        </div>
        
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Steps: {episode.actions.length}</span>
          <span className={`font-semibold ${episode.success ? 'text-green-600' : 'text-red-600'}`}>
            {episode.success ? '✓' : '✗'}
          </span>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-800">Training Data</h3>
        <span className="text-xs text-gray-600">
          {trainingEpisodes.length} optimal examples
        </span>
      </div>

      {/* Training examples grid */}
      <div className="grid grid-cols-5 gap-2 mb-3">
        {trainingEpisodes.slice(0, 10).map((episode, index) => 
          renderMiniEpisode(episode, index)
        )}
      </div>

      {/* How the model learns */}
      <AnimatePresence>
        {isTraining && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-3"
          >
            <div className="text-xs space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-gray-700">
                  <strong>Planner learns:</strong> "When no key → GoToKey, When has key → GoToDoor"
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-gray-700">
                  <strong>Doer learns:</strong> "GoToKey + left of key → move Right"
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-400 to-green-400 h-1.5 rounded-full"
                  animate={{ width: `${trainingProgress}%` }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Training explanation when not training */}
      {!isTraining && trainingEpisodes.length > 0 && (
        <div className="border-t pt-3 text-xs text-gray-600">
          <p>Each example shows the optimal path: Agent → Key → Door</p>
          <p className="mt-1">The model will learn to decompose this into sub-goals and actions.</p>
        </div>
      )}
    </div>
  );
};

export default TrainingDataPanel;