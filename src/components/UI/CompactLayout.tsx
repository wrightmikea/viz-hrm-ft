import React from 'react';
import { motion } from 'framer-motion';
import WideWorld from '../World/WideWorld';
import LiveThoughts from '../Hierarchy/LiveThoughts';
import TrainingDataPanel from '../Training/TrainingDataPanel';
import BeginnerWizard from '../Tutorial/BeginnerWizard';
import { useSimulationStore } from '../../store/gameStore';

interface CompactLayoutProps {
  showTutorial: boolean;
  currentTutorial: any;
  tutorialStep: number;
  totalSteps: number;
  onTutorialPrevious: () => void;
  onTutorialSkip: () => void;
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
  trainModel: (epochs: number) => void;
}

const CompactLayout: React.FC<CompactLayoutProps> = ({
  showTutorial,
  currentTutorial,
  tutorialStep: _tutorialStep,
  totalSteps,
  onTutorialPrevious,
  onTutorialSkip,
  showHelp,
  setShowHelp,
  trainModel
}) => {
  const { 
    generateTrainingData,
    generateEpisode,
    runEpisode,
    resetGame,
    resetModel,
    modelAccuracy,
    currentState,
    trainingEpisodes
  } = useSimulationStore();

  return (
    <>
      {/* Tutorial Wizard - Full width when visible */}
      {showTutorial && (
        <BeginnerWizard
          step={currentTutorial}
          totalSteps={totalSteps}
          onPrevious={onTutorialPrevious}
          onSkip={onTutorialSkip}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden p-1">
        <div className="h-full flex flex-col gap-1">
          {/* World View */}
          <div className="bg-white rounded shadow p-1">
            <WideWorld />
          </div>

          {/* Middle Section: 3 columns */}
          <div className="flex-1 grid grid-cols-3 gap-1 min-h-0">
            {/* Left: Model Status */}
            <div className="bg-white rounded shadow p-2 overflow-auto">
              <h3 className="text-xs font-bold mb-1">AI Model Status</h3>
              <div className="space-y-1 text-xs">
                <div title="Planner decides high-level goals (get key, then door)">
                  <div className="flex justify-between items-center">
                    <span>🧠 Planner:</span>
                    <span className="font-mono">{Math.round(modelAccuracy.planner)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.planner}%` }}
                    />
                  </div>
                </div>
                
                <div title="Doer executes low-level actions (move, pick, open)">
                  <div className="flex justify-between items-center">
                    <span>🤖 Doer:</span>
                    <span className="font-mono">{Math.round(modelAccuracy.doer)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-green-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.doer}%` }}
                    />
                  </div>
                </div>
                
                <div title="Agent's memory state - remembers if key is picked up">
                  <div className="flex justify-between">
                    <span>💾 Memory:</span>
                    <span className="font-mono">
                      {currentState.hasKey ? 'has_key ✓' : 'no_key ✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: AI Thoughts */}
            <div className="bg-white rounded shadow p-2 overflow-auto">
              <h3 className="text-xs font-bold mb-1">AI Thinking</h3>
              <LiveThoughts />
            </div>

            {/* Right: Controls */}
            <div className="bg-white rounded shadow p-2 overflow-auto">
              {!showTutorial && (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold">Controls</h3>
                    <button
                      onClick={() => setShowHelp(!showHelp)}
                      className="px-1 py-0.5 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      title="Show help and suggested workflow"
                    >
                      {showHelp ? 'Hide' : 'Help'}
                    </button>
                  </div>
                  
                  {showHelp && (
                    <div className="mb-2 p-1 bg-yellow-50 rounded text-xs space-y-0.5">
                      <p className="font-semibold text-yellow-900">Workflow:</p>
                      <ol className="space-y-0.5 text-yellow-800 ml-2 text-xs">
                        <li>1. Reset - Clear all</li>
                        <li>2. Pre - Test untrained</li>
                        <li>3. Data - Generate examples</li>
                        <li>4. Train - Learn from data</li>
                        <li>5. Post - Test trained</li>
                      </ol>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => { resetModel(); resetGame(); }}
                      className="px-1 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600"
                      title="Reset everything - Clear AI model and game state to start fresh"
                    >
                      1. Reset
                    </button>
                    <button
                      onClick={() => runEpisode(generateEpisode(false))}
                      className="px-1 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                      title="Pre-training test - See how the untrained AI performs (expect random behavior)"
                    >
                      2. Pre
                    </button>
                    <button
                      onClick={generateTrainingData}
                      className="px-1 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                      title="Generate training data - Create 10 optimal examples showing the correct solution"
                    >
                      3. Data
                    </button>
                    <button
                      onClick={() => trainModel(5)}
                      className="px-1 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      title="Train the AI - Learn from the generated examples (5 training epochs)"
                    >
                      4. Train
                    </button>
                    <button
                      onClick={() => runEpisode(generateEpisode(true))}
                      className="px-1 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 col-span-2"
                      title="Post-training test - See how the trained AI performs (expect smart behavior)"
                    >
                      5. Post-Training Test
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom: Training Data (only when we have episodes) */}
          {trainingEpisodes.length > 0 && (
            <div className="flex-shrink-0">
              <TrainingDataPanel />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompactLayout;