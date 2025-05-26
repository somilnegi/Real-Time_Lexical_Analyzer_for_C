// Ported from the C++ syntax analyzer
import { TokenType } from "./lexer"

export function parse(tokens) {
  if (!tokens || tokens.length === 0) {
    return {
      success: true,
      errors: []
    };
  }

  const parser = new Parser(tokens);
  try {
    parser.parse();
    return {
      success: parser.errors.length === 0,
      errors: parser.errors.map(error => {
        // Extract line and column from error message if available
        const lineMatch = error.match(/line (\d+)/);
        const colMatch = error.match(/column (\d+)/);
        return {
          message: error,
          line: lineMatch ? parseInt(lineMatch[1]) : 0,
          column: colMatch ? parseInt(colMatch[1]) : 0
        };
      })
    };
  } catch (error) {
    if (!parser.errors.length) {
      parser.errors.push(`Unexpected error: ${error}`);
    }
    return {
      success: false,
      errors: parser.errors.map(error => ({
        message: error,
        line: 0,
        column: 0
      }))
    };
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.pos = 0
    this.errors = []
  }

  advance() {
    if (this.pos < this.tokens.length) {
      this.pos++
    }
  }

  peek() {
    if (this.pos < this.tokens.length) {
      return this.tokens[this.pos]
    }
    return null
  }

  match(type, value = "") {
    if (this.pos >= this.tokens.length) {
      return false
    }

    const token = this.tokens[this.pos]
    if (token.type === type && (value === "" || token.value === value)) {
      this.advance()
      return true
    }
    return false
  }

  expect(type, value = "") {
    if (this.pos >= this.tokens.length) {
      const error = `Syntax Error at EOF: Expected ${type}${value ? ` '${value}'` : ""}`
      this.errors.push(error)
      throw new Error(error)
    }

    const token = this.tokens[this.pos]
    if (token.type !== type || (value !== "" && token.value !== value)) {
      const error = `Syntax Error at line ${token.line}, column ${token.col}: Expected ${type}${value ? ` '${value}'` : ""}, got '${token.value}'`
      this.errors.push(error)
      throw new Error(error)
    }
    this.advance()
  }

  parse() {
    if (this.tokens.length === 0) {
      return // Nothing to parse
    }

    try {
      while (this.pos < this.tokens.length) {
        // Skip preprocessor directives
        const token = this.peek()
        if (!token) break

        if (token.type === TokenType.Identifier && token.value.startsWith("#")) {
          while (
            this.pos < this.tokens.length &&
            !(this.tokens[this.pos].type === TokenType.Separator && this.tokens[this.pos].value === "\n")
          ) {
            this.advance()
          }
          if (this.pos < this.tokens.length) {
            this.advance() // Skip newline
          }
          continue
        }

        try {
          this.parseFunction()
        } catch (error) {
          // Try to recover by finding the next function
          this.errors.push(`${error}`)
          this.recoverToNextFunction()
        }
      }
    } catch (error) {
      this.errors.push(`${error}`)
    }
  }

  recoverToNextFunction() {
    // Skip until we find a closing brace or the next function declaration
    let braceCount = 0

    while (this.pos < this.tokens.length) {
      const token = this.peek()
      if (!token) break

      // Track brace nesting
      if (token.type === TokenType.Separator && token.value === "{") {
        braceCount++
        this.advance()
        continue
      } else if (token.type === TokenType.Separator && token.value === "}") {
        braceCount--
        this.advance()
        // If we've closed all open braces, we might be at the end of a function
        if (braceCount <= 0) {
          break
        }
        continue
      }

      // Found a potential function declaration (return type)
      if (
        braceCount <= 0 &&
        token.type === TokenType.Keyword &&
        ["int", "void", "float", "double", "char", "bool"].includes(token.value)
      ) {
        // Look ahead to see if it's followed by an identifier and opening parenthesis
        if (
          this.pos + 2 < this.tokens.length &&
          this.tokens[this.pos + 1].type === TokenType.Identifier &&
          this.tokens[this.pos + 2].type === TokenType.Separator &&
          this.tokens[this.pos + 2].value === "("
        ) {
          break
        }
      }

      this.advance()
    }
  }

  parseFunction() {
    // Parse return type (or void)
    if (this.pos >= this.tokens.length) {
      throw new Error("Unexpected end of input while parsing function")
    }

    // Check if we have a valid return type keyword
    const token = this.peek()
    if (
      token.type !== TokenType.Keyword ||
      !["int", "void", "float", "double", "char", "bool", "long"].includes(token.value)
    ) {
      throw new Error(
        `Expected return type keyword at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`,
      )
    }

    this.advance() // Consume return type

    // Parse function name
    if (this.pos >= this.tokens.length) {
      throw new Error("Unexpected end of input while parsing function name")
    }

    if (this.peek().type !== TokenType.Identifier) {
      const token = this.peek()
      throw new Error(
        `Expected function name at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`,
      )
    }

    this.advance() // Consume function name

    // Parse opening parenthesis
    if (this.pos >= this.tokens.length) {
      throw new Error("Unexpected end of input while parsing function parameters")
    }

    if (!this.match(TokenType.Separator, "(")) {
      const token = this.peek()
      throw new Error(`Expected '(' at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`)
    }

    // Parse parameters
    if (!this.match(TokenType.Separator, ")")) {
      do {
        // Parameter type
        if (this.pos >= this.tokens.length) {
          throw new Error("Unexpected end of input while parsing parameter type")
        }

        if (this.peek().type !== TokenType.Keyword) {
          const token = this.peek()
          throw new Error(
            `Expected parameter type at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`,
          )
        }

        this.advance() // Consume parameter type

        // Parameter name
        if (this.pos >= this.tokens.length) {
          throw new Error("Unexpected end of input while parsing parameter name")
        }

        if (this.peek().type !== TokenType.Identifier) {
          const token = this.peek()
          throw new Error(
            `Expected parameter name at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`,
          )
        }

        this.advance() // Consume parameter name
      } while (this.match(TokenType.Separator, ","))

      // Parse closing parenthesis
      if (this.pos >= this.tokens.length) {
        throw new Error("Unexpected end of input while parsing function parameters")
      }

      if (!this.match(TokenType.Separator, ")")) {
        const token = this.peek()
        throw new Error(`Expected ')' at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`)
      }
    }

    // Parse opening brace
    if (this.pos >= this.tokens.length) {
      throw new Error("Unexpected end of input while parsing function body")
    }

    if (!this.match(TokenType.Separator, "{")) {
      const token = this.peek()
      throw new Error(`Expected '{' at line ${token.line}, column ${token.col}, got ${token.type} '${token.value}'`)
    }

    // Parse function body
    while (this.pos < this.tokens.length && !this.match(TokenType.Separator, "}")) {
      this.parseStatement()
    }
  }

  parseStatement() {
    const token = this.peek()

    if (!token) {
      throw new Error("Syntax Error: Unexpected end of input")
    }

    try {
      // Handle variable declarations: e.g., int a = 1;
      if (
        token.type === TokenType.Keyword &&
        ["int", "float", "char", "double", "bool", "void", "long"].includes(token.value)
      ) {
        this.expect(TokenType.Keyword) // e.g., int
        this.expect(TokenType.Identifier) // variable name

        if (this.match(TokenType.Operator, "=")) {
          this.parseExpression() // parse the initializer expression
        }

        this.expect(TokenType.Separator, ";")
      }
      // Handle if statements
      else if (this.match(TokenType.Keyword, "if")) {
        this.expect(TokenType.Separator, "(")
        this.parseExpression()
        this.expect(TokenType.Separator, ")")

        // Handle if body
        if (this.match(TokenType.Separator, "{")) {
          while (!this.match(TokenType.Separator, "}")) {
            if (this.pos >= this.tokens.length) {
              throw new Error("Syntax Error: Unclosed if statement block")
            }
            this.parseStatement()
          }
        } else {
          // Single statement if
          this.parseStatement()
        }

        // Handle else
        if (this.match(TokenType.Keyword, "else")) {
          if (this.match(TokenType.Separator, "{")) {
            while (!this.match(TokenType.Separator, "}")) {
              if (this.pos >= this.tokens.length) {
                throw new Error("Syntax Error: Unclosed else statement block")
              }
              this.parseStatement()
            }
          } else {
            // Single statement else
            this.parseStatement()
          }
        }
      }
      // Handle for loops
      else if (this.match(TokenType.Keyword, "for")) {
        this.expect(TokenType.Separator, "(")

        // Initialization
        if (this.peek()?.type === TokenType.Keyword) {
          // Handle declaration: int i=0
          this.expect(TokenType.Keyword)
          this.expect(TokenType.Identifier)

          if (this.match(TokenType.Operator, "=")) {
            this.parseExpression()
          }
        } else if (!this.match(TokenType.Separator, ";")) {
          this.parseExpression() // Handle expression: i=0
          this.expect(TokenType.Separator, ";")
        }

        // Condition (if not empty)
        if (!this.match(TokenType.Separator, ";")) {
          this.parseExpression() // Condition: i<5
          this.expect(TokenType.Separator, ";")
        }

        // Increment (if not empty)
        if (!this.match(TokenType.Separator, ")")) {
          this.parseExpression() // Increment: i++
          this.expect(TokenType.Separator, ")")
        }

        // For loop body
        if (this.match(TokenType.Separator, "{")) {
          while (!this.match(TokenType.Separator, "}")) {
            if (this.pos >= this.tokens.length) {
              throw new Error("Syntax Error: Unclosed for loop block")
            }
            this.parseStatement()
          }
        } else {
          // Single statement for loop
          this.parseStatement()
        }
      }
      // Handle while loops
      else if (this.match(TokenType.Keyword, "while")) {
        this.expect(TokenType.Separator, "(")
        this.parseExpression()
        this.expect(TokenType.Separator, ")")

        if (this.match(TokenType.Separator, "{")) {
          while (!this.match(TokenType.Separator, "}")) {
            if (this.pos >= this.tokens.length) {
              throw new Error("Syntax Error: Unclosed while loop block")
            }
            this.parseStatement()
          }
        } else {
          // Single statement while loop
          this.parseStatement()
        }
      }
      // Handle return statements
      else if (this.match(TokenType.Keyword, "return")) {
        if (!this.match(TokenType.Separator, ";")) {
          this.parseExpression()
          this.expect(TokenType.Separator, ";")
        }
      }
      // Handle empty statements
      else if (this.match(TokenType.Separator, ";")) {
        // Empty statement, do nothing
      }
      // Handle blocks
      else if (this.match(TokenType.Separator, "{")) {
        while (!this.match(TokenType.Separator, "}")) {
          if (this.pos >= this.tokens.length) {
            throw new Error("Syntax Error: Unclosed block")
          }
          this.parseStatement()
        }
      }
      // Handle function calls and assignments
      else if (token.type === TokenType.Identifier) {
        this.expect(TokenType.Identifier)

        // Function call
        if (this.match(TokenType.Separator, "(")) {
          if (!this.match(TokenType.Separator, ")")) {
            do {
              this.parseExpression()
            } while (this.match(TokenType.Separator, ","))

            this.expect(TokenType.Separator, ")")
          }
          this.expect(TokenType.Separator, ";")
        }
        // Assignment or other expression
        else {
          if (
            this.match(TokenType.Operator, "=") ||
            this.match(TokenType.Operator, "+=") ||
            this.match(TokenType.Operator, "-=") ||
            this.match(TokenType.Operator, "*=") ||
            this.match(TokenType.Operator, "/=")
          ) {
            this.parseExpression()
          }
          this.expect(TokenType.Separator, ";")
        }
      }
      // Handle other expressions
      else {
        this.parseExpression()
        this.expect(TokenType.Separator, ";")
      }
    } catch (error) {
      // Add the error and try to recover
      this.errors.push(`${error}`)

      // Skip to the next statement
      while (this.pos < this.tokens.length) {
        const current = this.peek()
        if (!current) break

        // Found a semicolon, end of the current statement
        if (current.type === TokenType.Separator && current.value === ";") {
          this.advance() // consume the semicolon
          break
        }

        // Found a closing brace, might be end of a block
        if (current.type === TokenType.Separator && current.value === "}") {
          break
        }

        this.advance()
      }
    }
  }

  parseExpression() {
    try {
      // Handle empty expressions
      if (this.peek()?.type === TokenType.Separator && [";", ")", "}"].includes(this.peek()?.value || "")) {
        return
      }

      this.parseAssignment()
    } catch (error) {
      this.errors.push(`${error}`)

      // Skip to the end of the expression
      while (this.pos < this.tokens.length) {
        const current = this.peek()
        if (!current) break

        if (current.type === TokenType.Separator && [";", ")", "}"].includes(current.value)) {
          break
        }

        this.advance()
      }
    }
  }

  parseAssignment() {
    this.parseLogicalOr()

    // Handle assignment operators
    if (
      this.match(TokenType.Operator, "=") ||
      this.match(TokenType.Operator, "+=") ||
      this.match(TokenType.Operator, "-=") ||
      this.match(TokenType.Operator, "*=") ||
      this.match(TokenType.Operator, "/=")
    ) {
      this.parseAssignment() // Right-associative
    }
  }

  parseLogicalOr() {
    this.parseLogicalAnd()

    while (this.match(TokenType.Operator, "||")) {
      this.parseLogicalAnd()
    }
  }

  parseLogicalAnd() {
    this.parseEquality()

    while (this.match(TokenType.Operator, "&&")) {
      this.parseEquality()
    }
  }

  parseEquality() {
    this.parseRelational()

    while (this.match(TokenType.Operator, "==") || this.match(TokenType.Operator, "!=")) {
      this.parseRelational()
    }
  }

  parseRelational() {
    this.parseAdditive()

    while (
      this.match(TokenType.Operator, "<") ||
      this.match(TokenType.Operator, ">") ||
      this.match(TokenType.Operator, "<=") ||
      this.match(TokenType.Operator, ">=")
    ) {
      this.parseAdditive()
    }
  }

  parseAdditive() {
    this.parseMultiplicative()

    while (this.match(TokenType.Operator, "+") || this.match(TokenType.Operator, "-")) {
      this.parseMultiplicative()
    }
  }

  parseMultiplicative() {
    this.parseUnary()

    while (
      this.match(TokenType.Operator, "*") ||
      this.match(TokenType.Operator, "/") ||
      this.match(TokenType.Operator, "%")
    ) {
      this.parseUnary()
    }
  }

  parseUnary() {
    if (
      this.match(TokenType.Operator, "!") ||
      this.match(TokenType.Operator, "-") ||
      this.match(TokenType.Operator, "+") ||
      this.match(TokenType.Operator, "++") ||
      this.match(TokenType.Operator, "--")
    ) {
      this.parseUnary()
    } else {
      this.parsePostfix()
    }
  }

  parsePostfix() {
    this.parsePrimary()

    // Handle postfix operators
    while (true) {
      if (this.match(TokenType.Operator, "++") || this.match(TokenType.Operator, "--")) {
        // Postfix increment/decrement
        continue
      } else if (this.match(TokenType.Separator, "[")) {
        // Array access
        this.parseExpression()
        this.expect(TokenType.Separator, "]")
      } else if (this.match(TokenType.Separator, "(")) {
        // Function call
        if (!this.match(TokenType.Separator, ")")) {
          do {
            this.parseExpression()
          } while (this.match(TokenType.Separator, ","))

          this.expect(TokenType.Separator, ")")
        }
      } else if (this.match(TokenType.Separator, ".") || this.match(TokenType.Operator, "->")) {
        // Member access
        this.expect(TokenType.Identifier)
      } else {
        break
      }
    }
  }

  parseFunctionCall() {
    // Expect opening parenthesis
    this.expect(TokenType.Separator, "(")

    // Parse arguments if any
    if (!this.match(TokenType.Separator, ")")) {
      do {
        this.parseExpression()
      } while (this.match(TokenType.Separator, ","))

      this.expect(TokenType.Separator, ")")
    }
  }

  parsePrimary() {
    try {
      if (this.match(TokenType.Number) || this.match(TokenType.String)) {
        // Literal values
        return
      } else if (this.match(TokenType.Identifier)) {
        // Variable or function name
        // Check if it's a function call
        if (this.peek()?.type === TokenType.Separator && this.peek()?.value === "(") {
          this.parseFunctionCall()
        }
        return
      } else if (this.match(TokenType.Separator, "(")) {
        // Parenthesized expression
        this.parseExpression()
        this.expect(TokenType.Separator, ")")
      } else {
        const token = this.peek()
        throw new Error(
          `Syntax Error at line ${token?.line || 0}, column ${token?.col || 0}: Expected number, identifier, string, or '('`,
        )
      }
    } catch (error) {
      this.errors.push(`${error}`)

      // Skip to the matching closing parenthesis or end of expression
      let parenCount = 1
      while (this.pos < this.tokens.length) {
        const current = this.peek()
        if (!current) break

        if (current.type === TokenType.Separator) {
          if (current.value === "(") {
            parenCount++
          } else if (current.value === ")") {
            parenCount--
            if (parenCount === 0) {
              this.advance() // consume the closing parenthesis
              break
            }
          } else if (current.value === ";" && parenCount === 0) {
            break
          }
        }

        this.advance()
      }
    }
  }
}
