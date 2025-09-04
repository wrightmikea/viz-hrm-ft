import React from 'react';
import { motion } from 'framer-motion';

export interface TutorialStep {
  id: string;
  number: number;
  title: string;
  description: string;
  instruction: string;
  buttonText: string;
  buttonAction: () => void;
  highlight?: string[];
}

interface BeginnerWizardProps {
  step: TutorialStep;
  totalSteps: number;
  onPrevious: () => void;
  onSkip: () => void;
}

const BeginnerWizard: React.FC<BeginnerWizardProps> = ({ 
  step, 
  totalSteps, 
  onPrevious,
  onSkip 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 shadow-lg">
      <div className="max-w-6xl mx-auto">
        {/* Progress dots */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < step.number ? 'bg-white' :
                i === step.number ? 'bg-white w-8' :
                'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="text-center">
          <h2 className="text-xl font-bold mb-1">{step.title}</h2>
          <p className="text-sm opacity-90 mb-2">{step.description}</p>
          
          {/* Action instruction box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/20 backdrop-blur rounded-lg p-2 mb-2 inline-block"
          >
            <p className="text-sm font-medium">
              👉 {step.instruction}
            </p>
          </motion.div>

          {/* Action buttons */}
          <div className="flex items-center justify-center space-x-2">
            {step.number > 0 && (
              <button
                onClick={onPrevious}
                className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30"
              >
                ← Back
              </button>
            )}
            
            <motion.button
              onClick={step.buttonAction}
              className="px-6 py-2 bg-white text-blue-600 rounded-lg font-bold hover:bg-blue-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.buttonText}
            </motion.button>

            <button
              onClick={onSkip}
              className="px-3 py-1 text-sm bg-white/20 rounded hover:bg-white/30"
            >
              Skip Tutorial
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeginnerWizard;