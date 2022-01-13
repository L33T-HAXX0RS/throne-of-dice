export enum RollType {
  Offensive,
  Defensive,
}

export interface Skill {
  name: string
}

export interface StatusEffect {
  name: string
}

export interface Character {
  name: string
  skills: Skill[]
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
      type: 'force-next-phase'
    }
  | {
      type: 'add-player'
      player: Player
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
