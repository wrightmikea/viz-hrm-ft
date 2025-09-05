# HRM Training Visualization - Testing Checklist

## Overview
This document provides a comprehensive checklist for testing all views, interactions, and use cases in the HRM Training Visualization application.

---

## 1. Tutorial Flow - Introduction View

### Initial State
- [ ] Tutorial Step 0 of 6 displayed in header
- [ ] Progress dots show first dot highlighted
- [ ] Left panel shows welcome message and goal explanation
- [ ] Right panel shows world grid with initial positions
- [ ] Middle panels show Model Info, AI Thinking (empty), Model Learning (placeholder)
- [ ] No training data panel visible
- [ ] "Start Learning!" button visible

### Interactions
- [ ] Hover over "Start Learning!" button - tooltip appears
- [ ] Click "Skip Tutorial" button
- [ ] Click "Start Learning!" button

### Expected Output
- [ ] Skip Tutorial takes user to free play mode
- [ ] Start Learning advances to Step 1
- [ ] No animations or AI movement yet

### Screenshots
- Before: `section-01-before.png`
- After: `section-01-after.png`

---

## 2. Tutorial Flow - Rules View (Step 1)

### Initial State
- [ ] Tutorial Step 1 of 6 displayed
- [ ] Progress dots show second dot highlighted
- [ ] Left panel explains game rules
- [ ] World grid shows static positions
- [ ] AI Model shows 30% Planner, 40% Doer
- [ ] No training data visible

### Interactions
- [ ] Click "Back" button
- [ ] Click "See Untrained AI" button
- [ ] Click "Skip Tutorial"

### Expected Output
- [ ] Back returns to intro (Step 0)
- [ ] "See Untrained AI" starts animation and advances to Step 2
- [ ] Animation shows poor/random AI behavior

### Screenshots
- Before: `section-02-before.png`
- After: `section-02-after.png`

---

## 3. Tutorial Flow - Observe Untrained AI (Step 2)

### Initial State
- [ ] Tutorial Step 2 of 6 displayed
- [ ] AI animation running with random/poor movement
- [ ] Steps counter increasing rapidly
- [ ] Efficiency showing low percentage or failure
- [ ] AI Thinking panel shows confused thoughts
- [ ] No training data visible

### Interactions
- [ ] Wait for animation to complete or fail
- [ ] Click "Back" button
- [ ] Click "Continue" button
- [ ] Hover over Efficiency percentage

### Expected Output
- [ ] Animation shows 30-40 steps or failure
- [ ] Efficiency tooltip explains calculation
- [ ] Continue stops animation and advances to Step 3
- [ ] Back returns to Step 1

### Screenshots
- Before: `section-03-before.png`
- After: `section-03-after.png`

---

## 4. Tutorial Flow - Prepare Training (Step 3)

### Initial State
- [ ] Tutorial Step 3 of 6 displayed
- [ ] Left panel explains need for training data
- [ ] World grid reset to initial state
- [ ] Training data panel NOW VISIBLE at bottom
- [ ] "Generate Training Data" button highlighted

### Interactions
- [ ] Click "Back" button
- [ ] Click "Generate Training Data" button
- [ ] Click "Skip Tutorial"

### Expected Output
- [ ] Generate button creates 10 training examples
- [ ] Each example shows: #n, A:pos K:pos D:pos, steps, ✓
- [ ] Training data panel populated with examples
- [ ] Advances to Step 4

### Screenshots
- Before: `section-04-before.png`
- After: `section-04-after.png`

---

## 5. Tutorial Flow - Watch Training (Step 4)

### Initial State
- [ ] Tutorial Step 4 of 6 displayed
- [ ] Left panel explains learning process
- [ ] Training data visible with 10 examples
- [ ] "Start Training" button visible
- [ ] Model Learning panel ready

### Interactions
- [ ] Click "Start Training" button
- [ ] Click on any training example
- [ ] Click "Back" button
- [ ] Hover over progress bars during training

### Expected Output
- [ ] Training animation shows in Model Learning panel
- [ ] Progress bars increase (Planner to ~95%, Doer to ~95%)
- [ ] Clicking example shows details in middle panel
- [ ] Example details have tooltips on all sections
- [ ] Back returns to Step 3 (training data remains)

### Screenshots
- Before: `section-05-before.png`
- After: `section-05-after.png`

---

## 6. Tutorial Flow - Test Trained AI (Step 5)

### Initial State
- [ ] Tutorial Step 5 of 6 displayed
- [ ] Model shows high accuracy (~95%)
- [ ] Training data still visible
- [ ] "Run Trained AI" button highlighted
- [ ] World grid reset

### Interactions
- [ ] Click "Run Trained AI" button
- [ ] Watch animation complete
- [ ] Hover over Efficiency when complete
- [ ] Click "Back" button

