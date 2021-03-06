import { integer } from 'parsnip-ts/numbers'
import { constant, maybe, Parser, regexp, text } from 'parsnip-ts/parser'
import { createToken } from 'parsnip-ts/token'
import { ws } from 'parsnip-ts/whitespace'
import { Phase, PlayerType } from './types'

type Multiplier = {
  value: number
  statusEffect: string | null
  die: string | null
}

export type Effect =
  | {
      type: 'deal-damage'
      damageType: 'normal' | 'collateral' | 'undefendable'
      damage: number
      statusMultiplier: string | null
      dieMultiplier: string | null
      removedStatusMultipler: string | null
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
  | {
      type: 'remove-up-to-n-status-effects'
      statusEffect: string
      count: number
    }
  | {
      type: 'heal'
      multiplier: Multiplier
    }
  | {
      type: 'roll'
      count: number
    }
  | {
      type: 'deal-dmg-equal-to-roll'
      damage: boolean
    }
  | {
      type: 'if-roll-value'
      comparison: '>='
      effect: Effect
    }
  | {
      type: 'receive-damage-in-return'
      count: number
    }
  | {
      type: 'player-may-take-no-actions'
      player: PlayerType
    }
  | {
      type: 'after-attack'
      effect: Effect
    }
  | {
      type: 'move-player-to-phase'
      playerType: PlayerType
      phase: Phase
    }
  | {
      type: 'skip-next-phase'
      phase: Phase
    }

const token = createToken(ws)
const tagged = <T>(parser: Parser<T>) =>
  token(/{/y)
    .and(parser)
    .bind((result) => token(/}/y).and(constant(result)))

const statusEffect = tagged(text('status:').and(regexp(/[^}]+/y)))
const die = tagged(text('die:').and(regexp(/[^}]+/y)))
const player = tagged(text('player:').and(regexp(/target|active/y))).map(
  (playerType) => playerType as PlayerType,
)
const phase = tagged(
  text('phase:').and(
    regexp(
      /Upkeep|Income|(Main( \(1|2\)))|((Offensive|Targeting|Defensive)( Roll)?)|Discard/iy,
    ),
  ),
).map((phaseType) => {
  switch (phaseType.toLowerCase()) {
    case 'upkeep':
      return Phase.Upkeep

    case 'income':
      return Phase.Income

    case 'main (1)':
      return Phase.Main1

    case 'offensive':
    case 'offensive roll':
      return Phase.OffensiveRoll

    case 'targeting':
    case 'targeting roll':
      return Phase.TargetingRoll

    case 'defensive':
    case 'defensive roll':
      return Phase.DefensiveRoll

    case 'main (2)':
      return Phase.Main2

    case 'discard':
      return Phase.Discard
  }

  throw new Error(`Unhandled phase type: ${phaseType}`)
})

const deal = token(/Deal/iy)
const gain = token(/Gain/iy)
const inflict = token(/Inflict/iy)
const collateral = token(/collateral/y)
const undefendable = token(/undefendable/y)
const dmg = token(/dmg/y)

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

const perRemovedStatusEffect = token(/per removed/iy).and(statusEffect)

const dealDamage: Parser<Effect> = deal.and(multiplier).bind(
  (multiplier): Parser<Effect> =>
    collateral
      .or(undefendable)
      .or(constant('normal'))
      .bind((damageType) =>
        dmg
          .and(maybe(perRemovedStatusEffect))
          .map((removedStatusMultipler) => ({
            type: 'deal-damage',
            damageType: damageType as 'collateral' | 'undefendable' | 'normal',
            damage: multiplier.value,
            statusMultiplier: multiplier.statusEffect,
            dieMultiplier: multiplier.die,
            removedStatusMultipler,
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

const heal: Parser<Effect> = token(/Heal/iy)
  .and(multiplier)
  .map((multiplier) => ({ type: 'heal', multiplier }))

const basicEffect = dealDamage
  .or(gainStatusEffect)
  .or(inflictStatusEffect)
  .or(heal)

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
      .and(addDamage.or(basicEffect))
      .map((effect) => ({
        type: 'on-die',
        dieType,
        effect,
      })),
  )

const removeUpToNStatusEffects: Parser<Effect> = token(/Remove up to/iy)
  .and(integer)
  .bind((count) =>
    statusEffect.map((statusEffect) => ({
      type: 'remove-up-to-n-status-effects',
      statusEffect,
      count,
    })),
  )

const rollNDice: Parser<Effect> = token(/Roll/iy)
  .and(integer)
  .bind((count) =>
    token(/{(die|dice)}/iy).map(() => ({
      type: 'roll',
      count,
    })),
  )

const dealDmgEqualToRoll: Parser<Effect> = token(
  /Deal dmg equal to {roll:total}/iy,
).map(() => ({
  type: 'deal-dmg-equal-to-roll',
  damage: true,
}))

const ifRoll: Parser<Effect> = token(/If {roll:total} is at least/iy)
  .and(integer)
  .bind((count) =>
    token(/,/iy)
      .and(basicEffect)
      .map((effect) => ({
        type: 'if-roll-value',
        comparison: '>=',
        count,
        effect,
      })),
  )

const receiveDamageInReturn: Parser<Effect> = token(/receive/iy)
  .and(integer)
  .bind((count) =>
    token(/dmg in return/iy).map(() => ({
      type: 'receive-damage-in-return',
      count,
    })),
  )

const playerMayTakeNoActions: Parser<Effect> = player.bind((player) =>
  token(/may take no actions/iy).map(() => ({
    type: 'player-may-take-no-actions',
    player,
  })),
)

const afterAttack: Parser<Effect> = token(/After attack concludes,/iy)
  .and(basicEffect)
  .map((effect) => ({
    type: 'after-attack',
    effect,
  }))

const playerEntersPhase: Parser<Effect> = player.bind((playerType) =>
  token(/enters/iy)
    .and(phase)
    .map(
      (phase): Effect => ({
        type: 'move-player-to-phase',
        playerType,
        phase,
      }),
    ),
)

// TODO: Rework parsers for better grouping and allow for recursive effects
export const effectParser = onDie
  .or(removeUpToNStatusEffects)
  .or(rollNDice)
  .or(dealDmgEqualToRoll)
  .or(ifRoll)
  .or(receiveDamageInReturn)
  .or(playerMayTakeNoActions)
  .or(afterAttack)
  .or(playerEntersPhase)
  .or(basicEffect)
