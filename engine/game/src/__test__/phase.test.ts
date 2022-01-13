import { GameState, Phase } from '~/types'
import { GameEngine } from '..'
import { expectOk } from './util'

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
    let state = expectOk(
      engine.execute(initialState, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.Income)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.Main1)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.OffensiveRoll)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.TargetingRoll)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.DefensiveRoll)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.Main2)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.Discard)

    // Loops over and starts next turn
    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )
    expect(state.phase).toBe(Phase.Upkeep)
  })

  test('should increment turn after discard phase', () => {
    let state = { ...initialState, phase: Phase.Discard }
    expect(state.turn).toBe(1)
    state = expectOk(
      engine.execute(state, {
        type: 'force-next-phase',
      }),
    )

    expect(state.turn).toBe(2)
  })
})
