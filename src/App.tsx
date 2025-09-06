import { useEffect, useState } from 'react';
import { TutorialStep } from './components/Tutorial/BeginnerWizard';
import UnifiedLayout from './components/UI/UnifiedLayout';
import AnimatedTraining from './components/Training/AnimatedTraining';
import AboutDialog from './components/Dialogs/AboutDialog';
import ReferencesDialog from './components/Dialogs/ReferencesDialog';
import ChangeHistoryDialog from './components/Dialogs/ChangeHistoryDialog';
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
    pause,
    clearThoughts,
    trainingEpisodes
  } = useSimulationStore();

  const [tutorialStep, setTutorialStep] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showTrainingAnimation, setShowTrainingAnimation] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showReferencesDialog, setShowReferencesDialog] = useState(false);
  const [showChangeHistoryDialog, setShowChangeHistoryDialog] = useState(false);
  const [selectedExample, setSelectedExample] = useState<number | null>(null);

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
  
  // Get mode label for header
  const getModeLabel = () => {
    if (!showTutorial) return '🎮 Free Exploration Mode';
    if (tutorialStep === 0) return '📖 Introduction';
    if (tutorialStep === tutorialSteps.length - 1) return '🎯 Final Step';
    return `📚 Tutorial Step ${tutorialStep} of ${tutorialSteps.length - 1}`;
  };

  // Tutorial content for left panel
  const getTutorialContent = () => {
    if (!showTutorial) return null;
    
    return (
      <div className="h-full flex flex-col">
        {/* Progress dots */}
        <div className="flex justify-center space-x-1 mb-2">
          {tutorialSteps.map((_, idx) => (
            <div
              key={idx}
              className={`w-2 h-2 rounded-full ${
                idx === tutorialStep ? 'bg-blue-600' : 
                idx < tutorialStep ? 'bg-blue-400' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* Tutorial content */}
        <div className="flex-1">
          <h2 className="text-base font-bold mb-1">{currentTutorial.title}</h2>
          <p className="text-sm text-gray-700 mb-2">{currentTutorial.description}</p>
          <p className="text-sm text-blue-600 font-medium">👉 {currentTutorial.instruction}</p>
        </div>
        
        {/* Tutorial buttons */}
        <div className="flex space-x-2 mt-2">
          {tutorialStep > 0 && (
            <button
              onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
            >
              ← Back
            </button>
          )}
          <button
            onClick={currentTutorial.buttonAction}
            className="flex-1 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {currentTutorial.buttonText}
          </button>
          <button
            onClick={() => setShowTutorial(false)}
            className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    );
  };

  // Training animation content for training phase
  const getTrainingContent = () => {
    if (!showTrainingAnimation || tutorialStep !== 4) return null;
    
    return (
      <div className="h-full">
        <h3 className="text-sm font-bold mb-1">Model Learning</h3>
        <AnimatedTraining 
          onComplete={async () => {
            await trainModel(5);
            setShowTrainingAnimation(false);
            setSelectedExample(null);  // Clear selected example
            clearThoughts();  // Clear AI thinking
            setPhase('afterTraining');  // Change phase to stop showing "Learning from examples"
            setTutorialStep(5);
          }}
        />
      </div>
    );
  };

  // Unified layout for all screens
  return (
    <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
      {/* Header - Compact */}
      <header className="bg-white shadow-sm px-4 py-1 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-base font-bold">HRM Training Visualization</h1>
            <span className="text-sm text-gray-600">{getModeLabel()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReferencesDialog(true)}
              className="text-base text-gray-600 hover:text-gray-800"
            >
              References
            </button>
            <button
              onClick={() => setShowAboutDialog(true)}
              className="text-base text-gray-600 hover:text-gray-800"
            >
              About
            </button>
            {!showTutorial && (
              <button
                onClick={() => {
                  setShowTutorial(true);
                  setTutorialStep(0);
                }}
                className="text-base text-blue-600 hover:text-blue-800"
              >
                Restart Tutorial
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Unified Layout */}
      <UnifiedLayout
        leftPanelContent={getTutorialContent()}
        rightThirdColumnContent={getTrainingContent()}
        showTrainingData={(tutorialStep === 3 || tutorialStep === 4) && showTutorial ? true : (!showTutorial && trainingEpisodes.length > 0)}
        isFreePlay={!showTutorial}
        trainModel={trainModel}
        selectedExample={selectedExample}
        setSelectedExample={setSelectedExample}
      />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white px-4 py-1 text-sm flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            © 2025 Michael A. Wright | MIT License
          </div>
          <button
            onClick={() => setShowChangeHistoryDialog(true)}
            className="text-gray-400 hover:text-white underline"
          >
            Change History
          </button>
        </div>
      </footer>
      
      {/* Dialogs */}
      <AboutDialog 
        isOpen={showAboutDialog} 
        onClose={() => setShowAboutDialog(false)} 
      />
      <ReferencesDialog 
        isOpen={showReferencesDialog} 
        onClose={() => setShowReferencesDialog(false)} 
      />
      <ChangeHistoryDialog
        isOpen={showChangeHistoryDialog}
        onClose={() => setShowChangeHistoryDialog(false)}
      />
    </div>
  );
}

export default App;