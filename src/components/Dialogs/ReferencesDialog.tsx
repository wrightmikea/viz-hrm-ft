import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReferencesDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReferencesDialog: React.FC<ReferencesDialogProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-bold mb-4">References</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">📚 Research & Code</h3>
              <a
                href="https://github.com/sapientinc/HRM"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline mb-2"
              >
                HRM (Hierarchical Reasoning Model) - GitHub
              </a>
              <p className="text-sm text-gray-600">
                The original implementation and research behind hierarchical task decomposition in AI.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">🎥 Video Explanation</h3>
              <a
                href="https://www.youtube.com/watch?v=mhft9WBK4uE"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:text-blue-800 underline mb-2"
              >
                Understanding Hierarchical Reasoning - YouTube
              </a>
              <p className="text-sm text-gray-600">
                A detailed explanation of how hierarchical reasoning works in AI systems.
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

export default ReferencesDialog;