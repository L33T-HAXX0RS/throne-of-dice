export const stripIndentation = (
  template: TemplateStringsArray,
  ...args: unknown[]
): string => {
  let result = ''

  // Insert interpolated values
  for (let i = 0; i < args.length; i++) {
    result += template[i] + String(args[i])
  }
  result += template[template.length - 1]

  // Strip indentation
  const lines = result.split('\n')
  const minimumIndent = lines.reduce((minimumIndent, line) => {
    const match = line.match(/^(\s+)\S+/)
    if (!match) {
      return minimumIndent
    }

    return Math.min(minimumIndent, match[1]?.length ?? minimumIndent)
  }, Infinity)

  if (minimumIndent < Infinity) {
    result = lines
      .map((line) => (line[0] === ' ' ? line.slice(minimumIndent) : line))
      .join('\n')
  }

  return result.trim()
}
