import { Action, GameState, Phase } from './types'

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

      case 'force-next-phase': {
        const phaseOrder = [
          Phase.Upkeep,
          Phase.Income,
          Phase.Main1,
          Phase.OffensiveRoll,
          Phase.TargetingRoll,
          Phase.DefensiveRoll,
          Phase.Main2,
          Phase.Discard,
        ]
        const nextPhase =
          phaseOrder[(phaseOrder.indexOf(state.phase) + 1) % phaseOrder.length]
        return {
          ...state,
          phase: nextPhase,
          turn: nextPhase === phaseOrder[0] ? state.turn + 1 : state.turn,
        }
      }

      case 'force-next-turn':
        return {
          ...state,
          turn: state.turn + 1,
          phase: Phase.Upkeep,
        }
    }
    return state
  }
}
