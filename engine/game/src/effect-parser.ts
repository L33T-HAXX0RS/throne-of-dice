import { integer } from 'parsnip-ts/numbers'
import { constant, Parser, regexp, text } from 'parsnip-ts/parser'
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

const deal = token(/Deal/iy)
const gain = token(/Gain/iy)
const inflict = token(/Inflict/iy)
const collateral = token(/collateral/y)
const undefendable = token(/undefendable/y)
const dmg = token(/dmg/y)

const dealXdmg: Parser<Effect> = deal.and(integer).bind(
  (damage): Parser<Effect> =>
    collateral
      .or(undefendable)
      .or(constant('normal'))
      .bind((damageType) =>
        dmg.map(() => ({
          type: 'deal-damage',
          damageType: damageType as 'collateral' | 'undefendable' | 'normal',
          damage,
          statusMultiplier: null,
          dieMultiplier: null,
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
