import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/gameStore';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  action: string;
  emoji: string;
  enabledControls: string[];
  highlightComponents: string[];
  onAction?: () => void;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 'intro',
    title: 'Welcome to HRM Training!',
    description: 'This tutorial will show you how a Hierarchical Reasoning Model learns to solve tasks. The goal: Agent must pick up the key 🔑 then open the door 🚪',
    action: 'Start Tutorial',
    emoji: '👋',
    enabledControls: [],
    highlightComponents: ['world']
  },
  {
    id: 'before-training',
    title: 'Untrained Model Behavior',
    description: 'Watch the untrained model attempt the task. It will make random moves and likely fail or take many steps to complete.',
    action: 'Run Untrained Model',
    emoji: '🤷',
    enabledControls: ['play', 'speed'],
    highlightComponents: ['world', 'hierarchy']
  },
  {
    id: 'generate-data',
    title: 'Generate Training Data',
    description: 'Create a small dataset of optimal solutions for the model to learn from. Adjust the dataset size if desired.',
    action: 'Generate Data',
    emoji: '📚',
    enabledControls: ['datasetSize', 'generateData'],
    highlightComponents: ['config']
  },
  {
    id: 'training',
    title: 'Train the Model',
    description: 'Watch as the model learns from the training data. The planner learns to select correct sub-goals, and the doer learns to execute the right actions.',
    action: 'Start Training',
    emoji: '🎓',
    enabledControls: ['speed'],
    highlightComponents: ['hierarchy', 'progress']
  },
  {
    id: 'after-training',
    title: 'Trained Model Performance',
    description: 'See how the trained model now solves the task efficiently in the minimum number of steps.',
    action: 'Run Trained Model',
    emoji: '🎯',
    enabledControls: ['play', 'speed', 'reset'],
    highlightComponents: ['world', 'hierarchy']
  },
  {
    id: 'experiment',
    title: 'Experiment & Compare',
    description: 'Try ablation studies: disable hierarchy, freeze components, or adjust parameters to understand their impact.',
    action: 'Free Exploration',
    emoji: '🔬',
    enabledControls: ['all'],
    highlightComponents: []
  }
];

interface TutorialWizardProps {
  currentStep: number;
  onStepChange: (step: number) => void;
}

const TutorialWizard: React.FC<TutorialWizardProps> = ({ currentStep, onStepChange }) => {
  const {
    generateEpisode,
    runEpisode,
    trainModel,
    generateTrainingData,
    resetGame,
    resetModel,
    setPhase
  } = useSimulationStore();

  const step = tutorialSteps[currentStep];

  const handleAction = async () => {
    switch (step.id) {
      case 'intro':
        onStepChange(1);
        break;
      
      case 'before-training':
        setPhase('beforeTraining');
        resetModel();
        resetGame();
        const untrainedEpisode = generateEpisode(false);
        await runEpisode(untrainedEpisode);
        setTimeout(() => onStepChange(2), 2000);
        break;
      
      case 'generate-data':
        setPhase('trainingData');
        generateTrainingData();
        setTimeout(() => onStepChange(3), 1000);
        break;
      
      case 'training':
        setPhase('training');
        await trainModel(5);
        setTimeout(() => onStepChange(4), 1000);
        break;
      
      case 'after-training':
        setPhase('afterTraining');
        resetGame();
        const trainedEpisode = generateEpisode(true);
        await runEpisode(trainedEpisode);
        setTimeout(() => onStepChange(5), 2000);
        break;
      
      case 'experiment':
        setPhase('comparison');
        break;
    }
  };

  const canGoBack = currentStep > 0;
  const canGoNext = currentStep < tutorialSteps.length - 1;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-lg p-6 mb-4">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Tutorial Progress</span>
          <span className="text-sm text-gray-500">
            Step {currentStep + 1} of {tutorialSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <div className="text-5xl mb-4">{step.emoji}</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{step.title}</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">{step.description}</p>
          
          {/* Action Button */}
          <motion.button
            onClick={handleAction}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {step.action}
          </motion.button>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6">
        <motion.button
          onClick={() => canGoBack && onStepChange(currentStep - 1)}
          className={`px-4 py-2 rounded-lg font-medium ${
            canGoBack 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={canGoBack ? { scale: 1.05 } : {}}
          whileTap={canGoBack ? { scale: 0.95 } : {}}
          disabled={!canGoBack}
        >
          ← Previous
        </motion.button>

        {/* Step Indicators */}
        <div className="flex space-x-2">
          {tutorialSteps.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => onStepChange(index)}
              className={`w-2 h-2 rounded-full ${
                index === currentStep 
                  ? 'bg-blue-500' 
                  : index < currentStep 
                  ? 'bg-blue-300' 
                  : 'bg-gray-300'
              }`}
              whileHover={{ scale: 1.5 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => canGoNext && onStepChange(currentStep + 1)}
          className={`px-4 py-2 rounded-lg font-medium ${
            canGoNext 
              ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
          whileHover={canGoNext ? { scale: 1.05 } : {}}
          whileTap={canGoNext ? { scale: 0.95 } : {}}
          disabled={!canGoNext}
        >
          Next →
        </motion.button>
      </div>
    </div>
  );
};

export default TutorialWizard;
export { tutorialSteps };