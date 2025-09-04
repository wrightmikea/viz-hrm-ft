import React from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

const ConfigPanel: React.FC = () => {
  const {
    datasetSize,
    noiseLevel,
    hierarchyEnabled,
    plannerFrozen,
    doerFrozen,
    setDatasetSize,
    setNoiseLevel,
    toggleHierarchy,
    togglePlannerFreeze,
    toggleDoerFreeze,
    generateTrainingData
  } = useSimulationStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Configuration</h2>
      
      {/* Dataset Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Training Dataset Size: {datasetSize} episodes
        </label>
        <input
          type="range"
          min="5"
          max="20"
          value={datasetSize}
          onChange={(e) => setDatasetSize(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5</span>
          <span>20</span>
        </div>
      </div>

      {/* Noise Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Noise Level: {Math.round(noiseLevel * 100)}%
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={noiseLevel * 100}
          onChange={(e) => setNoiseLevel(Number(e.target.value) / 100)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>50%</span>
        </div>
      </div>

      {/* Generate Training Data Button */}
      <motion.button
        onClick={generateTrainingData}
        className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        📊 Generate Training Data
      </motion.button>

      {/* Ablation Controls */}
      <div className="space-y-3 pt-4 border-t">
        <h3 className="font-semibold text-gray-700">Ablation Studies</h3>
        
        <motion.div
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: '#f3f4f6' }}
        >
          <span className="text-sm font-medium">Hierarchy</span>
          <motion.button
            onClick={toggleHierarchy}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              hierarchyEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              animate={{ left: hierarchyEnabled ? '26px' : '2px' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: '#f3f4f6' }}
        >
          <span className="text-sm font-medium">Freeze Planner</span>
          <motion.button
            onClick={togglePlannerFreeze}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              plannerFrozen ? 'bg-red-500' : 'bg-gray-300'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              animate={{ left: plannerFrozen ? '26px' : '2px' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.button>
        </motion.div>

        <motion.div
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          whileHover={{ backgroundColor: '#f3f4f6' }}
        >
          <span className="text-sm font-medium">Freeze Doer</span>
          <motion.button
            onClick={toggleDoerFreeze}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              doerFrozen ? 'bg-red-500' : 'bg-gray-300'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
              animate={{ left: doerFrozen ? '26px' : '2px' }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Info Text */}
      <div className="text-xs text-gray-500 italic pt-2 border-t">
        💡 Tip: Use ablation controls to understand how each component contributes to the model's performance.
      </div>
    </div>
  );
};

export default ConfigPanel;