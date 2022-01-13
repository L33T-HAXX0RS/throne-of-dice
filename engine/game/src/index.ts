export interface GameState {}

export interface Action {}

export interface IGameEngine {
  execute(state: GameState, action: Action): GameState
}

export class GameEngine implements IGameEngine {
  execute(state: GameState, action: Action): GameState {
    return state
  }
}
