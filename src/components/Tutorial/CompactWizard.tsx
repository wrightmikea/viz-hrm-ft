import React from 'react';
import { motion } from 'framer-motion';

export interface WizardStep {
  id: string;
  title: string;
  instruction: string;
  action: () => void;
}

interface CompactWizardProps {
  steps: WizardStep[];
  currentStep: number;
  onStepChange: (step: number) => void;
}

const CompactWizard: React.FC<CompactWizardProps> = ({ steps, currentStep, onStepChange }) => {
  const current = steps[currentStep];
  
  return (
    <div className="bg-white border-b shadow-sm px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Step indicators */}
        <div className="flex items-center space-x-2">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => index <= currentStep && onStepChange(index)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                index === currentStep 
                  ? 'bg-blue-500 text-white scale-110 ring-2 ring-blue-300' 
                  : index < currentStep 
                  ? 'bg-green-500 text-white hover:scale-105' 
                  : 'bg-gray-300 text-gray-600'
              }`}
              disabled={index > currentStep}
            >
              {index < currentStep ? '✓' : index + 1}
            </button>
          ))}
        </div>

        {/* Current instruction */}
        <div className="flex-1 mx-4">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h3 className="text-sm font-semibold text-gray-800">{current.title}</h3>
            <p className="text-xs text-gray-600">{current.instruction}</p>
          </motion.div>
        </div>

        {/* Next button */}
        <motion.button
          onClick={current.action}
          className="px-4 py-1.5 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next →'}
        </motion.button>
      </div>
    </div>
  );
};

export default CompactWizard;