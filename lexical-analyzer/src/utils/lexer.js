import { cKeywords, operators, symbols } from './keywords';

export function analyzeCode(code) {
  if (!code || code.trim() === '') {
    return { 
      tokens: [], 
      errors: [{
        message: "Empty input - no code to analyze",
        type: "empty",
        line: 0,
        column: 0
      }] 
    };
  }

  const lines = code.split('\n');
  const tokens = [];
  const errors = [];
  const MAX_IDENTIFIER_LENGTH = 31;
  const MAX_NUMBER_LENGTH = 15;
  const validTypes = ['operator', 'symbol', 'keyword', 'identifier', 'number', 'string'];

  lines.forEach((line, lineNum) => {
    const lineNumber = lineNum + 1; // 1-based numbering
    let lastIndex = 0;

    // Check for unclosed strings
    const quoteCount = (line.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      errors.push({
        message: "Unclosed string literal",
        type: "syntax",
        line: lineNumber,
        column: line.lastIndexOf('"') + 1
      });
    }

    // Check for unclosed comments
    if (line.includes('/*') && !line.includes('*/')) {
      errors.push({
        message: "Unclosed block comment",
        type: "syntax",
        line: lineNumber,
        column: line.indexOf('/*') + 1
      });
    }

    const tokenRegex = /#include\s*<[^>]+>|"[^"]*"|\b[_a-zA-Z][_a-zA-Z0-9]*\b|[0-9]+|==|!=|>=|<=|>>|<<|[+\-*/%=&|^~<>!;{},()[\]]/g;
    const matches = [...line.matchAll(tokenRegex)];

    matches.forEach(match => {
      const value = match[0];
      const index = match.index;

      // Check for illegal characters between tokens
      if (index > lastIndex) {
        const unknown = line.slice(lastIndex, index).trim();
        if (unknown) {
          errors.push({
            message: `Illegal character(s): "${unknown}"`,
            type: "lexical",
            line: lineNumber,
            column: lastIndex + 1
          });
        }
      }

      // Validate token patterns
      let type = 'identifier';
      if (value.startsWith('#include')) {
        type = 'preprocessor';
        if (!value.match(/^#include\s*[<"][^>"]+[>"]$/)) {
          errors.push({
            message: "Malformed #include directive",
            type: "syntax",
            line: lineNumber,
            column: index + 1
          });
        }
      } else if (value.startsWith('"') && value.endsWith('"')) {
        type = 'string';
      } else if (cKeywords.includes(value)) {
        type = 'keyword';
      } else if (!isNaN(value)) {
        type = 'number';
        if (value.length > MAX_NUMBER_LENGTH) {
          errors.push({
            message: `Number constant too long (max ${MAX_NUMBER_LENGTH} digits)`,
            type: "lexical",
            line: lineNumber,
            column: index + 1
          });
        }
      } else if (operators.includes(value)) {
        type = 'operator';
      } else if (symbols.includes(value)) {
        type = 'symbol'; // Changed from 'delimiter' to 'symbol'
      } else if (/^[0-9]/.test(value)) {
        errors.push({
          message: `Invalid identifier (cannot start with number): "${value}"`,
          type: "lexical",
          line: lineNumber,
          column: index + 1
        });
        type = 'unknown';
      } else if (value.length > MAX_IDENTIFIER_LENGTH) {
        errors.push({
          message: `Identifier too long (max ${MAX_IDENTIFIER_LENGTH} chars): "${value}"`,
          type: "lexical",
          line: lineNumber,
          column: index + 1
        });
      }

      // Only push tokens of valid types
      if (validTypes.includes(type)) {
        tokens.push({
          type,
          value,
          line: lineNum,
          column: index
        });
      }

      lastIndex = index + value.length;
    });

    // Check for trailing invalid characters
    if (lastIndex < line.length) {
      const remaining = line.slice(lastIndex).trim();
      if (remaining) {
        errors.push({
          message: `Invalid trailing character(s): "${remaining}"`,
          type: "lexical",
          line: lineNumber,
          column: lastIndex + 1
        });
      }
    }
  });

  return { tokens, errors };
}