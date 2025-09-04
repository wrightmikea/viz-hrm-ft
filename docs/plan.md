# HRM Visualization Implementation Plan

## Project Overview
Interactive visualization of a Hierarchical Reasoning Model (HRM) learning to solve a simple "Key → Door" task in a 1D world, using React and modern web technologies.

## Architecture Overview

### Technology Stack
- **Framework**: React 18 with TypeScript
- **Animation**: Framer Motion for smooth, timeline-based animations
- **State Management**: Zustand for global state + React Context for animation state
- **Build Tool**: Vite for fast development and optimized static builds
- **Styling**: CSS Modules + Tailwind CSS for utility classes
- **Icons/Graphics**: Emoji-based graphics with SVG overlays for effects
- **Charts**: Recharts for metrics visualization

### Project Structure
```
viz-hrm-ft/
├── docs/
│   ├── plan.md (this file)
│   ├── PRD.md
│   └── eli5-visualization-of-training-hrm.txt
├── src/
│   ├── components/
│   │   ├── World/
│   │   │   ├── WorldTrack.tsx
│   │   │   ├── Agent.tsx
│   │   │   ├── Key.tsx
│   │   │   └── Door.tsx
│   │   ├── Hierarchy/
│   │   │   ├── Planner.tsx
│   │   │   ├── Doer.tsx
│   │   │   ├── Memory.tsx
│   │   │   └── ThoughtBubble.tsx
│   │   ├── Training/
│   │   │   ├── TrainingDeck.tsx
│   │   │   ├── EpisodeCard.tsx
│   │   │   └── LossIndicator.tsx
│   │   ├── Controls/
│   │   │   ├── PlaybackControls.tsx
│   │   │   ├── SpeedSlider.tsx
│   │   │   └── ConfigPanel.tsx
│   │   └── Metrics/
│   │       ├── MetricsDashboard.tsx
│   │       ├── AccuracyChart.tsx
│   │       └── RewardChart.tsx
│   ├── core/
│   │   ├── game/
│   │   │   ├── GameEngine.ts
│   │   │   ├── GameState.ts
│   │   │   └── Actions.ts
│   │   ├── model/
│   │   │   ├── HRM.ts
│   │   │   ├── Planner.ts
│   │   │   ├── Doer.ts
│   │   │   └── Training.ts
│   │   └── animation/
│   │       ├── Director.ts
│   │       ├── Timeline.ts
│   │       └── Phases.ts
│   ├── store/
│   │   ├── gameStore.ts
│   │   ├── modelStore.ts
│   │   └── animationStore.ts
│   ├── utils/
│   │   ├── random.ts
│   │   ├── episodes.ts
│   │   └── metrics.ts
│   ├── data/
│   │   ├── episodes.json
│   │   └── config.json
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── static/ (generated)
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Implementation Phases

### Phase 1: Project Setup & Core Infrastructure
1. Initialize React + Vite + TypeScript project
2. Configure build system for static output
3. Set up Framer Motion and Zustand
4. Create basic project structure
5. Implement random seed management for deterministic playback

### Phase 2: Game Engine & Logic
1. Implement 1D world state representation
2. Create action system (Left, Right, Pick, Open)
3. Build game rules and validation
4. Generate training episodes
5. Implement reward calculation

### Phase 3: HRM Model Simulation
1. Create Planner logic (sub-goal selection)
2. Implement Doer logic (action execution)
3. Build memory system for key possession
4. Create mock training/fine-tuning logic
5. Implement before/after behavior differences

### Phase 4: World Visualization Components
1. Build 1D world track component
2. Create animated agent (🧍)
3. Implement key (🔑) and door (🚪) components
4. Add movement animations
5. Implement action feedback (success/failure indicators)

### Phase 5: Hierarchy Visualization
1. Create Planner/Doer visual boxes
2. Implement token flow animations
3. Build memory chip toggle
4. Add thought bubbles for reasoning display
5. Create sub-goal cards animation

### Phase 6: Training Visualization
1. Build training deck component
2. Implement episode card animations
3. Create loss indicators with pulsing effects
4. Add weight update visualizations
5. Implement credit assignment animations

### Phase 7: Animation System
1. Create Director class for scene orchestration
2. Implement phase-based timeline
3. Add scene transitions
4. Build scrubbing/playback controls
5. Implement speed controls

### Phase 8: Metrics & Controls
1. Build metrics dashboard
2. Implement accuracy charts
3. Add reward visualization
4. Create configuration panel
5. Add dataset size and noise controls

### Phase 9: Polish & Enhancements
1. Add tooltips and explanations
2. Implement accessibility features
3. Add alternative visualization modes
4. Create ablation toggles
5. Optimize performance

### Phase 10: Build & Deployment
1. Configure static build output
2. Optimize bundle size
3. Create deployment scripts
4. Test cross-browser compatibility
5. Generate documentation

## Key Design Decisions

### Extensibility Considerations
- **Plugin Architecture**: Components designed to accept different task types
- **Configurable Tasks**: JSON-based task definitions for easy swapping
- **Modular Animations**: Timeline segments can be reordered/replaced
- **State Abstraction**: Game logic separated from visualization

### Performance Optimizations
- Use React.memo for heavy components
- Implement virtual scrolling for episode lists
- Lazy load chart components
- Use CSS transforms for animations (GPU acceleration)
- Debounce slider updates

### Future Enhancement Hooks
- **Data Split Support**: Architecture ready for train/validation/test splits
- **Alternative Tasks**: Interface for "Two-Cup Game" and "Sort-by-Rule"
- **Advanced Metrics**: Extensible metrics system for new measurements
- **Export Capabilities**: Hooks for GIF/video export
- **Multi-agent Support**: State structure supports multiple agents

## Development Timeline
- **Week 1**: Phases 1-3 (Setup, Game Engine, Model)
- **Week 2**: Phases 4-6 (Visualizations)
- **Week 3**: Phases 7-8 (Animation, Controls)
- **Week 4**: Phases 9-10 (Polish, Deployment)

## Testing Strategy
- Unit tests for game logic and model
- Component testing with React Testing Library
- Animation testing with Playwright
- Performance testing with Lighthouse
- Cross-browser testing

## Risk Mitigation
- **Performance**: Start with simple animations, profile early
- **Complexity**: Build incrementally, maintain working demos
- **Browser Compatibility**: Test on major browsers regularly
- **Mobile Support**: Design responsive from the start
- **Accessibility**: Include ARIA labels and keyboard navigation

## Success Metrics
- Smooth 60fps animations on average hardware
- < 3s initial load time
- Intuitive controls (user testing)
- Clear pedagogical value (feedback incorporation)
- Extensible for future enhancements