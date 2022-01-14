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
})
