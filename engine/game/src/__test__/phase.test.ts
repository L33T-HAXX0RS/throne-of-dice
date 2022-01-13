import { GameState, Phase } from '~/types'
import { GameEngine } from '..'

describe('Phases', () => {
  const initialState: GameState = {
    turn: 1,
    phase: Phase.Upkeep,
    players: [],
    currentPlayer: 0,
  }

  const engine = new GameEngine()
  test('force-next-phase will move to the next phase', () => {
    expect(initialState.phase).toBe(Phase.Upkeep)
    let state = engine.execute(initialState, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.Income)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.Main1)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.OffensiveRoll)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.TargetingRoll)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.DefensiveRoll)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.Main2)

    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.Discard)

    // Loops over and starts next turn
    state = engine.execute(state, {
      type: 'force-next-phase',
    })
    expect(state.phase).toBe(Phase.Upkeep)
  })

  test('should increment turn after discard phase', () => {
    let state = { ...initialState, phase: Phase.Discard }
    expect(state.turn).toBe(1)
    state = engine.execute(state, {
      type: 'force-next-phase',
    })

    expect(state.turn).toBe(2)
  })
})
