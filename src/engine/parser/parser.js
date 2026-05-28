// ============================================================
// parser.js — Recursive‑descent parser for the Meow language
// ============================================================
//
// Grammar (informal):
//
//   program     → "paw" "{" declaration* "}" EOF
//   declaration → pounceDecl | statement
//   pounceDecl  → "pounce" IDENTIFIER "(" params? ")" "{" declaration* "}"
//   params      → IDENTIFIER ("," IDENTIFIER)*
//   statement   → meowStmt | meowmeowStmt | hissStmt | scratchStmt | purrStmt | exprStmt
//   meowStmt    → "meow" expression
//   meowmeowStmt→ "meowmeow" IDENTIFIER "=" expression
//   hissStmt    → "hiss" "(" expression ")" "{" declaration* "}" ("mew" "{" declaration* "}")?
//   scratchStmt → "scratch" "(" expression ")" "{" declaration* "}"
//   purrStmt    → "purr" expression?
//   exprStmt    → expression                    // e.g. function call
//
//   expression  → assignment
//   assignment  → IDENTIFIER "=" assignment | logicOr
//   logicOr     → logicAnd ("||" logicAnd)*
//   logicAnd    → equality ("&&" equality)*
//   equality    → comparison (("==" | "!=") comparison)*
//   comparison  → addition (("<" | ">" | "<=" | ">=") addition)*
//   addition    → multiplication (("+" | "-") multiplication)*
//   multiplication → unary (("*" | "/" | "%") unary)*
//   unary       → ("!" | "-") unary | call
//   call        → primary ("(" arguments? ")")*
//   arguments   → expression ("," expression)*
//   primary     → NUMBER | STRING | "fur" | "hairball" | "catnip"
//                | IDENTIFIER | "(" expression ")"
//

import { TokenType } from '../lexer/tokens.js';
import { MeowParserError } from '../errors.js';

// ── AST node factories ──────────────────────────────────────
// Each returns a plain object with a `type` field and location info.

function node(type, props, token) {
  return { type, ...props, line: token.line, column: token.column };
}

// ── Parser ──────────────────────────────────────────────────

/**
 * Parse an array of tokens into an AST.
 * @param {import('./tokens.js').Token[]} tokens
 * @returns {object} AST root (Program node)
 * @throws {MeowParserError}
 */
