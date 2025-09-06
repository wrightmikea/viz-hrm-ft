import React from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';
import { Episode } from '../../core/game/types';

interface TrainingDataPanelProps {
  onExampleClick?: (index: number) => void;
}

const TrainingDataPanel: React.FC<TrainingDataPanelProps> = ({ onExampleClick }) => {
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
        className={`p-1 border-2 rounded bg-gray-50 cursor-pointer hover:bg-gray-100 flex-shrink-0 w-20 h-20 flex flex-col ${
          isHighlighted ? 'border-blue-500 shadow' : 'border-gray-300'
        }`}
        title={`Example ${index + 1}: The PLANNER learns: "Always get key before door" (the pattern). The DOER learns: "How to move toward targets" (the actions). Click for details.`}
        onClick={() => onExampleClick && onExampleClick(index)}
      >
        <div className="text-sm font-bold">#{index + 1}</div>
        <div className="text-xs text-gray-500" title="Starting positions - Planner sees: Key is needed before Door">
          A:{episode.states[0].agentPos} K:{episode.states[0].keyPos} D:{episode.states[0].doorPos}
        </div>
        <div className="text-xs text-gray-600" title="Steps taken - Doer learns these specific movements">{episode.actions.length} steps</div>
        <div className={`text-sm mt-auto ${episode.success ? 'text-green-600' : 'text-red-600'}`}
              title={episode.success ? 'Shows correct sequence: Key→Door (Planner) & optimal moves (Doer)' : 'Failed attempt'}>
          {episode.success ? '✓ Optimal' : '✗ Failed'}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded shadow p-2 h-full flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-gray-800 cursor-help" 
            title="Each example teaches TWO things: The PLANNER learns the pattern 'Key before Door' from seeing it in every example. The DOER learns how to execute movements by studying the action sequences.">
          Training Data
        </h3>
        <span className="text-sm text-gray-600 cursor-help" 
              title="All examples show the same high-level pattern (Key→Door) but with different positions, teaching generalization">
          {trainingEpisodes.length} optimal examples
        </span>
      </div>

      {/* Training examples in single row with horizontal scroll if needed */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-1 h-full items-center px-1">
          {trainingEpisodes.map((episode, index) => 
            renderMiniEpisode(episode, index)
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDataPanel;