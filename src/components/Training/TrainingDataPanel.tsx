import React from 'react';
import { motion } from 'framer-motion';
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
        transition={{ delay: index * 0.02 }}
        className={`p-0.5 border rounded text-center bg-gray-50 ${isHighlighted ? 'border-blue-500 shadow' : 'border-gray-300'}`}
        title={`Example ${index + 1}: ${episode.actions.length} steps${episode.success ? ' (optimal)' : ' (failed)'}`}
      >
        <div className="text-[10px] font-semibold">#{index + 1}</div>
        <div className="text-[10px] text-gray-600">{episode.actions.length}s</div>
        <div className={`text-[10px] ${episode.success ? 'text-green-600' : 'text-red-600'}`}>
          {episode.success ? '✓' : '✗'}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded shadow p-1">
      <div className="flex items-center justify-between mb-0.5">
        <h3 className="text-xs font-semibold text-gray-800">Training Data</h3>
        <span className="text-[10px] text-gray-600">
          {trainingEpisodes.length} optimal examples
        </span>
      </div>

      {/* Training examples in single row */}
      <div className="grid grid-cols-10 gap-0.5">
        {trainingEpisodes.slice(0, 10).map((episode, index) => 
          renderMiniEpisode(episode, index)
        )}
      </div>
    </div>
  );
};

export default TrainingDataPanel;