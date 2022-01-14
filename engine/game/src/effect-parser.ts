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

const dealXdmg: Parser<Effect> = deal.and(multiplier).bind(
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

const gainXStatusEffect: Parser<Effect> = gain.and(integer).bind((count) =>
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

export const effectParser = dealXdmg
  .or(gainXStatusEffect)
  .or(inflictStatusEffect)
