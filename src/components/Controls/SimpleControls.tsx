import React from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

interface SimpleControlsProps {
  enabled: boolean;
  mode: 'train' | 'test' | 'explore';
}

const SimpleControls: React.FC<SimpleControlsProps> = ({ enabled, mode }) => {
  const {
    isPlaying,
    speed,
    play,
    pause,
    setSpeed,
    resetGame,
    resetModel,
    generateEpisode,
    runEpisode,
    trainModel,
    generateTrainingData,
    datasetSize,
    setDatasetSize,
    hierarchyEnabled,
    toggleHierarchy
  } = useSimulationStore();

  const handleRunEpisode = async () => {
    const useTrainedModel = mode === 'test' || mode === 'explore';
    const episode = generateEpisode(useTrainedModel);
    await runEpisode(episode);
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-3 ${!enabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {mode === 'train' && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Training Setup</span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Dataset Size:</span>
              <input
                type="range"
                min="5"
                max="20"
                value={datasetSize}
                onChange={(e) => setDatasetSize(Number(e.target.value))}
                className="w-20 h-1 rounded"
              />
              <span className="text-xs font-mono">{datasetSize}</span>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <motion.button
              onClick={generateTrainingData}
              className="flex-1 px-3 py-1.5 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📊 Generate Data
            </motion.button>
            
            <motion.button
              onClick={() => trainModel(5)}
              className="flex-1 px-3 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🎓 Train Model
            </motion.button>
          </div>
        </div>
      )}

      {mode === 'test' && (
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <motion.button
              onClick={handleRunEpisode}
              className="px-4 py-1.5 bg-blue-500 text-white rounded text-sm font-medium hover:bg-blue-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ▶️ Run Test
            </motion.button>
            
            <motion.button
              onClick={() => resetGame()}
              className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Reset
            </motion.button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-600">Speed:</span>
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2 py-1 rounded text-xs font-medium ${
                  speed === s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}

      {mode === 'explore' && (
        <div className="space-y-2">
          <div className="flex space-x-2">
            <motion.button
              onClick={isPlaying ? pause : play}
              className="px-4 py-1.5 bg-green-500 text-white rounded text-sm font-medium hover:bg-green-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </motion.button>
            
            <motion.button
              onClick={() => resetGame()}
              className="px-3 py-1.5 bg-gray-500 text-white rounded text-sm font-medium hover:bg-gray-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔄 Reset Game
            </motion.button>
            
            <motion.button
              onClick={resetModel}
              className="px-3 py-1.5 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🧹 Reset Model
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={hierarchyEnabled}
                  onChange={toggleHierarchy}
                  className="rounded"
                />
                <span>Hierarchy</span>
              </label>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Speed:</span>
              {[0.5, 1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    speed === s ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleControls;