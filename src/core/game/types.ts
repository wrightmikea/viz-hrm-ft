export type Position = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type Action = 'Left' | 'Right' | 'Pick' | 'Open';

export type SubGoal = 'GoToKey' | 'GoToDoor' | 'OpenDoor';

export interface GameState {
  agentPos: Position;
  keyPos: Position;
  doorPos: Position;
  hasKey: boolean;
  doorOpen: boolean;
  steps: number;
  maxSteps: number;
  reward: number;
  isComplete: boolean;
  isFailed: boolean;
  worldSize: number;
}

export interface ActionResult {
  success: boolean;
  newState: GameState;
  reward: number;
  message?: string;
}

export interface Episode {
  id: string;
  states: GameState[];
  actions: Action[];
  subGoals: SubGoal[];
  rewards: number[];
  totalReward: number;
  success: boolean;
  optimalSteps?: number;
}

export interface TrainingExample {
  state: GameState;
  subGoal: SubGoal;
  action: Action;
  reward: number;
}