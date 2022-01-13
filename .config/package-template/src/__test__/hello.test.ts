declare var describe: any // Will be removed during project creation
declare var test: any // Will be removed during project creation
declare var expect: any // Will be removed during project creation
import { sayHello } from '../hello'

describe('sayHello', () => {
  test('should respond with "Hello"', () => {
    expect(sayHello('World')).toBe('Hello World')
  })
})
