// src/utils/lexer.js

import { cKeywords, operators, symbols } from './keywords'

export function analyzeCode(code) {
  const lines = code.split('\n')
  const tokens = []
  const errors = []

  const tokenRegex = /\b[_a-zA-Z][_a-zA-Z0-9]*\b|[0-9]+|==|!=|>=|<=|>>|<<|[+\-*/%=&|^~<>!;{},()[\]]/g

  lines.forEach((line, lineNum) => {
    const matches = [...line.matchAll(tokenRegex)]

    let lastIndex = 0

    matches.forEach(match => {
      const value = match[0]
      const index = match.index

      // Detect unrecognized characters
      if (index > lastIndex) {
        const unknown = line.slice(lastIndex, index).trim()
        if (unknown.length > 0) {
          errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
        }
      }

      let type = 'Identifier'

      if (cKeywords.includes(value)) type = 'Keyword'
      else if (!isNaN(value)) type = 'Number'
      else if (operators.includes(value)) type = 'Operator'
      else if (symbols.includes(value)) type = 'Symbol'

      tokens.push({ type, value })
      lastIndex = index + value.length
    })

    // Check for any leftovers after last match
    if (lastIndex < line.length) {
      const unknown = line.slice(lastIndex).trim()
      if (unknown.length > 0) {
        errors.push(`Unrecognized token "${unknown}" on line ${lineNum + 1}`)
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
