export enum RollType {
  Offensive,
  Defensive,
}

export type AbilityType = 'passive' | 'offensive' | 'defensive' | 'ultimate'

export type DieValue = 1 | 2 | 3 | 4 | 5 | 6
export type DieType = string
export type DieTypes = [DieType, DieType, DieType, DieType, DieType, DieType]

export type DicePattern = DieType[] | 'small-straight' | 'large-straight'

export interface RollMatch {
  partial: boolean
  pattern: DicePattern
}

export type Effect =
  | {
      type: 'increment-status-effect'
      statusEffect: string
      target: 'self' | 'other' | 'all'
    }
  | {
      type: 'give-x-status-effect-by-existing-roll'
      target: 'self' | 'other' | 'all'
      statusEffect: string
      multiplier: number
      dieType: DieType
    }
  | {
      type: 'damage'
      damage: number
    }
  | {
      type: 'collateral-damage-multiplied-by-status-effect'
      damage: number
      statusEffect: string
    }

export interface Ability {
  name: string
  type: AbilityType
  variants: AbilityVariant[]
  effects?: Effect[]
}

export interface AbilityVariant {
  pattern: DicePattern
  effects?: Effect[]
}

export interface StatusEffect {
  name: string
  type: 'positive' | 'negative'
  stackLimit: number
  effect: 'TODO'
}

export interface Character {
  name: string
  dieTypes: DieTypes
  abilities: Ability[]
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
