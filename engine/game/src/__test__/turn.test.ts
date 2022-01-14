import { GameState, Phase } from '~/types'
import { GameEngine } from '..'
import { expectOk } from './util'

describe('Turns', () => {
  const initialState: GameState = {
    turn: 1,
    phase: Phase.Upkeep,
    players: [
      {
        name: 'Bruce',
        character: {
          name: 'Batman',
          dieTypes: ['a', 'b', 'c', 'd', 'e', 'f'],
          abilities: [],
          statusEffects: [],
        },
        health: 50,
        combatPoints: 2,
        statusEffects: [],
        hand: [],
        maxHandSize: 6,
        rollsThisPhase: 0,
      },
      {
        name: 'Dick',
        character: {
          name: 'Robin',
          dieTypes: ['a', 'b', 'c', 'd', 'e', 'f'],
          abilities: [],
          statusEffects: [],
        },
        health: 50,
        combatPoints: 2,
        statusEffects: [],
        hand: [],
        maxHandSize: 6,
        rollsThisPhase: 0,
      },
      {
        name: 'Clark',
        character: {
          name: 'Superman',
          dieTypes: ['a', 'b', 'c', 'd', 'e', 'f'],
          abilities: [],
          statusEffects: [],
        },
        health: 50,
        combatPoints: 2,
        statusEffects: [],
        hand: [],
        maxHandSize: 6,
        rollsThisPhase: 0,
      },
      {
        name: 'Diana',
        character: {
          name: 'Wonder Woman',
          dieTypes: ['a', 'b', 'c', 'd', 'e', 'f'],
          abilities: [],
          statusEffects: [],
        },
        health: 50,
        combatPoints: 2,
        statusEffects: [],
        hand: [],
        maxHandSize: 6,
        rollsThisPhase: 0,
      },
    ],
    currentPlayer: 0,
  }
  const engine = new GameEngine()
  test('should increment turn with force-next-turn', () => {
    expect(initialState.turn).toBe(1)
    let state = expectOk(
      engine.execute(initialState, {
        type: 'force-next-turn',
      }),
    )
    expect(state.turn).toBe(2)
    state = expectOk(
      engine.execute(state, {
        type: 'force-next-turn',
      }),
    )
    expect(state.turn).toBe(3)
  })

  test('should reset to upkeep phase on new turn', () => {
    let state = { ...initialState, phase: Phase.Main1 }
    state = expectOk(
      engine.execute(state, {
        type: 'force-next-turn',
      }),
    )
    expect(state.phase).toBe(Phase.Upkeep)
  })

  test('should switch players', () => {
    expect(initialState.currentPlayer).toBe(0)

    let state = expectOk(
      engine.execute(initialState, {
        type: 'force-next-turn',
      }),
    )
    expect(state.currentPlayer).toBe(1)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-turn',
      }),
    )
    expect(state.currentPlayer).toBe(2)

    state = expectOk(
      engine.execute(state, {
        type: 'force-next-turn',
      }),
    )
    expect(state.currentPlayer).toBe(3)

    // Loops around to the first player
    state = expectOk(
      engine.execute(state, {
        type: 'force-next-turn',
      }),
    )
    expect(state.currentPlayer).toBe(0)
  })
})
