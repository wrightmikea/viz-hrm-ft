import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_VERSION = '1.0.0';

const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        
        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4"
        >
          <h2 className="text-xl font-bold mb-4">About HRM Training Visualization</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Version:</span> {APP_VERSION}
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📝 Description</h3>
              <p className="text-sm text-gray-600">
                An interactive visualization tool for understanding how Hierarchical Reasoning Models (HRM) 
                learn to solve tasks through hierarchical decomposition. Watch as an AI learns to solve 
                a simple key-door puzzle by breaking it down into sub-goals.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">💻 Source Code</h3>
              <a
                href="https://github.com/wrightmikea/viz-hrm-ft"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline mb-2"
              >
                github.com/wrightmikea/viz-hrm-ft
              </a>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">⚖️ License</h3>
              <p className="text-sm text-gray-600">
                MIT License - Free to use, modify, and distribute
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Copyright © 2025 Mike Wright
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🛠️ Built With</h3>
              <p className="text-sm text-gray-600">
                React, TypeScript, Vite, Framer Motion, Tailwind CSS, Zustand
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AboutDialog;