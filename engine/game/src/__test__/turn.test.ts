import { GameState, Phase } from '~/types'
import { GameEngine } from '..'

describe('Turns', () => {
  const initialState: GameState = {
    turn: 1,
    phase: Phase.Upkeep,
    players: [],
    currentPlayer: 0,
  }
  const engine = new GameEngine()
  test('should increment turn with force-next-turn', () => {
    expect(initialState.turn).toBe(1)
    let state = engine.execute(initialState, {
      type: 'force-next-turn',
    })
    expect(state.turn).toBe(2)
    state = engine.execute(state, {
      type: 'force-next-turn',
    })
    expect(state.turn).toBe(3)
  })

  test('should reset to upkeep phase on new turn', () => {
    let state = { ...initialState, phase: Phase.Main1 }
    state = engine.execute(state, {
      type: 'force-next-turn',
    })
    expect(state.phase).toBe(Phase.Upkeep)
  })
})
