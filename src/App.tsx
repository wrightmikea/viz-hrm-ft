import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import BeginnerWizard, { TutorialStep } from './components/Tutorial/BeginnerWizard';
import WideWorld from './components/World/WideWorld';
import LiveThoughts from './components/Hierarchy/LiveThoughts';
import TrainingDataPanel from './components/Training/TrainingDataPanel';
import AnimatedTraining from './components/Training/AnimatedTraining';
import { useSimulationStore } from './store/gameStore';
import './styles/globals.css';

function App() {
  const { 
    generateTrainingData,
    generateEpisode,
    runEpisode,
    trainModel,
    resetGame,
    resetModel,
    setPhase,
    modelAccuracy,
    currentState,
    pause
  } = useSimulationStore();

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showTrainingAnimation, setShowTrainingAnimation] = useState(false);

  useEffect(() => {
    // Initialize game
    resetGame();
    resetModel();
  }, []);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 'intro',
      number: 0,
      title: 'Welcome! Let\'s Learn About AI Training',
      description: 'We\'ll teach an AI to solve a simple puzzle using hierarchical reasoning.',
      instruction: 'The goal: Get the key 🔑, then open the door 🚪. Sounds simple, right?',
      buttonText: 'Start Learning!',
      buttonAction: () => setTutorialStep(1),
      highlight: []
    },
    {
      id: 'rules',
      number: 1,
      title: 'The Rules of the Game',
      description: 'The agent 🧍 can move left/right, pick up the key, and open the door.',
      instruction: 'But here\'s the catch: The AI doesn\'t know the rules yet! It must learn them.',
      buttonText: 'See Untrained AI',
      buttonAction: () => {
        setPhase('beforeTraining');
        resetModel();
        const episode = generateEpisode(false);
        runEpisode(episode);
        setTutorialStep(2);
      },
      highlight: ['world']
    },
    {
      id: 'observe',
      number: 2,
      title: 'Watch the Untrained AI Struggle',
      description: 'The AI is moving randomly because it hasn\'t learned what to do.',
      instruction: 'Notice how it wanders aimlessly and takes many steps (or fails completely).',
      buttonText: 'Continue',
      buttonAction: () => {
        pause();
        setTutorialStep(3);
      },
      highlight: ['thoughts']
    },
    {
      id: 'prepare',
      number: 3,
      title: 'Time to Train the AI',
      description: 'First, we need training examples showing the correct solution.',
      instruction: 'Click to generate 10 examples of the optimal path: Agent → Key → Door',
      buttonText: 'Generate Training Data',
      buttonAction: () => {
        generateTrainingData();
        setTutorialStep(4);
      },
      highlight: ['data']
    },
    {
      id: 'train',
      number: 4,
      title: 'Watch the AI Learn',
      description: 'The AI will study each example, starting slowly then speeding up.',
      instruction: 'Watch how the Planner learns "what to do" and the Doer learns "how to do it".',
      buttonText: 'Start Training',
      buttonAction: () => {
        setShowTrainingAnimation(true);
        setPhase('training');
      },
      highlight: ['training']
    },
    {
      id: 'test',
      number: 5,
      title: 'Test the Trained AI',
      description: 'Now the AI knows what to do! Watch it solve efficiently.',
      instruction: 'Compare the steps taken: untrained (30-40 steps) vs trained (8-10 steps).',
      buttonText: 'Run Trained AI',
      buttonAction: () => {
        setPhase('afterTraining');
        resetGame();
        const episode = generateEpisode(true);
        runEpisode(episode);
        setTutorialStep(6);
      },
      highlight: ['world', 'thoughts']
    },
    {
      id: 'explore',
      number: 6,
      title: 'Congratulations! You\'ve Trained an AI',
      description: 'You can now experiment freely with the controls.',
      instruction: 'Try resetting the model to see the difference, or adjust training parameters.',
      buttonText: 'Free Exploration',
      buttonAction: () => {
        setShowTutorial(false);
        setPhase('comparison');
      },
      highlight: []
    }
  ];

  const currentTutorial = tutorialSteps[tutorialStep];

  // Special layout for training phase
  if (showTrainingAnimation && tutorialStep === 4) {
    return (
      <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm px-4 py-2 flex-shrink-0">
          <h1 className="text-lg font-bold">HRM Training Visualization</h1>
        </header>

        {/* Tutorial Wizard */}
        <BeginnerWizard
          step={currentTutorial}
          totalSteps={tutorialSteps.length}
          onPrevious={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
          onSkip={() => setShowTutorial(false)}
        />

        {/* Training Layout - Horizontal */}
        <div className="flex-1 p-2 overflow-hidden">
          <div className="h-full grid grid-cols-2 gap-2">
            {/* Left: Animated Training */}
            <div className="overflow-auto">
              <AnimatedTraining 
                onComplete={async () => {
                  await trainModel(5);
                  setShowTrainingAnimation(false);
                  setTutorialStep(5);
                }}
              />
            </div>

            {/* Right: Live Model Status */}
            <div className="overflow-auto space-y-2">
              {/* Model Status Card */}
              <div className="bg-white rounded-lg shadow p-3">
                <h3 className="text-sm font-bold mb-2">AI Model Learning</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">🧠 Planner (decides goals):</span>
                      <span className="text-xs font-mono">{Math.round(modelAccuracy.planner)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-blue-500 h-2 rounded-full"
                        animate={{ width: `${modelAccuracy.planner}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Learning: "Get key first, then go to door"
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">🤖 Doer (executes actions):</span>
                      <span className="text-xs font-mono">{Math.round(modelAccuracy.doer)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        animate={{ width: `${modelAccuracy.doer}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      Learning: "How to navigate to targets"
                    </p>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="bg-yellow-50 rounded-lg p-3">
                <h3 className="text-sm font-bold text-yellow-900 mb-2">🔍 What's Happening?</h3>
                <div className="space-y-2 text-xs text-yellow-800">
                  <p>• Each example shows the optimal solution path</p>
                  <p>• The Planner learns the sequence: Key → Door</p>
                  <p>• The Doer learns which actions achieve each goal</p>
                  <p>• Speed increases as patterns become clear</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal layout for other phases
  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header - Minimal */}
      <header className="bg-white shadow-sm px-4 py-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold">HRM Training Visualization</h1>
          {!showTutorial && (
            <button
              onClick={() => {
                setShowTutorial(true);
                setTutorialStep(0);
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Restart Tutorial
            </button>
          )}
        </div>
      </header>

      {/* Tutorial Wizard */}
      {showTutorial && (
        <BeginnerWizard
          step={currentTutorial}
          totalSteps={tutorialSteps.length}
          onPrevious={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
          onSkip={() => setShowTutorial(false)}
        />
      )}

      {/* Main Content - Compact Layout */}
      <div className="flex-1 overflow-hidden p-2">
        <div className="h-full flex flex-col space-y-2">
          {/* World and Status */}
          <div className={`${currentTutorial.highlight?.includes('world') ? 'ring-4 ring-blue-400 rounded-lg' : ''}`}>
            <WideWorld />
          </div>

          {/* Two Column Layout */}
          <div className="flex-1 grid grid-cols-2 gap-2 min-h-0">
            {/* Left: Model Status */}
            <div className="flex flex-col space-y-2 overflow-auto">
              {/* Model Status */}
              <div className="bg-white rounded-lg shadow p-2">
                <h3 className="text-sm font-bold mb-2">AI Model Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">🧠 Planner (decides goals):</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-blue-500 h-2 rounded-full"
                          animate={{ width: `${modelAccuracy.planner}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{Math.round(modelAccuracy.planner)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">🤖 Doer (executes actions):</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="bg-green-500 h-2 rounded-full"
                          animate={{ width: `${modelAccuracy.doer}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono">{Math.round(modelAccuracy.doer)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>💾 Memory:</span>
                    <span className="font-mono">{currentState.hasKey ? 'has_key=true' : 'has_key=false'}</span>
                  </div>
                </div>
              </div>

              {/* Training Data - show when we have training episodes */}
              {(tutorialStep >= 3 || !showTutorial) && (
                <div className={`${currentTutorial.highlight?.includes('data') ? 'ring-4 ring-blue-400 rounded-lg' : ''}`}>
                  <TrainingDataPanel />
                </div>
              )}
            </div>

            {/* Right: AI Thoughts & Controls */}
            <div className="flex flex-col space-y-2 overflow-auto">
              {/* Live Thoughts */}
              <div className={`bg-white rounded-lg shadow p-2 ${
                currentTutorial.highlight?.includes('thoughts') ? 'ring-4 ring-blue-400' : ''
              }`}>
                <h3 className="text-sm font-bold mb-2">AI Thinking Process</h3>
                <LiveThoughts />
              </div>

              {/* Controls */}
              {!showTutorial && (
                <div className="bg-white rounded-lg shadow p-2">
                  <h3 className="text-sm font-bold mb-2">Controls</h3>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          resetModel();
                          resetGame();
                        }}
                        className="flex-1 px-2 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600"
                      >
                        Reset All
                      </button>
                      <button
                        onClick={() => {
                          const episode = generateEpisode(modelAccuracy.planner > 50);
                          runEpisode(episode);
                        }}
                        className="flex-1 px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                      >
                        Run Test
                      </button>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={generateTrainingData}
                        className="flex-1 px-2 py-1 bg-purple-500 text-white rounded text-sm hover:bg-purple-600"
                      >
                        Generate Data
                      </button>
                      <button
                        onClick={() => {
                          setShowTrainingAnimation(true);
                          setPhase('training');
                        }}
                        className="flex-1 px-2 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                      >
                        Train Model
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;