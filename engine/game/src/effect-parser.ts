import { integer } from 'parsnip-ts/numbers'
import { constant, Parser, regexp, text } from 'parsnip-ts/parser'
import { createToken } from 'parsnip-ts/token'
import { ws } from 'parsnip-ts/whitespace'

export type Effect =
  | {
      type: 'deal-dmg'
      damage: number
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
const dmg = token(/dmg/y)

const dealXdmg: Parser<Effect> = deal
  .and(integer)
  .bind((x) => dmg.and(constant(x)))
  .map((x) => ({
    type: 'deal-dmg',
    damage: x,
  }))

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
