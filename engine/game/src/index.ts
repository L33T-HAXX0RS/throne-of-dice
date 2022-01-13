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
        const players = [...state.players]
        players[state.currentPlayer].rollsThisPhase = 0
        const nextState = {
          ...state,
          phase: nextPhase,
          players,
        }
        if (nextPhase === phaseOrder[0]) {
          return this.execute(nextState, { type: 'force-next-turn' })
        }
        return Result.Ok(nextState)
      }

      case 'force-next-turn': {
        const players = [...state.players]
        players[state.currentPlayer].rollsThisPhase = 0
        return Result.Ok({
          ...state,
          turn: state.turn + 1,
          phase: Phase.Upkeep,
          currentPlayer: (state.currentPlayer + 1) % state.players.length,
          players,
        })
      }
    }
    return Result.Ok(state)
  }
}
