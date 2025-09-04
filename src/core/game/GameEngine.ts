import { GameState, Action, ActionResult, Position } from './types';

export class GameEngine {
  private state: GameState;
  private readonly WORLD_SIZE = 10;

  constructor(initialState?: Partial<GameState>) {
    this.state = this.createInitialState(initialState);
  }

  createInitialState(overrides?: Partial<GameState>): GameState {
    // Default: agent starts far from key, key is far from door
    return {
      agentPos: 5 as Position,
      keyPos: 1 as Position,
      doorPos: 9 as Position,
      hasKey: false,
      doorOpen: false,
      steps: 0,
      maxSteps: 40,
      reward: 0,
      isComplete: false,
      isFailed: false,
      worldSize: this.WORLD_SIZE,
      ...overrides
    };
  }

  getState(): GameState {
    return { ...this.state };
  }

  setState(state: GameState): void {
    this.state = { ...state };
  }

  reset(overrides?: Partial<GameState>): void {
    this.state = this.createInitialState(overrides);
  }

  randomizePositions(): void {
    // Place items at random positions, ensuring they're spread out
    const keyPos = Math.floor(Math.random() * 4) as Position; // Key in left half
    const doorPos = (6 + Math.floor(Math.random() * 4)) as Position; // Door in right half
    const agentPos = (3 + Math.floor(Math.random() * 4)) as Position; // Agent in middle
    
    this.reset({ keyPos, doorPos, agentPos });
  }

  executeAction(action: Action): ActionResult {
    const newState = { ...this.state };
    let reward = -0.1; // Small penalty for each step
    let success = false;
    let message = '';

    switch (action) {
      case 'Left':
        if (newState.agentPos > 0) {
          newState.agentPos = (newState.agentPos - 1) as Position;
          success = true;
          message = 'Moved left';
        } else {
          reward = -0.5; // Penalty for invalid move
          message = 'Cannot move left - at boundary';
        }
        break;

      case 'Right':
        if (newState.agentPos < this.WORLD_SIZE - 1) {
          newState.agentPos = (newState.agentPos + 1) as Position;
          success = true;
          message = 'Moved right';
        } else {
          reward = -0.5; // Penalty for invalid move
          message = 'Cannot move right - at boundary';
        }
        break;

      case 'Pick':
        if (newState.agentPos === newState.keyPos && !newState.hasKey) {
          newState.hasKey = true;
          reward = 1.0; // Reward for picking up key
          success = true;
          message = 'Picked up the key! 🔑';
        } else if (newState.hasKey) {
          reward = -0.5;
          message = 'Already holding the key';
        } else {
          reward = -0.5;
          message = 'No key here to pick up';
        }
        break;

      case 'Open':
        if (newState.agentPos === newState.doorPos) {
          if (newState.hasKey) {
            newState.doorOpen = true;
            newState.isComplete = true;
            reward = 5.0; // Big reward for completing the task
            success = true;
            message = 'Door opened! Task complete! 🎉';
          } else {
            reward = -1.0; // Penalty for trying to open without key
            message = 'Cannot open door - need key first! 🔒';
          }
        } else {
          reward = -0.5;
          message = 'Not at the door';
        }
        break;
    }

    newState.steps++;
    newState.reward += reward;

    if (newState.steps >= newState.maxSteps && !newState.isComplete) {
      newState.isFailed = true;
      message = 'Out of steps! Task failed.';
    }

    this.state = newState;

    return {
      success,
      newState,
      reward,
      message
    };
  }

  isValidAction(action: Action): boolean {
    const state = this.state;
    
    switch (action) {
      case 'Left':
        return state.agentPos > 0;
      case 'Right':
        return state.agentPos < this.WORLD_SIZE - 1;
      case 'Pick':
        return state.agentPos === state.keyPos && !state.hasKey;
      case 'Open':
        return state.agentPos === state.doorPos && state.hasKey;
      default:
        return false;
    }
  }

  getOptimalAction(): Action | null {
    const state = this.state;
    
    if (!state.hasKey) {
      // Need to get the key first
      if (state.agentPos === state.keyPos) {
        return 'Pick';
      } else if (state.agentPos < state.keyPos) {
        return 'Right';
      } else {
        return 'Left';
      }
    } else {
      // Have key, go to door
      if (state.agentPos === state.doorPos) {
        return 'Open';
      } else if (state.agentPos < state.doorPos) {
        return 'Right';
      } else {
        return 'Left';
      }
    }
  }

  getOptimalSteps(): number {
    const state = this.state;
    const toKey = Math.abs(state.agentPos - state.keyPos);
    const keyToDoor = Math.abs(state.doorPos - state.keyPos);
    return toKey + keyToDoor + 2; // +2 for Pick and Open actions
  }

  generateOptimalEpisode(): { states: GameState[], actions: Action[], optimalSteps: number } {
    const startState = this.getState();
    const optimalSteps = this.getOptimalSteps();
    
    this.reset(startState);
    const states: GameState[] = [this.getState()];
    const actions: Action[] = [];

    while (!this.state.isComplete && !this.state.isFailed) {
      const action = this.getOptimalAction();
      if (!action) break;
      
      actions.push(action);
      this.executeAction(action);
      states.push(this.getState());
    }

    return { states, actions, optimalSteps };
  }
}