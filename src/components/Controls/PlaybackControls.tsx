import React from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore, AnimationPhase } from '../../store/gameStore';

const PlaybackControls: React.FC = () => {
  const {
    isPlaying,
    speed,
    phase,
    play,
    pause,
    setSpeed,
    setPhase,
    trainModel,
    generateEpisode,
    resetGame,
    resetModel,
    isTraining,
    trainingProgress
  } = useSimulationStore();

  const phases: { value: AnimationPhase; label: string; emoji: string }[] = [
    { value: 'intro', label: 'Introduction', emoji: '👋' },
    { value: 'beforeTraining', label: 'Before Training', emoji: '🤷' },
    { value: 'trainingData', label: 'Training Data', emoji: '📚' },
    { value: 'training', label: 'Training', emoji: '🎓' },
    { value: 'afterTraining', label: 'After Training', emoji: '🎯' },
    { value: 'generalization', label: 'Generalization', emoji: '🔄' },
    { value: 'comparison', label: 'Comparison', emoji: '⚖️' }
  ];

  const speeds = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' }
  ];

  const handlePhaseAction = async () => {
    switch (phase) {
      case 'beforeTraining':
        const beforeEpisode = generateEpisode(false);
        await useSimulationStore.getState().runEpisode(beforeEpisode);
        break;
      case 'training':
        await trainModel(5);
        break;
      case 'afterTraining':
        const afterEpisode = generateEpisode(true);
        await useSimulationStore.getState().runEpisode(afterEpisode);
        break;
      default:
        break;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Playback Controls</h2>
      
      {/* Phase Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Animation Phase
        </label>
        <div className="grid grid-cols-2 gap-2">
          {phases.map((p) => (
            <motion.button
              key={p.value}
              onClick={() => setPhase(p.value)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                phase === p.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="mr-1">{p.emoji}</span>
              {p.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Play/Pause and Action Buttons */}
      <div className="flex space-x-2">
        <motion.button
          onClick={isPlaying ? pause : play}
          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isPlaying ? '⏸️ Pause' : '▶️ Play'}
        </motion.button>
        
        <motion.button
          onClick={handlePhaseAction}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isTraining}
        >
          {phase === 'training' ? '🎓 Train' : '🚀 Run'}
        </motion.button>
      </div>

      {/* Speed Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Playback Speed
        </label>
        <div className="flex space-x-2">
          {speeds.map((s) => (
            <motion.button
              key={s.value}
              onClick={() => setSpeed(s.value)}
              className={`flex-1 px-3 py-1 rounded text-sm font-medium ${
                speed === s.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {s.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Training Progress */}
      {isTraining && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Training Progress
          </label>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${trainingProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{Math.round(trainingProgress)}% Complete</p>
        </div>
      )}

      {/* Reset Buttons */}
      <div className="flex space-x-2 pt-2 border-t">
        <motion.button
          onClick={() => resetGame()}
          className="flex-1 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🔄 Reset Game
        </motion.button>
        
        <motion.button
          onClick={resetModel}
          className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          🧹 Reset Model
        </motion.button>
      </div>
    </div>
  );
};

export default PlaybackControls;