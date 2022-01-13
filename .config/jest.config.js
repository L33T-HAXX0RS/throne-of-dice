module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src', 'test'],
  moduleNameMapper: {
    '@access/common(.*)': '<rootDir>/../../access/common/src$1',
    '@access/task(.*)': '<rootDir>/../../access/task/src$1',
    '@engine/game(.*)': '<rootDir>/../../engine/game/src$1',
    '@engine/validation(.*)': '<rootDir>/../../engine/validation/src$1',
    '@manager/administration(.*)':
      '<rootDir>/../../manager/administration/src$1',
    '@manager/new-server(.*)': '<rootDir>/../../manager/new-server/src$1',
    '@utility/common(.*)': '<rootDir>/../../utility/common/src$1',
    '~(.*)': '<rootDir>/src$1',
  },
}
