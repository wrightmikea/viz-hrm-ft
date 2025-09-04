import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangeHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const changes = [
  {
    version: '1.0.0',
    date: '2025-01-04',
    changes: [
      'Initial release',
      'Interactive 7-step tutorial',
      'Animated training visualization',
      'Live AI thought bubbles',
      'Free exploration mode'
    ]
  },
  {
    version: '1.0.1',
    date: '2025-01-04',
    changes: [
      'Fixed training data display persistence',
      'Added help button with workflow instructions',
      'Reorganized control buttons in logical order',
      'Added References and About dialogs',
      'Added mode indicators for better UX'
    ]
  }
];

const ChangeHistoryDialog: React.FC<ChangeHistoryDialogProps> = ({ isOpen, onClose }) => {
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
          className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          <h2 className="text-xl font-bold mb-4">Change History</h2>
          
          <div className="space-y-4">
            {changes.map((release) => (
              <div key={release.version} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-800">
                    Version {release.version}
                  </h3>
                  <span className="text-sm text-gray-500">{release.date}</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  {release.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      <span>{change}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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

export default ChangeHistoryDialog;