import { Character, GameState, Phase } from '~/types'
import { GameEngine } from '..'

describe('Player', () => {
  const initialState: GameState = {
    turn: 1,
    phase: Phase.Upkeep,
    players: [],
    currentPlayer: 0,
  }

  const character: Character = {
    name: 'Dummy',
    skills: [],
  }

  const engine = new GameEngine()

  test('should be able to add a player', () => {
    const state = engine.execute(initialState, {
      type: 'add-player',
      player: {
        name: 'Mike',
        character,
        health: 50,
        combatPoints: 2,
        statusEffects: [],
        hand: [],
        maxHandSize: 6,
      },
    })

    expect(state.players).toHaveLength(1)
    expect(state.players[0].name).toBe('Mike')
  })
})
