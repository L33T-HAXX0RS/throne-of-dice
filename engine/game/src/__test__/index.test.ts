import { GameEngine } from '..'

describe('GameEngine', () => {
  test('should be able to initialize an instance', () => {
    expect(new GameEngine()).toBeInstanceOf(GameEngine)
  })
})
