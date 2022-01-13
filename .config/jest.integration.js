module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '~(.*)': '<rootDir>/../src$1',
    '@access/common(.*)': '<rootDir>/../../../access/common/src$1',
    '@access/task(.*)': '<rootDir>/../../../access/task/src$1',
    '@engine/validation(.*)': '<rootDir>/../../../engine/validation/src$1',
    '@manager/administration(.*)':
      '<rootDir>/../../../manager/administration/src$1',
    '@manager/new-server(.*)': '<rootDir>/../../../manager/new-server/src$1',
    '@utility/common(.*)': '<rootDir>/../../../utility/common/src$1',
  },
}
