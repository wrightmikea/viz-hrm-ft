import React from 'react';
import { motion } from 'framer-motion';
import WideWorld from '../World/WideWorld';
import LiveThoughts from '../Hierarchy/LiveThoughts';
import TrainingDataPanel from '../Training/TrainingDataPanel';
import AnimatedTraining from '../Training/AnimatedTraining';
import { useSimulationStore } from '../../store/gameStore';

interface UnifiedLayoutProps {
  // Left panel content (tutorial/instructions)
  leftPanelContent?: React.ReactNode;
  
  // Right panel third column content (for training animation, controls, etc)
  rightThirdColumnContent?: React.ReactNode;
  
  // Whether to show training data at bottom
  showTrainingData?: boolean;
  
  // Whether we're in free play mode
  isFreePlay?: boolean;
  
  // Training model function for free play controls
  trainModel?: (epochs: number) => void;
  
  // Selected example state
  selectedExample?: number | null;
  setSelectedExample?: (index: number | null) => void;
}

const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  leftPanelContent,
  rightThirdColumnContent,
  showTrainingData = false,
  isFreePlay = false,
  trainModel,
  selectedExample: propSelectedExample,
  setSelectedExample: propSetSelectedExample
}) => {
  const { 
    generateTrainingData,
    generateEpisode,
    runEpisode,
    resetGame,
    resetModel,
    modelAccuracy,
    currentState,
    trainingEpisodes,
    pause,
    setPhase
  } = useSimulationStore();

  const [showHelp, setShowHelp] = React.useState(false);
  const [showTrainingAnimation, setShowTrainingAnimation] = React.useState(false);
  
  // Use prop values if provided, otherwise maintain local state (for free play)
  const [localSelectedExample, setLocalSelectedExample] = React.useState<number | null>(null);
  const selectedExample = propSelectedExample !== undefined ? propSelectedExample : localSelectedExample;
  const setSelectedExample = propSetSelectedExample || setLocalSelectedExample;

  // Free play controls for left panel
  const freePlayLeftContent = isFreePlay && trainModel ? (
    <div className="h-full flex flex-col overflow-auto">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-bold">Controls</h3>
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="px-1 py-0.5 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
          title="Show/hide workflow help"
        >
          {showHelp ? 'Hide' : 'Help'}
        </button>
      </div>
      
      {showHelp && (
        <div className="mb-2 p-2 bg-yellow-50 rounded text-xs space-y-1">
          <p className="font-semibold text-yellow-900">Recommended Workflow:</p>
          <ol className="space-y-1 text-yellow-800 ml-2">
            <li>1. Reset to clear everything</li>
            <li>2. Run Pre-Training Test (see poor performance)</li>
            <li>3. Generate training data (10 examples)</li>
            <li>4. Train the model (watch it learn)</li>
            <li>5. Run Post-Training Test (see improvement!)</li>
          </ol>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <button
          onClick={() => { 
            pause();  // Stop any running episode
            resetModel(); 
            resetGame();
            setSelectedExample(null);
          }}
          className="px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 text-left"
          title="Clear everything and start over. Resets both the AI model (untrained state) and the game."
        >
          1. Reset All
        </button>
        <button
          onClick={() => {
            pause();  // Stop any running episode
            resetGame();
            runEpisode(generateEpisode(false));
          }}
          className="px-3 py-2 bg-red-500 text-white rounded text-sm hover:bg-red-600 text-left"
          title="Test the UNTRAINED AI. It will perform randomly and poorly (30-40 steps or fail)."
        >
          2. Pre-Training Test
        </button>
        <button
          onClick={() => {
            pause();  // Stop any running episode
            generateTrainingData();
          }}
          className="px-3 py-2 bg-purple-500 text-white rounded text-sm hover:bg-purple-600 text-left"
          title="Generate 10 optimal training examples with different starting positions to teach the AI."
        >
          3. Generate Training Data
        </button>
        <button
          onClick={() => {
            pause();  // Stop any running episode
            setShowTrainingAnimation(true);
          }}
          className="px-3 py-2 bg-green-500 text-white rounded text-sm hover:bg-green-600 text-left"
          title="Train the AI on the examples. The model will study each example and learn the patterns."
        >
          4. Train Model (5 epochs)
        </button>
        <button
          onClick={() => {
            pause();  // Stop any running episode
            setSelectedExample(null);  // Clear selected example
            resetGame();
            runEpisode(generateEpisode(true));
          }}
          className="px-3 py-2 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 text-left"
          title="Test the TRAINED AI. It should now solve efficiently (8-10 steps)."
        >
          5. Post-Training Test
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className="flex-1 overflow-hidden p-1">
      <div className="h-full flex flex-col gap-1">
        {/* Top Row: 2 columns - Left for instructions, Right for world */}
        <div className="grid grid-cols-2 gap-1" style={{ height: '40%' }}>
          {/* Left: Current View Description/Instructions or Controls in Free Play */}
          <div className="bg-white rounded shadow p-2 overflow-auto">
            {leftPanelContent || freePlayLeftContent || (
              <div className="text-center text-gray-400 text-sm">
                Tutorial content will appear here
              </div>
            )}
          </div>
          
          {/* Right: World Grid */}
          <div className="bg-white rounded shadow p-1">
            <WideWorld />
          </div>
        </div>

        {/* Middle and Bottom Section - Grid Container */}
        <div className="flex-1 grid grid-cols-3 gap-1" style={{ 
          gridTemplateRows: showTrainingData && trainingEpisodes.length > 0 ? '1fr auto' : '1fr',
          maxHeight: showTrainingData && trainingEpisodes.length > 0 ? 'calc(60% - 8px)' : '60%'
        }}>
          {/* Column 1: Model Info */}
          <div className="bg-white rounded shadow p-1 overflow-auto" style={{ minHeight: 0 }}>
            <h3 className="text-xs font-bold mb-1" title="Current state of the AI model components">Model Info</h3>
            <div className="space-y-1 text-xs">
              <div>
                <div className="flex justify-between items-center">
                  <span className="cursor-help" title="Planner: The high-level decision maker that learns 'Get key BEFORE door'">🧠 Planner:</span>
                  <span className="font-mono cursor-help" title={`Current accuracy: ${Math.round(modelAccuracy.planner)}% - How often it chooses the correct goal sequence`}>{Math.round(modelAccuracy.planner)}%</span>
                </div>
                <div className="relative group">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-blue-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.planner}%` }}
                    />
                  </div>
                  <div className="absolute -top-8 left-0 w-full bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                    Planner learns the goal sequence: Key→Door. Currently {Math.round(modelAccuracy.planner)}% accurate.
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center">
                  <span className="cursor-help" title="Doer: The action executor that learns HOW to reach each goal">🤖 Doer:</span>
                  <span className="font-mono cursor-help" title={`Current accuracy: ${Math.round(modelAccuracy.doer)}% - How often it takes the correct action`}>{Math.round(modelAccuracy.doer)}%</span>
                </div>
                <div className="relative group">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <motion.div
                      className="bg-green-500 h-1.5 rounded-full"
                      animate={{ width: `${modelAccuracy.doer}%` }}
                    />
                  </div>
                  <div className="absolute -top-8 left-0 w-full bg-gray-900 text-white text-[10px] p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none z-10">
                    Doer learns actions: move, pick, open. Currently {Math.round(modelAccuracy.doer)}% accurate.
                  </div>
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

          {/* Column 2: Selected Example Details */}
          <div className="bg-white rounded shadow p-1 overflow-auto" style={{ minHeight: 0 }}>
            {selectedExample !== null && trainingEpisodes[selectedExample] ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="text-xs font-bold">Example #{selectedExample + 1} Details</h3>
                  <button 
                    onClick={() => setSelectedExample(null)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                    title="Close example details"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs space-y-2 flex-1 overflow-auto">
                  <div className="p-1 bg-blue-50 rounded cursor-help" 
                       title="Initial State: The starting positions for this training example. The PLANNER learns from seeing that despite different positions, the solution always follows the same pattern.">
                    <span className="font-semibold cursor-help" 
                          title="Starting configuration - Planner notices key is always needed before door">Initial State:</span>
                    <div className="ml-2 text-[10px]">
                      <span className="cursor-help" title="The AI agent starts at this position">🧍 Agent at position {trainingEpisodes[selectedExample].states[0].agentPos}</span><br/>
                      <span className="cursor-help" title="The key that must be picked up first - PLANNER learns this is always first goal">🔑 Key at position {trainingEpisodes[selectedExample].states[0].keyPos}</span><br/>
                      <span className="cursor-help" title="The door that can only be opened after getting the key - PLANNER learns this is always second goal">🚪 Door at position {trainingEpisodes[selectedExample].states[0].doorPos}</span>
                    </div>
                  </div>
                  <div className="p-1 bg-indigo-50 rounded cursor-help" 
                       title="What the PLANNER learns: Across ALL examples, the high-level pattern is ALWAYS the same: Go to Key first, then Go to Door. This teaches the hierarchical goal sequence.">
                    <span className="font-semibold cursor-help" 
                          title="The high-level goal sequence that the Planner learns">🧠 Planner Pattern:</span><br/>
                    <span className="text-[10px]">1. GoToKey → 2. PickKey → 3. GoToDoor → 4. OpenDoor</span>
                  </div>
                  <div className="p-1 bg-green-50 rounded cursor-help" 
                       title={`What the DOER learns: The specific ${trainingEpisodes[selectedExample].actions.length} low-level actions needed to execute the Planner's goals.`}>
                    <span className="font-semibold cursor-help" 
                          title="Number of low-level actions the Doer must execute">🤖 Doer Steps:</span> {trainingEpisodes[selectedExample].actions.length}
                  </div>
                  <div className="p-1 bg-yellow-50 rounded cursor-help" 
                       title="Path: Shows movement through positions. Notice it ALWAYS goes Agent→Key→Door, teaching the Planner this universal pattern.">
                    <span className="font-semibold cursor-help" 
                          title="The positions visited - demonstrates the Key-before-Door pattern">Path (proves pattern):</span><br/>
                    <span className="text-[10px]">{trainingEpisodes[selectedExample].states.map(s => s.agentPos).join(' → ')}</span>
                  </div>
                  <div className="p-1 bg-purple-50 rounded cursor-help" 
                       title="Actions: The DOER learns these specific movements. While positions change between examples, the Doer learns general movement strategies.">
                    <span className="font-semibold cursor-help" 
                          title="The low-level commands that the Doer learns to execute">Doer Actions:</span><br/>
                    <span className="text-[10px]">{trainingEpisodes[selectedExample].actions.join(', ')}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Column 3: AI Thinking or Model Learning */}
          <div className="bg-white rounded shadow p-1 overflow-auto" style={{ minHeight: 0 }}>
            {rightThirdColumnContent || (
              showTrainingAnimation && isFreePlay ? (
                <div className="h-full">
                  <h3 className="text-xs font-bold mb-1">Model Learning</h3>
                  <AnimatedTraining 
                    onComplete={async () => {
                      if (trainModel) await trainModel(5);
                      setShowTrainingAnimation(false);
                      setSelectedExample(null);
                      setPhase('afterTraining');  // Clear "Learning from examples" message
                    }}
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xs font-bold mb-1">AI "Thinking"</h3>
                  <LiveThoughts />
                </>
              )
            )}
          </div>
          
          {/* Bottom Row: Training Examples - Only under first 2 columns */}
          {showTrainingData && trainingEpisodes.length > 0 && (
            <div className="col-span-2" style={{ height: '120px' }}>
              <TrainingDataPanel onExampleClick={setSelectedExample} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnifiedLayout;