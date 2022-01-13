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

export interface Player {
  name: string
  character: Character
  health: number
  combatPoints: number
  statusEffects: StatusEffect[]
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

export interface GameState {
  players: Player[]
  currentPlayer: number
}