### Expected Output
- [ ] AI solves in 8-10 steps efficiently
- [ ] Shows path: Agent → Key → Door
- [ ] Efficiency shows >80% (possibly 100%+)
- [ ] AI Thinking shows confident decisions
- [ ] Advances to Step 6 when complete

### Screenshots
- Before: `section-06-before.png`
- After: `section-06-after.png`

---

## 7. Tutorial Flow - Completion (Step 6)

### Initial State
- [ ] Tutorial Step 6 of 6 displayed
- [ ] Congratulations message in left panel
- [ ] Training data still visible
- [ ] "Free Exploration" button highlighted

### Interactions
- [ ] Click "Free Exploration" button
- [ ] Click "Back" button

### Expected Output
- [ ] Free Exploration enters free play mode
- [ ] Back returns to Step 5

### Screenshots
- Before: `section-07-before.png`
- After: `section-07-after.png`

---

## 8. Free Play Mode - Initial State

### Initial State
- [ ] Header shows "🎮 Free Exploration Mode"
- [ ] Left panel shows 5 control buttons (all visible)
- [ ] Help button in top right of control panel
- [ ] World grid in default state
- [ ] Model Info shows 30% Planner, 40% Doer
- [ ] AI Thinking panel empty
- [ ] Training data panel visible (empty or with previous data)
- [ ] "Restart Tutorial" button in header

### Interactions
- [ ] Click "Help" button
- [ ] Verify all 5 buttons visible without scrolling
- [ ] Hover over each button for tooltip

### Expected Output
- [ ] Help shows workflow guide
- [ ] All buttons accessible
- [ ] Each button has detailed tooltip

### Screenshots
- Before: `section-08-before.png`
- After (with Help open): `section-08-after.png`

---

## 9. Free Play Mode - Five Step Workflow

### 9.1 Reset All
#### Initial State
- [ ] Any state (trained or untrained)

#### Interactions
- [ ] Click "1. Reset All" button
- [ ] Hover for tooltip

#### Expected Output
- [ ] Model returns to 30%/40%
- [ ] World grid resets
- [ ] Training data cleared
- [ ] Steps counter reset to 0
- [ ] Tooltip: "Clear everything and start over..."

### 9.2 Pre-Training Test
#### Initial State
- [ ] Model untrained (30%/40%)

#### Interactions
- [ ] Click "2. Pre-Training Test" button
- [ ] Watch animation

#### Expected Output
- [ ] AI moves randomly
- [ ] Takes 30-40 steps or fails
- [ ] Low efficiency
- [ ] AI Thinking shows confusion

### 9.3 Generate Training Data
#### Initial State
- [ ] After pre-training test or reset

#### Interactions
- [ ] Click "3. Generate Training Data" button
- [ ] Click on any example
- [ ] Hover over example components

#### Expected Output
- [ ] 10 examples appear with varied positions
- [ ] Each shows: A:n K:n D:n format
- [ ] Click shows details in middle panel
- [ ] Details have tooltips for Initial State, Steps, Path, Actions

### 9.4 Train Model
#### Initial State
- [ ] Training data generated

#### Interactions
- [ ] Click "4. Train Model (5 epochs)" button
- [ ] Hover over progress bars during training

#### Expected Output
- [ ] Progress bars animate to ~95%
- [ ] Training visualization in right panel
- [ ] Hover shows accuracy tooltips

### 9.5 Post-Training Test
#### Initial State
- [ ] Model trained (>90% accuracy)

#### Interactions
- [ ] Click "5. Post-Training Test" button
- [ ] Watch animation
- [ ] Hover over Efficiency

#### Expected Output
- [ ] AI solves in 8-10 steps
- [ ] High efficiency (>80%)
- [ ] Tooltip explains efficiency calculation
- [ ] Success message appears

### Screenshots
- Step 9.1 Reset: `section-09-01-after.png`
- Step 9.2 Pre-test: `section-09-02-before.png`, `section-09-02-after.png`
- Step 9.3 Generate: `section-09-03-before.png`, `section-09-03-after.png`
- Step 9.4 Train: `section-09-04-before.png`, `section-09-04-after.png`
- Step 9.5 Post-test: `section-09-05-before.png`, `section-09-05-after.png`

---

## 10. Navigation Edge Cases

### 10.1 Skip Tutorial at Various Points
- [ ] Skip at Step 0 - enters clean free play
- [ ] Skip at Step 2 - stops animation, enters free play
- [ ] Skip at Step 4 - keeps training data, enters free play
- [ ] Skip at Step 5 - keeps trained model, enters free play

