import { cKeywords, operators, symbols } from './keywords'

export function analyzeCode(code) {
  const lines = code.split('\n')
  const tokens = []
  const errors = []

  // Updated to also detect double-quoted strings
  const tokenRegex = /"[^"]*"|\b[_a-zA-Z][_a-zA-Z0-9]*\b|[0-9]+|==|!=|>=|<=|>>|<<|[+\-*/%=&|^~<>!;{},()[\]]/g

  lines.forEach((line, lineNum) => {
    const matches = [...line.matchAll(tokenRegex)]

    let lastIndex = 0

    matches.forEach(match => {
      const value = match[0]
      const index = match.index

      // Detect unrecognized characters between matches
      if (index > lastIndex) {
        const unknown = line.slice(lastIndex, index).trim()
        if (unknown.length > 0) {
          errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
          tokens.push({ type: 'unknown', value: unknown })
        }
      }

      let type = 'identifier'

      if (value.startsWith('"') && value.endsWith('"')) {
        type = 'string'
      } else if (cKeywords.includes(value)) {
        type = 'keyword'
      } else if (!isNaN(value)) {
        type = 'number'
      } else if (operators.includes(value)) {
        type = 'operator'
      } else if (symbols.includes(value)) {
        type = 'symbol'
      }

      tokens.push({ type, value })
      lastIndex = index + value.length
    })

    // Check for leftovers after the last match
    if (lastIndex < line.length) {
      const unknown = line.slice(lastIndex).trim()
      if (unknown.length > 0) {
        errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
        tokens.push({ type: 'unknown', value: unknown })
      }
    }

    // Handle unclosed string literals
    const quoteMatches = line.match(/"/g)
    if (quoteMatches && quoteMatches.length % 2 !== 0) {
      errors.push(`Unclosed string literal on line ${lineNum + 1}`)
    }
  })

  return { tokens, errors }
}
