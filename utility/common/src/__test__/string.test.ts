import { stripIndentation } from '../string'

describe('stripIndentation', () => {
  it('should act as an identity function when no line breaks are given', () => {
    const expected = 'hello world'
    const actual = stripIndentation`hello world`
    expect(actual).toBe(expected)
  })

  it('should strip beginning newlines', () => {
    const expected = 'hello\nworld'
    const actual = stripIndentation`


hello\nworld`
    expect(actual).toBe(expected)
  })

  it('should strip ending newlines', () => {
    const expected = 'hello world'
    const actual = stripIndentation`hello world


`
    expect(actual).toBe(expected)
  })

  it('should allow new lines in the middle of the string', () => {
    const expected = 'hello\n\nworld'
    const actual = stripIndentation`

hello

world

`
    expect(actual).toBe(expected)
  })

  it('should remove indentation from first line', () => {
    const expected = 'hello world'
    const actual = stripIndentation`
      hello world
`
    expect(actual).toBe(expected)
  })

  it('should use minimal indentation when multiple lines are present', () => {
    const expected = `a
  b
    c
      d
    e
  f`
    const actual = stripIndentation`
    a
      b
        c
          d
        e
      f
  `
    expect(actual).toBe(expected)
  })

  it('should trim all whitespace at either end', () => {
    const expected = 'hello world'
    const actual = stripIndentation`

      \t
      hello world

      \t
    `
    expect(actual).toBe(expected)
  })
})
