import { GameState, Action, SubGoal } from '../game/types';

export interface ModelWeights {
  plannerAccuracy: number;
  doerAccuracy: number;
  explorationRate: number;
}

export interface Thought {
  id: string;
  content: string;
  type: 'planner' | 'doer' | 'memory';
  timestamp: number;
}

export class Planner {
  private accuracy: number;
  private thoughts: Thought[] = [];

  constructor(accuracy: number = 0.3) {
    this.accuracy = accuracy;
  }

  selectSubGoal(state: GameState, isTraining: boolean = false): SubGoal {
    const random = Math.random();
    
    // Generate thought
    const thought: Thought = {
      id: Math.random().toString(36).substr(2, 9),
      content: this.generateThought(state),
      type: 'planner',
      timestamp: Date.now()
    };
    this.thoughts.push(thought);

    // If trained or lucky, choose optimal subgoal
    if (random < this.accuracy || isTraining) {
      if (!state.hasKey) {
        return 'GoToKey';
      } else if (!state.doorOpen) {
        return state.agentPos === state.doorPos ? 'OpenDoor' : 'GoToDoor';
      }
    }

    // Otherwise, choose randomly (untrained behavior)
    const subGoals: SubGoal[] = ['GoToKey', 'GoToDoor', 'OpenDoor'];
    return subGoals[Math.floor(Math.random() * subGoals.length)];
  }

  private generateThought(state: GameState): string {
    if (!state.hasKey) {
      return "Need to get the key first! 🤔";
    } else if (state.agentPos !== state.doorPos) {
      return "Have key, heading to door! 🚶";
    } else {
      return "At door with key, time to open! 🔓";
    }
  }

  improveAccuracy(delta: number): void {
    this.accuracy = Math.min(1.0, Math.max(0, this.accuracy + delta));
  }

  getAccuracy(): number {
    return this.accuracy;
  }

  getThoughts(): Thought[] {
    return this.thoughts;
  }

  clearThoughts(): void {
    this.thoughts = [];
  }
}

export class Doer {
  private accuracy: number;
  private thoughts: Thought[] = [];

  constructor(accuracy: number = 0.4) {
    this.accuracy = accuracy;
  }

  selectAction(state: GameState, subGoal: SubGoal, isTraining: boolean = false): Action {
    const random = Math.random();
    
    // Generate thought
    const thought: Thought = {
      id: Math.random().toString(36).substr(2, 9),
      content: this.generateThought(subGoal, state),
      type: 'doer',
      timestamp: Date.now()
    };
    this.thoughts.push(thought);

    // If trained or lucky, choose optimal action
    if (random < this.accuracy || isTraining) {
      return this.getOptimalAction(state, subGoal);
    }

    // Otherwise, choose randomly (untrained behavior)
    const actions: Action[] = ['Left', 'Right', 'Pick', 'Open'];
    return actions[Math.floor(Math.random() * actions.length)];
  }

  private getOptimalAction(state: GameState, subGoal: SubGoal): Action {
    switch (subGoal) {
      case 'GoToKey':
        if (state.agentPos === state.keyPos) {
          return 'Pick';
        }
        return state.agentPos < state.keyPos ? 'Right' : 'Left';

      case 'GoToDoor':
        if (state.agentPos === state.doorPos) {
          return 'Open';
        }
        return state.agentPos < state.doorPos ? 'Right' : 'Left';

      case 'OpenDoor':
        return 'Open';

      default:
        return 'Right';
    }
  }

  private generateThought(subGoal: SubGoal, state: GameState): string {
    switch (subGoal) {
      case 'GoToKey':
        if (state.agentPos === state.keyPos) {
          return "At key position, picking it up! 🤏";
        }
        return state.agentPos < state.keyPos ? "Moving right to key ➡️" : "Moving left to key ⬅️";
      
      case 'GoToDoor':
        if (state.agentPos === state.doorPos) {
          return "At door, ready to open! 🚪";
        }
        return state.agentPos < state.doorPos ? "Moving right to door ➡️" : "Moving left to door ⬅️";
      
      case 'OpenDoor':
        return "Opening the door! 🔓";
      
      default:
        return "Thinking... 🤔";
    }
  }

  improveAccuracy(delta: number): void {
    this.accuracy = Math.min(1.0, Math.max(0, this.accuracy + delta));
  }

  getAccuracy(): number {
    return this.accuracy;
  }

  getThoughts(): Thought[] {
    return this.thoughts;
  }

  clearThoughts(): void {
    this.thoughts = [];
  }
}

export class HRMModel {
  private planner: Planner;
  private doer: Doer;
  private trainingEpochs: number = 0;
  private isHierarchyEnabled: boolean = true;

  constructor(plannerAccuracy: number = 0.3, doerAccuracy: number = 0.4) {
    this.planner = new Planner(plannerAccuracy);
    this.doer = new Doer(doerAccuracy);
  }

  step(state: GameState, isTraining: boolean = false): { action: Action, subGoal: SubGoal } {
    // Select subgoal (planner)
    const subGoal = this.isHierarchyEnabled 
      ? this.planner.selectSubGoal(state, isTraining)
      : 'GoToDoor'; // Default if hierarchy disabled


    // Select action (doer)
    const action = this.doer.selectAction(state, subGoal, isTraining);

    return { action, subGoal };
  }

  train(episodes: number = 5): void {
    // Simulate training by improving accuracy
    const plannerImprovement = 0.15 * episodes;
    const doerImprovement = 0.12 * episodes;

    this.planner.improveAccuracy(plannerImprovement);
    this.doer.improveAccuracy(doerImprovement);
    this.trainingEpochs += episodes;
  }

  getWeights(): ModelWeights {
    return {
      plannerAccuracy: this.planner.getAccuracy(),
      doerAccuracy: this.doer.getAccuracy(),
      explorationRate: Math.max(0.1, 1.0 - this.trainingEpochs * 0.1)
    };
  }

  getAllThoughts(): Thought[] {
    return [...this.planner.getThoughts(), ...this.doer.getThoughts()]
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  clearThoughts(): void {
    this.planner.clearThoughts();
    this.doer.clearThoughts();
  }

  setHierarchyEnabled(enabled: boolean): void {
    this.isHierarchyEnabled = enabled;
  }

  freezePlanner(freeze: boolean): void {
    // In a real implementation, this would prevent planner updates
    // For visualization, we'll just set accuracy to 0 or restore it
    if (freeze) {
      this.planner = new Planner(0);
    }
  }

  freezeDoer(freeze: boolean): void {
    // In a real implementation, this would prevent doer updates
    // For visualization, we'll just set accuracy to 0 or restore it
    if (freeze) {
      this.doer = new Doer(0);
    }
  }

  reset(): void {
    this.planner = new Planner(0.3);
    this.doer = new Doer(0.4);
    this.trainingEpochs = 0;
  }
}