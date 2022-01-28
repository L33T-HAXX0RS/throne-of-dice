export type PlayerType = 'target' | 'active'

export enum RollType {
  Offensive,
  Defensive,
}

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6
export type DieType = string
export type DieTypes = [DieType, DieType, DieType, DieType, DieType, DieType]

export type DicePattern = DieType[] | 'small-straight' | 'large-straight'

export interface RollMatch {
  partial: boolean
  pattern: DicePattern
}

export type OffensiveAbility =
  | {
      name: string
      pattern: DicePattern
      effects: string[]
    }
  | {
      name: string
      variants: AbilityVariant[]
    }

export const hasVariants = (
  ability: OffensiveAbility,
): ability is OffensiveAbility & { variants: AbilityVariant[] } =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Array.isArray((ability as any).variants)
export const hasEffects = (
  ability: OffensiveAbility,
): ability is OffensiveAbility & { effects: string[] } =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Array.isArray((ability as any).effects)

export interface DefensiveAbility {
  name: string
  numOfDice: number
  effects: string[]
}

export interface UltimateAbility {
  name: string
  effects: string[]
}

export interface AbilityVariant {
  pattern: DicePattern
  effects: string[]
}

export interface StatusEffect {
  name: string
  type: 'positive' | 'negative'
  stackLimit: number
  spendable: boolean
  effects: string[]
}

export interface Character {
  name: string
  dieTypes: DieTypes
  abilities: {
    offensive: OffensiveAbility[]
    defensive: DefensiveAbility[]
    ultimate: UltimateAbility
  }
  statusEffects: StatusEffect[]
}

export interface Card {
  name: string
  description: string
  cost: number
}

export interface Player {
  name: string
  character: Character
  health: number
  combatPoints: number
  statusEffects: StatusEffect[]
  hand: Card[]
  maxHandSize: number
  rollsThisPhase: number
}

export type Action =
  | {
      type: 'roll'
      player: number
      rollType: RollType
    }
  | {
      type: 'main-phase-action-card'
      player: number
    }
  | {
      type: 'roll-phase-action-card'
      player: number
    }
  | {
      type: 'instant-action-card'
      player: number
    }
  | {
      type: 'add-player'
      player: Player
    }
  | {
      type: 'force-next-phase'
    }
  | {
      type: 'force-next-turn'
    }

export type Error =
  | {
      errorType: 'main-phase-card-on-roll-phase'
      message: 'Cannot play Main phase cards during the Roll phase'
    }
  | {
      errorType: 'roll-phase-card-on-main-phase'
      message: 'Cannot play Roll phase cards during the Main phase'
    }

export enum Phase {
  Upkeep = 'Upkeep',
  Income = 'Income',
  Main1 = 'Main (1)',
  OffensiveRoll = 'Offensive Roll',
  TargetingRoll = 'Targeting Roll',
  DefensiveRoll = 'Defensive Roll',
  Main2 = 'Main (2)',
  Discard = 'Discard',
}

export interface GameState {
  turn: number
  phase: Phase
  players: Player[]
  currentPlayer: number
}
