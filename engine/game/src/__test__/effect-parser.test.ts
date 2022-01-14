import { ParseError } from 'parsnip-ts/error'
import { Effect, effectParser } from '~/effect-parser'

function assertSuccessfulParse<T>(result: T | ParseError): asserts result is T {
  if (result instanceof ParseError) {
    throw result
  }
}

function assertEffectType<T extends Effect['type']>(
  effect: Effect,
  type: T,
): asserts effect is Effect & { type: T } {
  expect(effect.type).toBe(type)
}

describe('effectParser', () => {
  test('should be able to parse "Deal X dmg"', () => {
    let result = effectParser.parseToEnd('Deal 4 dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(4)

    result = effectParser.parseToEnd('Deal 5 dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(5)

    result = effectParser.parseToEnd('Deal 12 dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(12)
  })

  test('should be able to parse "Deal X collateral dmg"', () => {
    let result = effectParser.parseToEnd('Deal 2 collateral dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('collateral')
    expect(result.damage).toBe(2)

    result = effectParser.parseToEnd('Deal 20 collateral dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('collateral')
    expect(result.damage).toBe(20)
  })

  test('should be able to parse "Deal X undefendable dmg"', () => {
    let result = effectParser.parseToEnd('Deal 2 undefendable dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('undefendable')
    expect(result.damage).toBe(2)

    result = effectParser.parseToEnd('Deal 20 undefendable dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('undefendable')
    expect(result.damage).toBe(20)
  })

  test('should be able to parse "Deal Nx{status:Status Effect} dmg"', () => {
    let result = effectParser.parseToEnd('Deal 1x{status:Pyro Mastery} dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('normal')
    expect(result.statusMultiplier).toBe('Pyro Mastery')
    expect(result.damage).toBe(1)

    result = effectParser.parseToEnd('Deal 50x{status:Pyro Mastery} dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('normal')
    expect(result.statusMultiplier).toBe('Pyro Mastery')
    expect(result.damage).toBe(50)
  })

  test('should be able to parse "Deal Nx{status:Status Effect} collateral dmg"', () => {
    const result = effectParser.parseToEnd(
      'Deal 1x{status:Pyro Mastery} collateral dmg',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('collateral')
    expect(result.statusMultiplier).toBe('Pyro Mastery')
    expect(result.damage).toBe(1)
  })

  test('should be able to parse "Deal Nx{status:Status Effect} undefendable dmg"', () => {
    const result = effectParser.parseToEnd(
      'Deal 1x{status:Pyro Mastery} undefendable dmg',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('undefendable')
    expect(result.statusMultiplier).toBe('Pyro Mastery')
    expect(result.damage).toBe(1)
  })

  test('should be able to parse "Deal Nx{die:Die Type} dmg"', () => {
    let result = effectParser.parseToEnd('Deal 2x{die:Fire} dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('normal')
    expect(result.dieMultiplier).toBe('Fire')
    expect(result.damage).toBe(2)

    result = effectParser.parseToEnd('Deal 20x{die:Fire} dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('normal')
    expect(result.dieMultiplier).toBe('Fire')
    expect(result.damage).toBe(20)
  })

  test('should be able to parse "Deal Nx{die:Die Type} collateral dmg"', () => {
    const result = effectParser.parseToEnd('Deal 2x{die:Fire} collateral dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('collateral')
    expect(result.dieMultiplier).toBe('Fire')
    expect(result.damage).toBe(2)
  })

  test('should be able to parse "Deal Nx{die:Die Type} undefendable dmg"', () => {
    const result = effectParser.parseToEnd('Deal 2x{die:Fire} undefendable dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damageType).toBe('undefendable')
    expect(result.dieMultiplier).toBe('Fire')
    expect(result.damage).toBe(2)
  })

  test('should be able to parse "Deal X dmg per removed {status:Status Effect}"', () => {
    const result = effectParser.parseToEnd(
      'Deal 3 dmg per removed {status:Chi}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(3)
    expect(result.damageType).toBe('normal')
    expect(result.removedStatusMultipler).toBe('Chi')
  })

  test('should be able to parse "Deal X (undefendable|collateral) dmg per removed {status:Status Effect}"', () => {
    let result = effectParser.parseToEnd(
      'Deal 3 collateral dmg per removed {status:Chi}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(3)
    expect(result.damageType).toBe('collateral')
    expect(result.removedStatusMultipler).toBe('Chi')

    result = effectParser.parseToEnd(
      'Deal 3 undefendable dmg per removed {status:Chi}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'deal-damage')
    expect(result.damage).toBe(3)
    expect(result.damageType).toBe('undefendable')
    expect(result.removedStatusMultipler).toBe('Chi')
  })

  test('should be able to parse "Gain X {status:Status Effect}"', () => {
    let result = effectParser.parseToEnd('Gain 1 {status:Chi}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'add-status-effect')
    expect(result.target).toBe('self')
    expect(result.statusEffect).toBe('Chi')
    expect(result.count).toBe(1)

    result = effectParser.parseToEnd('Gain 16 {status:Pyro Mastery}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'add-status-effect')
    expect(result.target).toBe('self')
    expect(result.statusEffect).toBe('Pyro Mastery')
    expect(result.count).toBe(16)
  })

  test('should be able to parse "Inflict {status:Status Effect}"', () => {
    let result = effectParser.parseToEnd('Inflict {status:Knockdown}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'add-status-effect')
    expect(result.target).toBe('other')
    expect(result.statusEffect).toBe('Knockdown')
    expect(result.count).toBe(1)

    result = effectParser.parseToEnd('Inflict {status:Git Rekt}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'add-status-effect')
    expect(result.target).toBe('other')
    expect(result.statusEffect).toBe('Git Rekt')
    expect(result.count).toBe(1)
  })

  test('should be able to parse "On {die:Die Type}, add N dmg"', () => {
    let result = effectParser.parseToEnd('On {die:Fire}, add 3 dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'on-die')
    expect(result.dieType).toBe('Fire')

    assertEffectType(result.effect, 'add-damage')
    expect(result.effect.damage).toBe(3)

    result = effectParser.parseToEnd('On {die:Fire}, add 30 dmg')
    assertSuccessfulParse(result)
    assertEffectType(result, 'on-die')
    expect(result.dieType).toBe('Fire')

    assertEffectType(result.effect, 'add-damage')
    expect(result.effect.damage).toBe(30)
  })

  test('should be able to parse "On {die:Die Type}, inflict {status:Status Effect}"', () => {
    const result = effectParser.parseToEnd(
      'On {die:Fire}, inflict {status:Burn}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'on-die')
    expect(result.dieType).toBe('Fire')

    assertEffectType(result.effect, 'add-status-effect')
    expect(result.effect.statusEffect).toBe('Burn')
    expect(result.effect.target).toBe('other')
    expect(result.effect.count).toBe(1)
  })

  test('should be able to parse "On {die:Die Type}, gain N {status:Status Effect}"', () => {
    const result = effectParser.parseToEnd(
      'On {die:Fire}, gain 10 {status:Pyro Mastery}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'on-die')
    expect(result.dieType).toBe('Fire')

    assertEffectType(result.effect, 'add-status-effect')
    expect(result.effect.statusEffect).toBe('Pyro Mastery')
    expect(result.effect.target).toBe('self')
    expect(result.effect.count).toBe(10)
  })

  test('should be able to parse "Remove up to N {status:Status Effect}"', () => {
    const result = effectParser.parseToEnd('Remove up to 4 {status:Purity}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'remove-up-to-n-status-effects')
    expect(result.statusEffect).toBe('Purity')
    expect(result.count).toBe(4)
  })

  test('should be able to parse "Heal N"', () => {
    let result = effectParser.parseToEnd('Heal 1')
    assertSuccessfulParse(result)
    assertEffectType(result, 'heal')
    expect(result.count).toBe(1)

    result = effectParser.parseToEnd('Heal 100')
    assertSuccessfulParse(result)
    assertEffectType(result, 'heal')
    expect(result.count).toBe(100)
  })

  test('should be able to parse "Roll N{die|dice}"', () => {
    let result = effectParser.parseToEnd('Roll 3{dice}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'roll')
    expect(result.count).toBe(3)

    result = effectParser.parseToEnd('Roll 1{die}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'roll')
    expect(result.count).toBe(1)
  })

  test('should be able to parse "Deal dmg equal to {roll:total}"', () => {
    const result = effectParser.parseToEnd('Deal dmg equal to {roll:total}')
    assertSuccessfulParse(result)
    assertEffectType(result, 'equal-to-roll')
    expect(result.damage).toBe(true)
  })

  test('should be able to parse "If {roll:total} is at least N, do effect"', () => {
    const result = effectParser.parseToEnd(
      'If {roll:total} is at least 15, inflict {status:Knockdown}',
    )
    assertSuccessfulParse(result)
    assertEffectType(result, 'if-roll-value')
    expect(result.comparison).toBe('>=')
    assertEffectType(result.effect, 'add-status-effect')
    expect(result.effect.statusEffect).toBe('Knockdown')
  })

  test('should be able to parse "receive N dmg in return"', () => {
    const result = effectParser.parseToEnd('Receive 5 dmg in return')
    assertSuccessfulParse(result)
    assertEffectType(result, 'receive-damage-in-return')
    expect(result.count).toBe(5)
  })
})
