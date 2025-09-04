# HRM Training Visualization

Interactive visualization of a Hierarchical Reasoning Model (HRM) learning to solve a simple "Key → Door" task through fine-tuning.

## Overview

This project demonstrates how hierarchical models decompose problems into sub-goals, visualizing the training process where a two-level HRM (Planner + Doer) learns to:
1. Navigate to a key 🔑
2. Pick up the key 🤏
3. Navigate to a door 🚪  
4. Open the door 🔓

## Features

- **Interactive 1D World**: Visual environment with agent, key, and door
- **Hierarchical Model Visualization**: Shows Planner (sub-goal selection) and Doer (action execution)
- **Training Animation**: Step-by-step visualization of the fine-tuning process
- **Thought Bubbles**: Real-time display of model reasoning
- **Ablation Studies**: Toggle hierarchy, freeze components to understand their contributions
- **Configurable Parameters**: Adjust dataset size, noise level, and playback speed

## Running the Project

### Development Mode
```bash
npm install
npm run dev
```
Open http://localhost:3000 in your browser.

### Production Build
```bash
npm run build
```
The static files will be generated in the `./static` directory.

### Serving Static Files
You can serve the static files using any web server. For example:
```bash
# Using Python
cd static
python -m http.server 8000

# Using Node.js http-server
npx http-server static -p 8000
```

## Project Structure

- `/docs` - Planning documents and PRD
- `/src/core` - Game engine and HRM model logic
- `/src/components` - React UI components
- `/src/store` - State management with Zustand
- `/static` - Built static files for deployment

## Architecture

The visualization uses:
- **React** + **TypeScript** for the UI
- **Framer Motion** for animations
- **Zustand** for state management
- **Vite** for fast builds and development
- **Tailwind CSS** for styling

## Animation Phases

1. **Introduction** - Overview of the task
2. **Before Training** - Model attempts with poor performance
3. **Training Data** - Display of training examples
4. **Training** - Visualization of learning process
5. **After Training** - Improved model performance
6. **Generalization** - Testing on new configurations
7. **Comparison** - Hierarchical vs flat approaches

## Future Enhancements

- Additional tasks (Two-Cup Game, Sort-by-Rule)
- Train/Validation/Test data splits
- Custom task designer
- Real neural network integration
- Export animations as GIF/video