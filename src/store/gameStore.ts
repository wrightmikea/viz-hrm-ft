import { create } from 'zustand';
import { GameEngine } from '../core/game/GameEngine';
import { HRMModel, Thought } from '../core/model/HRM';
import { GameState, Action, SubGoal, Episode } from '../core/game/types';

export type AnimationPhase = 
  | 'intro'
  | 'beforeTraining'
  | 'trainingData'
  | 'training'
  | 'afterTraining'
  | 'generalization'
  | 'comparison';

export interface SimulationState {
  // Game state
  gameEngine: GameEngine;
  currentState: GameState;
  
  // Model state
  model: HRMModel;
  isTraining: boolean;
  trainingProgress: number;
  modelAccuracy: { planner: number; doer: number };
  
  // Episodes
  currentEpisode: Episode | null;
  trainingEpisodes: Episode[];
  testEpisodes: Episode[];
  episodeStep: number;
  
  // Animation
  phase: AnimationPhase;
  isPlaying: boolean;
  speed: number;
  
  // Thoughts and feedback
  thoughts: Thought[];
  lastAction: Action | null;
  lastSubGoal: SubGoal | null;
  actionFeedback: string | null;
  
  // Configuration
  datasetSize: number;
  noiseLevel: number;
  hierarchyEnabled: boolean;
  plannerFrozen: boolean;
  doerFrozen: boolean;
  
  // UI State
  resetFeedback: string | null;
  dataGeneratedFeedback: boolean;
}

export interface SimulationActions {
  // Game actions
  executeAction: (action: Action) => void;
  resetGame: (overrides?: Partial<GameState>) => void;
  
  // Model actions
  trainModel: (epochs?: number) => Promise<void>;
  resetModel: () => void;
  
  // Episode management
  generateEpisode: (useTrainedModel: boolean) => Episode;
  runEpisode: (episode: Episode) => Promise<void>;
  generateTrainingData: () => void;
  stepThroughEpisode: () => void;
  
  // Animation control
  setPhase: (phase: AnimationPhase) => void;
  play: () => void;
  pause: () => void;
  setSpeed: (speed: number) => void;
  
  // Configuration
  setDatasetSize: (size: number) => void;
  setNoiseLevel: (level: number) => void;
  toggleHierarchy: () => void;
  togglePlannerFreeze: () => void;
  toggleDoerFreeze: () => void;
  
  // Utilities
  clearThoughts: () => void;
  addThought: (thought: Thought) => void;
}

