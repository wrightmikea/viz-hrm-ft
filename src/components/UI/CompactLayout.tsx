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

          {/* Three Column Layout */}
          <div className="flex-1 grid grid-cols-[1fr,1.5fr,1.5fr] gap-1 min-h-0">
            {/* Left: Model Status */}
            <div className="bg-white rounded shadow p-1 overflow-auto">
              <h3 className="text-xs font-bold mb-1">AI Model Status</h3>
              <div className="space-y-1 text-xs">
                <div>
                  <div className="flex justify-between items-center" 
                       title="Planner accuracy: How well the AI decides what to do next (get key first, then door)">
                    <span>🧠 Planner:</span>
                    <span className="font-mono">{Math.round(modelAccuracy.planner)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5" 
                       title={`Planner is ${Math.round(modelAccuracy.planner)}% accurate at choosing correct goals`}>
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.planner}%` }}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between items-center"
                       title="Doer accuracy: How well the AI executes actions (move, pick up, open)">
                    <span>🤖 Doer:</span>
                    <span className="font-mono">{Math.round(modelAccuracy.doer)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5"
                       title={`Doer is ${Math.round(modelAccuracy.doer)}% accurate at executing the right actions`}>
                    <motion.div
                      className="bg-green-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.doer}%` }}
                    />
                  </div>
                </div>
                
                <div title="Agent's memory state - tracks if key has been picked up">
                  <div className="flex justify-between">
                    <span>💾 Memory:</span>
                    <span className="font-mono text-xs">
                      {currentState.hasKey ? 'has_key ✓' : 'no_key ✗'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center: AI Thoughts */}
            <div className="bg-white rounded shadow p-1 overflow-auto">
              <h3 className="text-xs font-bold mb-1">AI Thinking</h3>
              <LiveThoughts />
            </div>

            {/* Right: Controls */}
            <div className="bg-white rounded shadow p-1 overflow-auto">
              {!showTutorial && (
                <>
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold">Controls</h3>
                    <button
                      onClick={() => setShowHelp(!showHelp)}
                      className="px-1 py-0.5 text-[10px] bg-yellow-500 text-white rounded hover:bg-yellow-600"
                      title="Show/hide workflow help"
                    >
                      {showHelp ? 'Hide' : 'Help'}
                    </button>
                  </div>
                  
                  {showHelp && (
                    <div className="mb-1 p-1 bg-yellow-50 rounded text-[10px] space-y-0.5">
                      <p className="font-semibold text-yellow-900">Workflow:</p>
                      <ol className="space-y-0.5 text-yellow-800 ml-1 text-[10px]">
                        <li>1. Reset</li>
                        <li>2. Pre-test</li>
                        <li>3. Gen data</li>
                        <li>4. Train</li>
                        <li>5. Post-test</li>
                      </ol>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-0.5">
                    <button
                      onClick={() => { resetModel(); resetGame(); }}
                      className="px-1 py-0.5 bg-gray-500 text-white rounded text-[10px] hover:bg-gray-600"
                      title="Reset everything - Clear AI model and game state to start fresh"
                    >
                      1. Reset
                    </button>
                    <button
                      onClick={() => runEpisode(generateEpisode(false))}
                      className="px-1 py-0.5 bg-red-500 text-white rounded text-[10px] hover:bg-red-600"
                      title="Pre-training test - See how the untrained AI performs (expect random behavior)"
                    >
                      2. Pre
                    </button>
                    <button
                      onClick={generateTrainingData}
                      className="px-1 py-0.5 bg-purple-500 text-white rounded text-[10px] hover:bg-purple-600"
                      title="Generate training data - Create 10 optimal examples showing the correct solution"
                    >
                      3. Data
                    </button>
                    <button
                      onClick={() => trainModel(5)}
                      className="px-1 py-0.5 bg-green-500 text-white rounded text-[10px] hover:bg-green-600"
                      title="Train the AI - Learn from the generated examples (5 training epochs)"
                    >
                      4. Train
                    </button>
                    <button
                      onClick={() => runEpisode(generateEpisode(true))}
                      className="px-1 py-0.5 bg-blue-500 text-white rounded text-[10px] hover:bg-blue-600 col-span-2"
                      title="Post-training test - See how the trained AI performs (expect smart behavior)"
                    >
                      5. Post-Training Test
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Bottom: Training Data (only when appropriate in tutorial or free mode) */}
          {trainingEpisodes.length > 0 && (_tutorialStep >= 3 || !showTutorial) && (
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