### 10.2 Back Button Behavior
- [ ] Step 4 → Step 3: Training data remains visible
- [ ] Step 3 → Step 2: Training data disappears
- [ ] Step 2 → Step 1: Animation stops
- [ ] Free play → Cannot go back (no back button)

### 10.3 Training Data Persistence
- [ ] Visible at Steps 3, 4, 5 only
- [ ] Not visible at Steps 0, 1, 2
- [ ] Always visible in free play (when generated)
- [ ] Spans only 2/3 width (not blocking right panel)

### Screenshots
- Skip at intro: `section-10-01-before.png`, `section-10-01-after.png`
- Back from Step 4: `section-10-02-before.png`, `section-10-02-after.png`

---

## 11. Tooltip Verification

### Progress Bars
- [ ] Planner label: "The high-level decision maker..."
- [ ] Planner percentage: "Current accuracy: X%..."
- [ ] Planner bar (hover): "Planner learns the goal sequence..."
- [ ] Doer label: "The action executor..."
- [ ] Doer percentage: "Current accuracy: X%..."
- [ ] Doer bar (hover): "Doer learns actions..."

### Game Elements
- [ ] Agent (🧍): "The AI character learning..."
- [ ] Key (🔑): "Must be picked up before..."
- [ ] Door (🚪): "Can only be opened with..."
- [ ] Empty cells: "Empty space at position X..."
- [ ] Efficiency label: "Efficiency = (optimal / actual)..."
- [ ] Efficiency >100%: "AI found shorter path..."

### Control Buttons
- [ ] Reset: "Clear everything and start over..."
- [ ] Pre-Training: "Test the UNTRAINED AI..."
- [ ] Generate: "Generate 10 optimal examples..."
- [ ] Train: "Train the AI on examples..."
- [ ] Post-Training: "Test the TRAINED AI..."

### Training Examples
- [ ] Example card: "Example N: Shows how to solve..."
- [ ] Initial positions: "A:X K:Y D:Z"
- [ ] Steps count: "Number of steps taken"
- [ ] Success indicator: "Optimal solution"

### Example Details Panel
- [ ] Initial State header: "Starting configuration..."
- [ ] Agent position: "The AI agent starts..."
- [ ] Key position: "The key that must be..."
- [ ] Door position: "The door that can only..."
- [ ] Steps section: "The optimal solution takes..."
- [ ] Path section: "The sequence of positions..."
- [ ] Actions section: "The specific commands..."

### Screenshots
- Tooltips example: `section-11-tooltips.png`

---

## 12. Responsive Behavior

### Window Sizing
- [ ] 100% zoom: All elements visible without scrolling
- [ ] Training data doesn't obscure other panels
- [ ] All 5 control buttons visible in left panel
- [ ] No horizontal scrolling needed

### Panel Layouts
- [ ] Top row: 2 columns (left instructions, right world)
- [ ] Middle row: 3 columns (Model Info, AI Thinking, Model Learning)
- [ ] Bottom row: Training data (2/3 width, under left/middle only)
- [ ] Right column never obscured

### Screenshots
- See various section screenshots for layout verification

---

## 13. Animation and Timing

### Pre-Training Animation
- [ ] Shows random/poor movement
- [ ] Takes 30-40 steps typically
- [ ] May fail to complete
- [ ] Updates steps counter in real-time

### Training Animation
- [ ] Shows examples being processed
- [ ] Speed increases with each example
- [ ] Progress bars update smoothly
- [ ] Takes ~3-5 seconds total

### Post-Training Animation
- [ ] Shows efficient movement
- [ ] Takes 8-10 steps typically
- [ ] Clear path: Agent → Key → Door
- [ ] Smooth transitions between positions

### Screenshots
- Pre-training animation: `section-03-before.png`
- Training animation: `section-05-after.png`
- Post-training animation: `section-06-after.png`

---

## 14. Error States and Recovery

### Failed Attempts
- [ ] "Task Failed - Out of steps!" message appears
- [ ] Red background on failure message
- [ ] Can reset and try again

### Training Without Data
- [ ] Train button works but has no effect
- [ ] Model accuracy doesn't change
- [ ] Should show message or disable button

### Screenshots
- Failed state: See `section-09-02-after.png` for failure example

---

## Notes for Reviewer
- Please mark each checkbox as tested
- Add any additional test cases discovered
- Note any failures with description
- Suggest mockup updates if UI has changed
- Record approximate time for each section

## Test Environment
- Browser: Chrome (latest)
- Zoom Level: 100%
- Resolution: 1920x1080 minimum
- Local Server: http://localhost:8080

## Sign-off
- [ ] All sections tested
- [ ] All tooltips verified
- [ ] All animations working
- [ ] No console errors
- [ ] Ready for production

---

*Last Updated: [Date]*
*Tested By: [Name]*
*Version: 0.1.0-beta*