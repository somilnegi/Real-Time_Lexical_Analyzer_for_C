// utils/lexer.js
import { cKeywords, operators, symbols } from './keywords';

export const TokenType = {
  Keyword: 'keyword',
  Identifier: 'identifier',
  Number: 'number',
  String: 'string',
  Operator: 'operator',
  Separator: 'delimiter',
  Preprocessor: 'preprocessor',
  Unknown: 'unknown'
};

export function analyzeCode(code) {
  if (!code || code.trim() === '') {
    return { 
      tokens: [], 
      lexicalErrors: [{
        message: "Empty input - no code to analyze",
        line: 0,
        column: 0
      }],
      syntaxErrors: [] 
    };
  }

  const lines = code.split('\n');
  const tokens = [];
  const lexicalErrors = [];
  const MAX_IDENTIFIER_LENGTH = 31;
  const MAX_NUMBER_LENGTH = 15;
  let inBlockComment = false;

  lines.forEach((line, lineNum) => {
    const lineNumber = lineNum + 1;
    let lastIndex = 0;

    if (line.trim() === '') return;

    // Handle block comments
    if (inBlockComment) {
      if (line.includes('*/')) {
        inBlockComment = false;
        lastIndex = line.indexOf('*/') + 2;
      } else {
        return;
      }
    }

    // Remove single-line comments
    const singleLine = line.split('//')[0];
    const workingLine = inBlockComment ? line : singleLine;

    // Check for new block comments
    if (workingLine.includes('/*')) {
      const blockStart = workingLine.indexOf('/*');
      if (!workingLine.includes('*/', blockStart + 2)) {
        inBlockComment = true;
      }
      lastIndex = blockStart + 2;
    }

    // Check for unclosed strings
    const codePart = inBlockComment ? '' : workingLine.slice(lastIndex);
    const quoteCount = (codePart.match(/"/g) || []).length;
    if (quoteCount % 2 !== 0) {
      lexicalErrors.push({
        message: "Unclosed string literal",
        line: lineNumber,
        column: codePart.lastIndexOf('"') + 1 + lastIndex
      });
    }

    if (!inBlockComment) {
      const tokenRegex = /#include\s*<[^>]+>|"[^"]*"|\b[_a-zA-Z][_a-zA-Z0-9]*\b|[0-9]+|==|!=|>=|<=|>>|<<|[+\-*/%=&|^~<>!;{},()[\]]/g;
      const matches = [...workingLine.matchAll(tokenRegex)];

      matches.forEach(match => {
        const value = match[0];
        const index = match.index;

        if (index < lastIndex) return;

        // Check for illegal characters
        if (index > lastIndex) {
          const unknown = workingLine.slice(lastIndex, index).trim();
          if (unknown) {
            lexicalErrors.push({
              message: `Illegal character(s): "${unknown}"`,
              line: lineNumber,
              column: lastIndex + 1
            });
          }
        }

        let type = 'identifier';
        if (value.startsWith('#include')) {
          type = 'preprocessor';
          if (!value.match(/^#include\s*[<"][^>"]+[>"]$/)) {
            lexicalErrors.push({
              message: "Malformed #include directive",
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
            lexicalErrors.push({
              message: `Number constant too long (max ${MAX_NUMBER_LENGTH} digits)`,
              line: lineNumber,
              column: index + 1
            });
          }
        } else if (operators.includes(value)) {
          type = 'operator';
        } else if (symbols.includes(value)) {
          type = 'delimiter';
        } else if (/^[0-9]/.test(value)) {
          lexicalErrors.push({
            message: `Invalid identifier (cannot start with number): "${value}"`,
            line: lineNumber,
            column: index + 1
          });
          type = 'unknown';
        } else if (value.length > MAX_IDENTIFIER_LENGTH) {
          lexicalErrors.push({
            message: `Identifier too long (max ${MAX_IDENTIFIER_LENGTH} chars): "${value}"`,
            line: lineNumber,
            column: index + 1
          });
        }

        tokens.push({
          type,
          value,
          line: lineNum,
          column: index
        });

        lastIndex = index + value.length;
      });

      // Check for trailing invalid characters
      if (lastIndex < workingLine.length) {
        const remaining = workingLine.slice(lastIndex).trim();
        if (remaining) {
          lexicalErrors.push({
            message: `Invalid trailing character(s): "${remaining}"`,
            line: lineNumber,
            column: lastIndex + 1
          });
        }
      }
    }
  });

  return { 
    tokens, 
    lexicalErrors,
    syntaxErrors: [] 
  };
}
