import { Character } from '~/types'

export const emptyCharacter: Character = {
  name: 'Character',
  dieTypes: ['a', 'b', 'c', 'd', 'e', 'f'],
  statusEffects: [],
  abilities: {
    offensive: [],
    defensive: [],
    ultimate: { effects: [] },
  },
}

export const topDollarCharacter: Character = {
  name: 'Top Dollar',
  dieTypes: ['Fire', 'Fire', 'Fire', 'Bonfire', 'Gas', 'Match'],
  statusEffects: [
    {
      name: 'Knockdown',
      type: 'negative',
      stackLimit: 1,
      effect: 'TODO',
    },
    {
      name: 'Burn',
      type: 'negative',
      stackLimit: 1,
      effect: 'TODO',
    },
    {
      name: 'Pyro Mastery',
      type: 'positive',
      stackLimit: 5,
      effect: 'TODO',
    },
    {
      name: 'Stun',
      type: 'negative',
      stackLimit: 1,
      effect: 'TODO',
    },
  ],
  abilities: {
    offensive: [
      {
        name: 'Fireball',
        type: 'offensive',
        variants: [
          {
            pattern: ['Fire', 'Fire', 'Fire'],
            effects: ['Deal 4 dmg'],
          },
          {
            pattern: ['Fire', 'Fire', 'Fire', 'Fire'],
            effects: ['Deal 6 dmg'],
          },
          {
            pattern: ['Fire', 'Fire', 'Fire', 'Fire', 'Fire'],
            effects: ['Deal 8 dmg'],
          },
        ],
        effects: ['Gain 1 {status:Pyro Mastery}'],
      },
      {
        name: 'Burnt Out',
        type: 'offensive',
        variants: [{ pattern: ['Gas', 'Gas'] }],
        effects: [
          'Gain 2x{status:Pyro Mastery}',
          'Deal 1x{status:Pyro Mastery} collateral dmg to all opponents',
        ],
      },
      {
        name: 'Fireblast',
        type: 'offensive',
        variants: [{ pattern: ['Fire', 'Fire', 'Fire', 'Match'] }],
        effects: [
          'Deal 6 dmg',
          'Roll 1 {die}',
          'On {die:fire}, add 3 dmg',
          'On {die:bonfire}, inflict {status:Burn}',
          'On {die:gas}, gain 2 {status:Pyro Mastery}',
          'On {die:match}, inflict {status:Knockdown}',
        ],
      },
      {
        name: 'Combustion',
        type: 'offensive',
        variants: [{ pattern: ['Fire', 'Bonfire', 'Gas', 'Match'] }],
        effects: [
          'Gain 1 {status:Pyro Mastery}',
          'Remove up to 4 {status:Pyro Mastery}',
          'Deal 3 undefendable dmg per removed {status:Pyro Mastery}',
        ],
      },
      {
        name: 'Fire It Up',
        type: 'offensive',
        variants: [{ pattern: 'small-straight' }],
        effects: [
          'Gain 2 {status:Pyro Mastery}',
          'Deal 5 dmg + 1x{status:Pyro Mastery} dmg',
        ],
      },
      {
        name: 'Ignite',
        type: 'offensive',
        variants: [{ pattern: 'large-straight' }],
        effects: [
          'Gain 2 {status:Pyro Mastery}',
          'Deal 4 dmg + 2x{status:Pyro Mastery} dmg',
        ],
      },
      {
        name: 'Air Strike',
        type: 'offensive',
        variants: [{ pattern: ['Match', 'Match', 'Match', 'Match'] }],
        effects: [
          'Inflict {status:Stun}',
          'Gain 2 {status:Pyro Mastery}',
          'Deal 1x{status:Pyro Mastery} undefendable dmg',
          'Deal 2 collateral dmg',
        ],
      },
    ],
    defensive: [
      {
        name: 'Leather Jacket',
        numOfDice: 5,
        effects: [
          'Deal 1x{die:fire} dmg',
          'Gain 1x{die:gas} {status:Pyro Mastery}',
        ],
      },
    ],
    ultimate: {
      effects: [
        'Inflict {status:Knockdown}',
        'Inflict {status:Burn}',
        'Gain 3 {status:Pyro Mastery}',
        'Deal 12 dmg',
        'Deal 2 collateral dmg',
      ],
    },
  },
}
