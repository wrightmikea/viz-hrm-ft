import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChangeHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// CHANGES.md content formatted for display
const changesMarkdown = `# Change History

## [0.1.0] - 2025-09-05

### Release
- UI tweaks - fix free play button enablement

## [0.1.0-beta] - 2025-09-04

### Fixed
- Training data panel now displays correctly in free exploration mode
- Layout optimized to fit at 100% zoom
- Control buttons separated (Pre/Post instead of combined Test)
- Training button no longer jumps to tutorial

### Changed
- Reduced header and footer height for more content space
- Tighter spacing throughout UI
- Header shows mode indicator inline with title

## [0.1.0-alpha] - 2024-09-03

### Added
- Interactive 7-step tutorial for learning about HRM
- Live AI thought visualization with speech bubbles
- Animated training process with progressive speed
- Free exploration mode with workflow buttons
- Help system with suggested order of operations
- About, References, and Change History dialogs
- Footer with copyright and license information
- Bash scripts for development workflow
- Comprehensive README documentation

### Features
- 10-tile game world with key-door puzzle
- Hierarchical Reasoning Model with Planner and Doer
- Training data generation with optimal examples
- Performance comparison (untrained vs trained)
- Mode indicators (Introduction, Tutorial, Exploration)`;

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
          className="relative bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col"
        >
          <h2 className="text-xl font-bold mb-4">Change History</h2>
          
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto pr-2">
            <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700">
              {changesMarkdown}
            </pre>
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