export const useSimulationStore = create<SimulationState & SimulationActions>((set, get) => ({
  // Initial state
  gameEngine: new GameEngine(),
  currentState: new GameEngine().getState(),
  model: new HRMModel(),
  isTraining: false,
  trainingProgress: 0,
  modelAccuracy: { planner: 30, doer: 40 },
  currentEpisode: null,
  trainingEpisodes: [],
  testEpisodes: [],
  episodeStep: 0,
  phase: 'intro',
  isPlaying: false,
  speed: 1,
  thoughts: [],
  lastAction: null,
  lastSubGoal: null,
  actionFeedback: null,
  datasetSize: 10,
  noiseLevel: 0.1,
  hierarchyEnabled: true,
  plannerFrozen: false,
  doerFrozen: false,
  resetFeedback: null,
  dataGeneratedFeedback: false,

  // Game actions
  executeAction: (action) => {
    const { gameEngine } = get();
    const result = gameEngine.executeAction(action);
    
    set({
      currentState: result.newState,
      lastAction: action,
      actionFeedback: result.message
    });
  },

  resetGame: (overrides) => {
    const { gameEngine } = get();
    gameEngine.reset(overrides);
    
    set({
      currentState: gameEngine.getState(),
      lastAction: null,
      lastSubGoal: null,
      actionFeedback: null,
      episodeStep: 0,
      resetFeedback: '✅ Game reset!',
      thoughts: []
    });
    
    // Clear feedback after 2 seconds
    setTimeout(() => set({ resetFeedback: null }), 2000);
  },

  // Model actions
  trainModel: async (epochs = 5) => {
    set({ isTraining: true, trainingProgress: 0 });
    
    const { model, trainingEpisodes } = get();
    
    // Simulate training with visual progress
    for (let epoch = 0; epoch < epochs; epoch++) {
      // For each epoch, simulate training on episodes
      for (let i = 0; i < trainingEpisodes.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100 / get().speed));
        
        // Update progress
        const progress = ((epoch * trainingEpisodes.length + i + 1) / (epochs * trainingEpisodes.length)) * 100;
        set({ trainingProgress: progress });
        
        // Gradually improve accuracy
        const plannerAcc = Math.min(95, 30 + (progress * 0.65));
        const doerAcc = Math.min(95, 40 + (progress * 0.55));
        set({ modelAccuracy: { planner: plannerAcc, doer: doerAcc } });
      }
    }
    
    // Actually train the model
    model.train(epochs);
    
    set({ 
      isTraining: false, 
      trainingProgress: 100,
      actionFeedback: '✅ Training complete!'
    });
  },

  resetModel: () => {
    const { model } = get();
    model.reset();
    set({ 
      trainingProgress: 0,
      thoughts: [],
      modelAccuracy: { planner: 30, doer: 40 },
      resetFeedback: '✅ Model reset!',
      episodeStep: 0
    });
    
    // Clear feedback after 2 seconds
    setTimeout(() => set({ resetFeedback: null }), 2000);
  },

  // Episode management
  generateEpisode: (useTrainedModel) => {
    const { gameEngine, model } = get();
    const optimalSteps = gameEngine.getOptimalSteps();
    gameEngine.reset(gameEngine.getState());
    model.clearThoughts();
    
    const states: GameState[] = [gameEngine.getState()];
    const actions: Action[] = [];
    const subGoals: SubGoal[] = [];
    const rewards: number[] = [];
    let totalReward = 0;

    while (!gameEngine.getState().isComplete && !gameEngine.getState().isFailed) {
      const state = gameEngine.getState();
      const { action, subGoal } = model.step(state, useTrainedModel);
      
      subGoals.push(subGoal);
      actions.push(action);
      
      const result = gameEngine.executeAction(action);
      rewards.push(result.reward);
      totalReward += result.reward;
      states.push(result.newState);
      
      if (states.length > 50) break; // Prevent infinite loops
    }

    const episode: Episode = {
      id: Math.random().toString(36).substr(2, 9),
      states,
      actions,
      subGoals,
      rewards,
      totalReward,
      success: gameEngine.getState().isComplete,
      optimalSteps
    };

    set({ currentEpisode: episode, episodeStep: 0 });
    return episode;
  },

  runEpisode: async (episode) => {
    const { gameEngine, speed } = get();
    set({ isPlaying: true, currentEpisode: episode, episodeStep: 0 });
    
    for (let i = 0; i < episode.states.length; i++) {
      if (!get().isPlaying) break;
      
      gameEngine.setState(episode.states[i]);
      
      // Generate thoughts for this step
      if (i > 0) {
        const thought: Thought = {
          id: Math.random().toString(36).substr(2, 9),
          content: `Step ${i}: ${episode.subGoals[i-1]} → ${episode.actions[i-1]}`,
          type: i % 2 === 0 ? 'planner' : 'doer',
          timestamp: Date.now()
        };
        set(state => ({ thoughts: [...state.thoughts, thought] }));
      }
      
      set({ 
        currentState: episode.states[i],
        lastAction: episode.actions[i - 1] || null,
        lastSubGoal: episode.subGoals[i - 1] || null,
        episodeStep: i,
        actionFeedback: i === 0 ? 'Starting episode...' : 
                       i === episode.states.length - 1 ? 
                       (episode.success ? '✅ Task completed!' : '❌ Task failed!') :
                       `Step ${i}/${episode.states.length - 1}`
      });
      
      await new Promise(resolve => setTimeout(resolve, 1000 / speed));
    }
    
    set({ isPlaying: false });
  },

  stepThroughEpisode: () => {
    const { currentEpisode, episodeStep, gameEngine } = get();
    if (!currentEpisode || episodeStep >= currentEpisode.states.length - 1) return;
    
    const nextStep = episodeStep + 1;
    gameEngine.setState(currentEpisode.states[nextStep]);
    
    set({
      currentState: currentEpisode.states[nextStep],
      lastAction: currentEpisode.actions[nextStep - 1] || null,
      lastSubGoal: currentEpisode.subGoals[nextStep - 1] || null,
      episodeStep: nextStep
    });
  },

  generateTrainingData: () => {
    const { datasetSize } = get();
    const trainingEpisodes: Episode[] = [];
    
    // Generate optimal episodes for training
    const tempEngine = new GameEngine();
    
    for (let i = 0; i < datasetSize; i++) {
      // Randomize starting positions for variety
      if (i % 2 === 0) {
        tempEngine.randomizePositions();
      } else {
        tempEngine.reset();
      }
      
      const { states, actions, optimalSteps } = tempEngine.generateOptimalEpisode();
      const subGoals: SubGoal[] = [];
      const rewards: number[] = [];
      
      // Determine subgoals for each action
      for (let j = 0; j < actions.length; j++) {
        const state = states[j];
        if (!state.hasKey) {
          subGoals.push('GoToKey');
        } else if (state.agentPos !== state.doorPos) {
          subGoals.push('GoToDoor');
        } else {
          subGoals.push('OpenDoor');
        }
        rewards.push(j === actions.length - 1 ? 5 : -0.1);
      }
      
      trainingEpisodes.push({
        id: `train-${i}`,
        states,
        actions,
        subGoals,
        rewards,
        totalReward: rewards.reduce((a, b) => a + b, 0),
        success: true,
        optimalSteps
      });
    }
    
    set({ 
      trainingEpisodes,
      dataGeneratedFeedback: true,
      actionFeedback: `✅ Generated ${datasetSize} training episodes!`
    });
    
    // Clear feedback after 3 seconds
    setTimeout(() => set({ dataGeneratedFeedback: false }), 3000);
  },

  // Animation control
  setPhase: (phase) => set({ phase }),
  play: () => {
    const { currentEpisode, phase } = get();
    
    if (!currentEpisode) {
      // Generate and run an episode based on current phase
      const useTrainedModel = phase === 'afterTraining' || phase === 'generalization';
      const episode = get().generateEpisode(useTrainedModel);
      get().runEpisode(episode);
    } else {
      set({ isPlaying: true });
    }
  },
  
  pause: () => set({ isPlaying: false }),
  setSpeed: (speed) => set({ speed }),

  // Configuration
  setDatasetSize: (size) => set({ datasetSize: size }),
  setNoiseLevel: (level) => set({ noiseLevel: level }),
  
  toggleHierarchy: () => {
    const { model, hierarchyEnabled } = get();
    model.setHierarchyEnabled(!hierarchyEnabled);
    set({ hierarchyEnabled: !hierarchyEnabled });
  },
  
  togglePlannerFreeze: () => {
    const { model, plannerFrozen } = get();
    model.freezePlanner(!plannerFrozen);
    set({ plannerFrozen: !plannerFrozen });
  },
  
  toggleDoerFreeze: () => {
    const { model, doerFrozen } = get();
    model.freezeDoer(!doerFrozen);
    set({ doerFrozen: !doerFrozen });
  },

  // Utilities
  clearThoughts: () => {
    const { model } = get();
    model.clearThoughts();
    set({ thoughts: [] });
  },
  
  addThought: (thought) => {
    set(state => ({ thoughts: [...state.thoughts, thought] }));
  }
}));