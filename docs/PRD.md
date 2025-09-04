# Product Requirements Document: HRM Training Visualization

## Executive Summary
An interactive, educational web application that visualizes how a Hierarchical Reasoning Model (HRM) learns to solve simple tasks through fine-tuning. The visualization uses a toy "Key → Door" problem to demonstrate hierarchical decision-making, making complex AI concepts accessible through animation and interactivity.

## Product Vision
Create an intuitive, visually engaging tool that helps users understand:
- How hierarchical models decompose problems into sub-goals
- The fine-tuning process and how models improve with training
- The advantages of hierarchical reasoning over flat approaches
- The relationship between high-level planning and low-level execution

## Target Audience
- **Primary**: AI/ML students and educators
- **Secondary**: Developers interested in understanding HRM concepts
- **Tertiary**: General audience curious about AI learning processes

## Core Features

### 1. Interactive 1D World Simulation
**Description**: A simple 5-tile linear world where an agent must collect a key to open a door.

**Requirements**:
- Visual representation using emojis: Agent (🧍), Key (🔑), Door (🚪)
- Smooth movement animations between tiles
- Visual feedback for actions (success ✅, failure ❌)
- Configurable starting positions for generalization testing

**User Value**: Provides an intuitive, minimal environment to understand the task without overwhelming complexity.

### 2. Hierarchical Model Visualization
**Description**: Visual representation of the two-level HRM architecture.

**Components**:
- **Planner Node**: Shows sub-goal selection (GoTo(Key), GoTo(Door), OpenDoor)
- **Doer Node**: Displays action execution (Left, Right, Pick, Open)
- **Memory Chip**: Toggle showing key possession state
- **Thought Bubbles**: Real-time reasoning display during execution

**Requirements**:
- Animated token flow between components
- Color-coded states (active, inactive, error)
- Visual connections showing information flow
- Expandable details on hover/click

**User Value**: Makes the abstract concept of hierarchical reasoning concrete and observable.

### 3. Training Process Animation
**Description**: Step-by-step visualization of the fine-tuning process.

**Phases**:
1. **Before Training**: Show poor initial performance
2. **Training Data**: Display small dataset (5-20 examples)
3. **Fine-tuning Loop**: Animate 3-5 training iterations
4. **After Training**: Demonstrate improved performance
5. **Generalization**: Test on new configurations

**Requirements**:
- Episode replay with scrubbing controls
- Loss visualization with pulsing effects
- Weight update animations
- Credit assignment highlighting
- Side-by-side before/after comparison

**User Value**: Demystifies the training process, showing how models learn from examples.

### 4. Interactive Controls & Configuration
**Description**: User controls to explore different aspects of the system.

**Controls**:
- **Playback**: Play/Pause, Speed (0.5x - 4x), Scene selection
- **Configuration**:
  - Dataset size slider (5-20 examples)
  - Noise level adjustment
  - Random seed control
  - Initial position randomization
- **Ablation Toggles**:
  - Enable/Disable hierarchy
  - Freeze Planner updates
  - Freeze Doer updates

**User Value**: Enables hands-on exploration and experimentation.

### 5. Metrics Dashboard
**Description**: Real-time performance metrics and visualizations.

**Metrics**:
- Planner accuracy over time
- Doer action accuracy
- Episode rewards
- Steps to completion
- Success rate

**Visualizations**:
- Line charts for accuracy trends
- Bar charts for performance comparison
- Sparklines for quick insights

**User Value**: Provides quantitative understanding of model improvement.

### 6. Educational Overlays
**Description**: Contextual information and explanations.

**Features**:
- Tooltips explaining concepts
- Narration text for each phase
- Expandable math equations (optional)
- Glossary of terms
- Keyboard shortcuts guide

**User Value**: Supports self-paced learning with appropriate depth.

## Non-Functional Requirements

### Performance
- **60 FPS** animation on average hardware
- **< 3 seconds** initial load time
- **< 100ms** response to user interactions
- **< 5MB** total bundle size

### Accessibility
- **WCAG 2.1 AA** compliance
- Keyboard navigation support
- Screen reader compatibility
- Reduced motion mode
- High contrast mode option
- Minimum font size of 14px

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile responsive (tablets and large phones)

### Deployment
- Static file hosting compatible
- No server-side dependencies
- Works offline after initial load
- CDN-friendly asset structure

## User Stories

### Student User Stories
1. **As a student**, I want to see how the model makes mistakes before training, so I can understand why training is necessary.
2. **As a student**, I want to adjust the training dataset size, so I can see how more data improves performance.
3. **As a student**, I want to pause and replay animations, so I can study specific moments in detail.

### Educator User Stories
1. **As an educator**, I want clear phase separations, so I can explain each concept sequentially.
2. **As an educator**, I want to disable the hierarchy, so I can demonstrate its importance through comparison.
3. **As an educator**, I want to export visualizations, so I can include them in presentations.

### Developer User Stories
1. **As a developer**, I want to see the credit assignment process, so I understand how different components learn.
2. **As a developer**, I want to modify task parameters, so I can explore edge cases.
3. **As a developer**, I want access to raw metrics, so I can analyze performance quantitatively.

## Success Criteria
1. **Comprehension**: 80% of users can explain HRM concept after using the tool
2. **Engagement**: Average session duration > 5 minutes
3. **Performance**: Consistent 60 FPS on 2018+ hardware
4. **Accessibility**: Pass automated accessibility audits
5. **Education**: Positive feedback from 3+ educators

## Future Enhancements

### Version 2.0
- Additional tasks (Two-Cup Game, Sort-by-Rule)
- Train/Validation/Test data splits
- Custom task designer
- Multi-agent scenarios
- Comparison with other architectures

### Version 3.0
- Real neural network integration
- Custom model upload
- Collaborative features
- Curriculum learning visualization
- Performance benchmarking tools

## Technical Constraints
- Must run entirely in browser (no backend)
- Must work with JavaScript disabled (basic fallback)
- Must be embeddable in other websites
- Must support URL-based state sharing

## Dependencies & Risks

### Dependencies
- React ecosystem stability
- Framer Motion API consistency
- Browser animation performance
- Emoji rendering consistency

### Risks
- **Performance on low-end devices**: Mitigate with quality settings
- **Concept oversimplification**: Address with optional depth layers
- **Browser incompatibilities**: Test early and often
- **Large bundle size**: Use code splitting and lazy loading

## Metrics & Analytics
- Page views and unique visitors
- Interaction events (play, pause, configure)
- Phase completion rates
- Error tracking
- Performance metrics (FPS, load time)

## Release Plan
1. **Alpha**: Core visualization working (Week 2)
2. **Beta**: All features implemented (Week 3)
3. **RC**: Polish and bug fixes (Week 4)
4. **v1.0**: Public release (Week 4)
5. **v1.1**: Incorporate feedback (Week 6)

## Appendix

### Glossary
- **HRM**: Hierarchical Reasoning Model
- **Planner**: High-level component that selects sub-goals
- **Doer**: Low-level component that executes actions
- **Fine-tuning**: Process of adapting a model to specific tasks
- **Credit Assignment**: Determining which component to update based on errors
- **Ablation**: Disabling components to study their contribution

### Alternative Task Specifications

#### Two-Cup Game
- World: 2 cups, 1 ball
- Actions: Choose Left, Choose Right
- Goal: Find ball after shuffle

#### Sort-by-Rule
- World: Shapes with colors
- Actions: Pick shape
- Goal: Follow conditional rules

#### One-Step Maze
- World: 1D path with obstacle
- Actions: Move, Push
- Goal: Clear path then reach end