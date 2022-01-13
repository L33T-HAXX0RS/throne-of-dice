import { Action, GameState } from './types'

export interface IGameEngine {
  execute(state: GameState, action: Action): GameState
}

export class GameEngine implements IGameEngine {
  execute(state: GameState, action: Action): GameState {
    switch (action.type) {
      case 'add-player':
        return {
          ...state,
          players: [...state.players, action.player],
        }
    }
    return state
  }
}
