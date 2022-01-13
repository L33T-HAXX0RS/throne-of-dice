import { Result } from '@utility/common/result'
import { Action, Error, GameState, Phase } from './types'

export interface IGameEngine {
  execute(state: GameState, action: Action): Result<GameState, Error>
}

export class GameEngine implements IGameEngine {
  execute(state: GameState, action: Action): Result<GameState, Error> {
    switch (action.type) {
      case 'add-player':
        return Result.Ok({
          ...state,
          players: [...state.players, action.player],
        })

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
        return Result.Ok({
          ...state,
          phase: nextPhase,
          turn: nextPhase === phaseOrder[0] ? state.turn + 1 : state.turn,
        })
      }

      case 'force-next-turn':
        return Result.Ok({
          ...state,
          turn: state.turn + 1,
          phase: Phase.Upkeep,
        })
    }
    return Result.Ok(state)
  }
}
