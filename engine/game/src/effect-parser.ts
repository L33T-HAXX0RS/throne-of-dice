import { integer } from 'parsnip-ts/numbers'
import { constant, maybe, Parser, regexp, text } from 'parsnip-ts/parser'
import { createToken } from 'parsnip-ts/token'
import { ws } from 'parsnip-ts/whitespace'

export type Effect =
  | {
      type: 'deal-damage'
      damageType: 'normal' | 'collateral' | 'undefendable'
      damage: number
      statusMultiplier: string | null
      dieMultiplier: string | null
    }
  | {
      type: 'add-status-effect'
      target: 'self' | 'other'
      statusEffect: string
      count: number
    }
  | {
      type: 'add-damage'
      damage: number
      statusMultiplier: string | null
      dieMultiplier: string | null
    }
  | {
      type: 'on-die'
      dieType: string
      effect: Effect
    }

const token = createToken(ws)
const tagged = <T>(parser: Parser<T>) =>
  token(/{/y)
    .and(parser)
    .bind((result) => token(/}/y).and(constant(result)))

const statusEffect = tagged(text('status:').and(regexp(/[^}]+/y)))
const die = tagged(text('die:').and(regexp(/[^}]+/y)))

const deal = token(/Deal/iy)
const gain = token(/Gain/iy)
const inflict = token(/Inflict/iy)
const collateral = token(/collateral/y)
const undefendable = token(/undefendable/y)
const dmg = token(/dmg/y)

interface Multiplier {
  value: number
  statusEffect: string | null
  die: string | null
}

const multiplier: Parser<Multiplier> = integer.bind((value) =>
  maybe(
    token(/x/y)
      .and(
        statusEffect
          .map((statusEffect) => ({ statusEffect, die: null }))
          .or(die.map((die) => ({ die, statusEffect: null }))),
      )
      .map(({ statusEffect, die }) => ({
        value,
        statusEffect,
        die,
      })),
  ).map((result) => {
    if (result === null) {
      return { value, statusEffect: null, die: null }
    }
    return result
  }),
)

const dealDamage: Parser<Effect> = deal.and(multiplier).bind(
  (multiplier): Parser<Effect> =>
    collateral
      .or(undefendable)
      .or(constant('normal'))
      .bind((damageType) =>
        dmg.map(() => ({
          type: 'deal-damage',
          damageType: damageType as 'collateral' | 'undefendable' | 'normal',
          damage: multiplier.value,
          statusMultiplier: multiplier.statusEffect,
          dieMultiplier: multiplier.die,
        })),
      ),
)

const gainStatusEffect: Parser<Effect> = gain.and(integer).bind((count) =>
  statusEffect.map((statusEffect) => ({
    type: 'add-status-effect',
    target: 'self',
    statusEffect,
    count,
  })),
)

const inflictStatusEffect: Parser<Effect> = inflict
  .and(statusEffect)
  .map((statusEffect) => ({
    type: 'add-status-effect',
    target: 'other',
    statusEffect,
    count: 1,
  }))

const effect = dealDamage.or(gainStatusEffect).or(inflictStatusEffect)

const addDamage: Parser<Effect> = token(/add/iy)
  .and(multiplier)
  .bind(
    (multiplier): Parser<Effect> =>
      collateral
        .or(undefendable)
        .or(constant('normal'))
        .bind((damageType) =>
          dmg.map(() => ({
            type: 'add-damage',
            damageType: damageType as 'collateral' | 'undefendable' | 'normal',
            damage: multiplier.value,
            statusMultiplier: multiplier.statusEffect,
            dieMultiplier: multiplier.die,
          })),
        ),
  )

const onDie: Parser<Effect> = token(/on/iy)
  .and(die)
  .bind((dieType) =>
    token(/,/y)
      .and(addDamage.or(effect))
      .map((effect) => ({
        type: 'on-die',
        dieType,
        effect,
      })),
  )

export const effectParser = onDie.or(effect)
