import { cKeywords, operators, symbols } from './keywords'

export function analyzeCode(code) {
  // Remove comments first (handles both // and /* */)
  const withoutComments = code
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//gm, '') // Remove multi-line comments

  const lines = withoutComments.split('\n')
  const tokens = []
  const errors = []

  // Regex supports:
  // - Strings (including across multiple lines as handled before split)
  // - Identifiers
  // - Numbers
  // - Operators & symbols
  const tokenRegex = /"([^"\\]|\\.)*"|\b[_a-zA-Z][_a-zA-Z0-9]*\b|[0-9]+|==|!=|>=|<=|>>|<<|[+\-*/%=&|^~<>!;{},()[\]]/g

  lines.forEach((line, lineNum) => {
    const matches = [...line.matchAll(tokenRegex)]

    let lastIndex = 0

    matches.forEach(match => {
      const value = match[0]
      const index = match.index

      // Unrecognized text between matches (basic check for stray invalid tokens)
      if (index > lastIndex) {
        const unknown = line.slice(lastIndex, index).trim()
        if (unknown.length > 0) {
          errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
        }
      }

      let type = 'identifier'

      if (value.startsWith('"') && value.endsWith('"')) {
        type = 'string_literal'
      } else if (cKeywords.includes(value)) {
        type = 'keyword'
      } else if (!isNaN(value)) {
        type = 'number'
      } else if (operators.includes(value)) {
        type = 'operator'
      } else if (symbols.includes(value)) {
        type = 'symbol'
      }

      tokens.push({ type, value, line: lineNum + 1 })
      lastIndex = index + value.length
    })

    // Check for leftover text after last match
    if (lastIndex < line.length) {
      const unknown = line.slice(lastIndex).trim()
      if (unknown.length > 0) {
        errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
      }
    }

    // Check for unclosed string literals (simplified line-wise check)
    const quoteMatches = (line.match(/"/g) || []).length
    if (quoteMatches % 2 !== 0) {
      errors.push(`Unclosed string literal on line ${lineNum + 1}`)
    }
  })

  return { tokens, errors }
}
