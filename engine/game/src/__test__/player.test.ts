import { GameState, Phase } from '~/types'
import { GameEngine } from '..'
import { emptyCharacter } from './characters.data'
import { expectOk } from './util'

describe('Player', () => {
  const initialState: GameState = {
    turn: 1,
    phase: Phase.Upkeep,
    players: [],
    currentPlayer: 0,
  }

  const engine = new GameEngine()

  test('should be able to add a player', () => {
    const state = expectOk(
      engine.execute(initialState, {
        type: 'add-player',
        player: {
          name: 'Mike',
          character: emptyCharacter,
          health: 50,
          combatPoints: 2,
          statusEffects: [],
          hand: [],
          maxHandSize: 6,
          rollsThisPhase: 0,
        },
      }),
    )

    expect(state.players).toHaveLength(1)
    expect(state.players[0].name).toBe('Mike')
  })
})
