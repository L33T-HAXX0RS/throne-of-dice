import { Character } from '~/types'

export const topDollarCharacter: Character = {
  name: 'Top Dollar',
  dieTypes: ['fire', 'fire', 'fire', 'gas', 'gas', 'match'],
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
  abilities: [
    {
      name: 'Fireball',
      type: 'offensive',
      variants: [
        {
          pattern: ['fire', 'fire', 'fire'],
          effects: [
            {
              type: 'damage',
              damage: 4,
            },
          ],
        },
        {
          pattern: ['fire', 'fire', 'fire', 'fire'],
          effects: [
            {
              type: 'damage',
              damage: 6,
            },
          ],
        },
        {
          pattern: ['fire', 'fire', 'fire', 'fire', 'fire'],
          effects: [
            {
              type: 'damage',
              damage: 8,
            },
          ],
        },
      ],
      effects: [
        {
          type: 'increment-status-effect',
          statusEffect: 'Pyro Mastery',
          target: 'self',
        },
      ],
    },
    {
      name: 'Burnt Out',
      type: 'offensive',
      variants: [{ pattern: ['gas', 'gas'] }],
      effects: [
        {
          type: 'give-x-status-effect-by-existing-roll',
          target: 'self',
          statusEffect: 'Pyro Mastery',
          multiplier: 2,
          dieType: 'gas',
        },
        {
          type: 'collateral-damage-multiplied-by-status-effect',
          damage: 1,
          statusEffect: 'Pyro Mastery',
        },
      ],
    },
  ],
}