export function parse(tokens) {
  let current = 0;

  // ── Token helpers ───────────────────────────────────────

  function peek() {
    return tokens[current];
  }

  function peekNext() {
    return tokens[current + 1] || tokens[tokens.length - 1];
  }

  function previous() {
    return tokens[current - 1];
  }

  function isAtEnd() {
    return peek().type === TokenType.EOF;
  }

  function advance() {
    if (!isAtEnd()) current++;
    return previous();
  }

  function check(type) {
    if (isAtEnd()) return false;
    return peek().type === type;
  }

  function matchAny(...types) {
    for (const type of types) {
      if (check(type)) {
        advance();
        return true;
      }
    }
    return false;
  }

  function consume(type, message, code, meta) {
    if (check(type)) return advance();
    const tok = peek();
    const extra = Object.assign({}, meta || {}, { found: tok.lexeme });
    throw new MeowParserError(message, tok.line, tok.column, code, extra);
  }

  // ── Grammar rules ─────────────────────────────────────

  /** program → "paw" "{" declaration* "}" EOF */
  function program() {
    const tok = peek();

    // Allow (and skip) scratch declarations before paw for top‑level functions
    const topFunctions = [];
    while (check(TokenType.SCRATCH)) {
      topFunctions.push(scratchDeclaration());
    }

    consume(TokenType.PAW, "Expected 'paw' at the start of the program", 'MISSING_PAW', { expected: 'paw' });
    const pawTok = previous();
    consume(TokenType.LEFT_BRACE, "Expected '{' after 'paw'", 'MISSING_LEFT_BRACE', { expected: '{' });

    const body = [];
    // Prepend any top‑level functions into the body
    body.push(...topFunctions);

    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }

    consume(TokenType.RIGHT_BRACE, "Expected '}' to close the 'paw' block", 'MISSING_RIGHT_BRACE', { expected: '}' });

    if (!isAtEnd()) {
      const extra = peek();
      // Allow trailing whitespace / EOF — anything else is suspicious
      // but we'll be lenient and just ignore it.
    }

    return node('Program', { body }, pawTok);
  }

  /** declaration → scratchDecl | statement */
  function declaration() {
    if (check(TokenType.SCRATCH)) return scratchDeclaration();
    return statement();
  }

  /** scratchDecl → "scratch" IDENTIFIER "(" params? ")" "{" declaration* "}" */
  function scratchDeclaration() {
    const kw = advance(); // consume SCRATCH
    const nameTok = consume(TokenType.IDENTIFIER, "Expected identifier (function name) after 'scratch'", 'MISSING_IDENTIFIER');
    consume(TokenType.LEFT_PAREN, "Expected '(' after function name", 'MISSING_LEFT_PAREN', { expected: '(' });

    const params = [];
    if (!check(TokenType.RIGHT_PAREN)) {
      do {
        const p = consume(TokenType.IDENTIFIER, 'Expected parameter name', 'MISSING_IDENTIFIER');
        params.push(p.lexeme);
      } while (matchAny(TokenType.COMMA));
    }
    consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters", 'MISSING_RIGHT_PAREN', { expected: ')' });
    consume(TokenType.LEFT_BRACE, "Expected '{' before function body", 'MISSING_LEFT_BRACE', { expected: '{' });

    const body = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after function body", 'MISSING_RIGHT_BRACE', { expected: '}' });

    return node('FunctionDeclaration', {
      name: nameTok.lexeme,
      params,
      body,
    }, kw);
  }

  /** statement → meowDecl | hissStmt | chaseStmt | scratchDecl | purrStmt | bringStmt | exprStmt */
  function statement() {
    if (check(TokenType.MEOW))     return meowDeclaration();
    if (check(TokenType.HISS))     return hissStatement();
    if (check(TokenType.CHASE))    return chaseStatement();
    if (check(TokenType.SCRATCH))  return scratchDeclaration();
    if (check(TokenType.PURR))     return purrStatement();
    if (check(TokenType.BRING))    return bringStatement();
    return expressionStatement();
  }

  /** meowDecl → "meow" IDENTIFIER "=" expression */
  function meowDeclaration() {
    const kw = advance(); // consume MEOW
    const nameTok = consume(TokenType.IDENTIFIER, "Expected identifier after 'meow'", 'MISSING_IDENTIFIER');
    consume(TokenType.EQUAL, "Expected '=' after variable name in 'meow' declaration", 'MISSING_EQUAL', { expected: '=' });
    const init = expression();
    return node('VariableDeclaration', {
      name: nameTok.lexeme,
      initializer: init,
    }, kw);
  }

  /** hissStmt → "hiss" "(" expression ")" "{" declaration* "}" ("mew" "{" declaration* "}")? */
  function hissStatement() {
    const kw = advance(); // consume HISS
    consume(TokenType.LEFT_PAREN, "Expected '(' after 'hiss'", 'MISSING_LEFT_PAREN', { expected: '(' });
    const condition = expression();
    consume(TokenType.RIGHT_PAREN, "Expected ')' after hiss condition", 'MISSING_RIGHT_PAREN', { expected: ')' });
    consume(TokenType.LEFT_BRACE, "Expected '{' after hiss condition", 'MISSING_LEFT_BRACE', { expected: '{' });

    const consequent = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      consequent.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after hiss body", 'MISSING_RIGHT_BRACE', { expected: '}' });

    let alternate = null;
    if (matchAny(TokenType.MEW)) {
      // Could be `mew { }`, `mew hiss (...) { }`, `else { }` or `else hiss (...) { }`
      if (check(TokenType.HISS)) {
        alternate = [hissStatement()];
      } else {
        consume(TokenType.LEFT_BRACE, "Expected '{' after else/mew clause", 'MISSING_LEFT_BRACE', { expected: '{' });
        const elseBody = [];
        while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
          elseBody.push(declaration());
        }
        consume(TokenType.RIGHT_BRACE, "Expected '}' after else/mew body", 'MISSING_RIGHT_BRACE', { expected: '}' });
        alternate = elseBody;
      }
    }

    return node('IfStatement', { condition, consequent, alternate }, kw);
  }

  /** chaseStmt → "chase" "(" expression ")" "{" declaration* "}" */
  function chaseStatement() {
    const kw = advance(); // consume CHASE
    consume(TokenType.LEFT_PAREN, "Expected '(' after 'chase'", 'MISSING_LEFT_PAREN', { expected: '(' });
    const condition = expression();
    consume(TokenType.RIGHT_PAREN, "Expected ')' after chase condition", 'MISSING_RIGHT_PAREN', { expected: ')' });
    consume(TokenType.LEFT_BRACE, "Expected '{' after chase condition", 'MISSING_LEFT_BRACE', { expected: '{' });

    const body = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after chase body", 'MISSING_RIGHT_BRACE', { expected: '}' });

    return node('WhileStatement', { condition, body }, kw);
  }

  /** purrStmt → "purr" "(" expression? ")" */
  function purrStatement() {
    const kw = advance(); // consume PURR
    consume(TokenType.LEFT_PAREN, "Expected '(' after 'purr'", 'MISSING_LEFT_PAREN', { expected: '(' });
    let expr = null;
    if (!check(TokenType.RIGHT_PAREN)) {
      expr = expression();
    }
    consume(TokenType.RIGHT_PAREN, "Expected ')' after print expression", 'MISSING_RIGHT_PAREN', { expected: ')' });
    return node('PurrStatement', { expression: expr }, kw);
  }

  /** bringStmt → "bring" expression? */
  function bringStatement() {
    const kw = advance(); // consume BRING
    let value = null;
    if (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      value = expression();
    }
    return node('ReturnStatement', { value }, kw);
  }

  /** exprStmt → expression */
  function expressionStatement() {
    const expr = expression();
    return node('ExpressionStatement', { expression: expr }, expr);
  }

  // ── Expressions (Pratt‑style precedence climbing) ─────

  /** expression → assignment */
  function expression() {
    return assignment();
  }

  /** assignment → IDENTIFIER "=" assignment | logicOr */
  function assignment() {
    const expr = logicOr();

    if (matchAny(TokenType.EQUAL)) {
      const eqTok = previous();
      const value = assignment(); // right‑associative
      if (expr.type === 'Identifier') {
        return node('AssignmentExpression', { name: expr.name, value }, eqTok);
      }
      throw new MeowParserError(
        'Invalid assignment target',
        eqTok.line, eqTok.column,
      );
    }

    return expr;
  }

  /** logicOr → logicAnd ("||" logicAnd)* */
  function logicOr() {
    let left = logicAnd();
    while (matchAny(TokenType.OR)) {
      const op = previous();
      const right = logicAnd();
      left = node('LogicalExpression', { operator: '||', left, right }, op);
    }
    return left;
  }

  /** logicAnd → equality ("&&" equality)* */
  function logicAnd() {
    let left = equality();
    while (matchAny(TokenType.AND)) {
      const op = previous();
      const right = equality();
      left = node('LogicalExpression', { operator: '&&', left, right }, op);
    }
    return left;
  }

  /** equality → comparison (("==" | "!=") comparison)* */
  function equality() {
    let left = comparison();
    while (matchAny(TokenType.EQUAL_EQUAL, TokenType.BANG_EQUAL)) {
      const op = previous();
      const right = comparison();
      left = node('BinaryExpression', { operator: op.lexeme, left, right }, op);
    }
    return left;
  }

  /** comparison → addition (("<" | ">" | "<=" | ">=") addition)* */
  function comparison() {
    let left = addition();
    while (matchAny(TokenType.LESS, TokenType.GREATER, TokenType.LESS_EQUAL, TokenType.GREATER_EQUAL)) {
      const op = previous();
      const right = addition();
      left = node('BinaryExpression', { operator: op.lexeme, left, right }, op);
    }
    return left;
  }

  /** addition → multiplication (("+" | "-") multiplication)* */
  function addition() {
    let left = multiplication();
    while (matchAny(TokenType.PLUS, TokenType.MINUS)) {
      const op = previous();
      const right = multiplication();
      left = node('BinaryExpression', { operator: op.lexeme, left, right }, op);
    }
    return left;
  }

  /** multiplication → unary (("*" | "/" | "%") unary)* */
  function multiplication() {
    let left = unary();
    while (matchAny(TokenType.STAR, TokenType.SLASH, TokenType.PERCENT)) {
      const op = previous();
      const right = unary();
      left = node('BinaryExpression', { operator: op.lexeme, left, right }, op);
    }
    return left;
  }

  /** unary → ("!" | "-") unary | call */
  function unary() {
    if (matchAny(TokenType.BANG, TokenType.MINUS)) {
      const op = previous();
      const operand = unary();
      return node('UnaryExpression', { operator: op.lexeme, operand }, op);
    }
    return call();
  }

  /** call → primary ("(" arguments? ")")* */
  function call() {
    let expr = primary();

    while (check(TokenType.LEFT_PAREN)) {
      advance(); // consume (
      const args = [];
      if (!check(TokenType.RIGHT_PAREN)) {
        do {
          args.push(expression());
        } while (matchAny(TokenType.COMMA));
      }
      const paren = consume(TokenType.RIGHT_PAREN, "Expected ')' after arguments");
      expr = node('CallExpression', { callee: expr, arguments: args }, expr);
    }

    return expr;
  }

  /** primary → NUMBER | STRING | "fur" | "hairball" | "catnip" | IDENTIFIER | "(" expression ")" */
  function primary() {
    // Literals
    if (matchAny(TokenType.NUMBER)) {
      const tok = previous();
      return node('Literal', { value: tok.value }, tok);
    }
    if (matchAny(TokenType.STRING)) {
      const tok = previous();
      return node('Literal', { value: tok.value }, tok);
    }
    if (matchAny(TokenType.FUR)) {
      return node('Literal', { value: true }, previous());
    }
    if (matchAny(TokenType.HAIRBALL)) {
      return node('Literal', { value: false }, previous());
    }
    if (matchAny(TokenType.CATNIP)) {
      return node('Literal', { value: null }, previous());
    }

    // Identifier
    if (matchAny(TokenType.IDENTIFIER)) {
      return node('Identifier', { name: previous().lexeme }, previous());
    }

    // Grouped expression
    if (matchAny(TokenType.LEFT_PAREN)) {
      const openParen = previous();
      const expr = expression();
      consume(TokenType.RIGHT_PAREN, "Expected ')' after grouped expression");
      return expr;
    }

    // Nothing matched — error
    const tok = peek();
    if (isAtEnd()) {
      throw new MeowParserError('Unexpected end of input', tok.line, tok.column, 'UNEXPECTED_EOF', { found: 'EOF' });
    }
    throw new MeowParserError(
      `Unexpected token '${tok.lexeme}'`,
      tok.line, tok.column,
      'UNEXPECTED_TOKEN', { found: tok.lexeme }
    );
  }

  // ── Entry point ────────────────────────────────────────
  return program();
}
