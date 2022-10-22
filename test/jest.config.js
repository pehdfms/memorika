module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json'
    }
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  testRegex: '.spec.ts$',
  rootDir: '..',
  roots: ['<rootDir>/test/'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/src/$1',
    '@libs/(.*)': '<rootDir>/src/libs/$1',
    '@configs/(.*)': '<rootDir>/src/configs/$1',
    '@modules/(.*)': '<rootDir>/src/modules/$1'
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: './coverage'
}
