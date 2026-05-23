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

  function consume(type, message) {
    if (check(type)) return advance();
    const tok = peek();
    throw new MeowParserError(message, tok.line, tok.column);
  }

  // ── Grammar rules ─────────────────────────────────────

  /** program → "paw" "{" declaration* "}" EOF */
  function program() {
    const tok = peek();

    // Allow (and skip) pounce declarations before paw for top‑level functions
    const topFunctions = [];
    while (check(TokenType.POUNCE)) {
      topFunctions.push(pounceDeclaration());
    }

    consume(TokenType.PAW, "Expected 'paw' at the start of the program");
    const pawTok = previous();
    consume(TokenType.LEFT_BRACE, "Expected '{' after 'paw'");

    const body = [];
    // Prepend any top‑level functions into the body
    body.push(...topFunctions);

    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }

    consume(TokenType.RIGHT_BRACE, "Expected '}' to close the 'paw' block");

    if (!isAtEnd()) {
      const extra = peek();
      // Allow trailing whitespace / EOF — anything else is suspicious
      // but we'll be lenient and just ignore it.
    }

    return node('Program', { body }, pawTok);
  }

  /** declaration → pounceDecl | statement */
  function declaration() {
    if (check(TokenType.POUNCE)) return pounceDeclaration();
    return statement();
  }

  /** pounceDecl → "pounce" IDENTIFIER "(" params? ")" "{" declaration* "}" */
  function pounceDeclaration() {
    const kw = advance(); // consume POUNCE
    const nameTok = consume(TokenType.IDENTIFIER, "Expected identifier (function name) after 'pounce'");
    consume(TokenType.LEFT_PAREN, "Expected '(' after function name");

    const params = [];
    if (!check(TokenType.RIGHT_PAREN)) {
      do {
        const p = consume(TokenType.IDENTIFIER, 'Expected parameter name');
        params.push(p.lexeme);
      } while (matchAny(TokenType.COMMA));
    }
    consume(TokenType.RIGHT_PAREN, "Expected ')' after parameters");
    consume(TokenType.LEFT_BRACE, "Expected '{' before function body");

    const body = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after function body");

    return node('FunctionDeclaration', {
      name: nameTok.lexeme,
      params,
      body,
    }, kw);
  }

  /** statement → meowStmt | meowmeowStmt | hissStmt | scratchStmt | purrStmt | exprStmt */
  function statement() {
    if (check(TokenType.MEOW))     return meowStatement();
    if (check(TokenType.MEOWMEOW)) return meowmeowStatement();
    if (check(TokenType.HISS))     return hissStatement();
    if (check(TokenType.SCRATCH))  return scratchStatement();
    if (check(TokenType.PURR))     return purrStatement();
    return expressionStatement();
  }

  /** meowStmt → "meow" expression */
  function meowStatement() {
    const kw = advance(); // consume MEOW
    const expr = expression();
    return node('MeowStatement', { expression: expr }, kw);
  }

  /** meowmeowStmt → "meowmeow" IDENTIFIER "=" expression */
  function meowmeowStatement() {
    const kw = advance(); // consume MEOWMEOW
    const nameTok = consume(TokenType.IDENTIFIER, "Expected identifier after 'meowmeow'");
    consume(TokenType.EQUAL, "Expected '=' after variable name in 'meowmeow' declaration");
    const init = expression();
    return node('VariableDeclaration', {
      name: nameTok.lexeme,
      initializer: init,
    }, kw);
  }

  /** hissStmt → "hiss" "(" expression ")" "{" declaration* "}" ("mew" "{" declaration* "}")? */
  function hissStatement() {
    const kw = advance(); // consume HISS
    consume(TokenType.LEFT_PAREN, "Expected '(' after 'hiss'");
    const condition = expression();
    consume(TokenType.RIGHT_PAREN, "Expected ')' after hiss condition");
    consume(TokenType.LEFT_BRACE, "Expected '{' after hiss condition");

    const consequent = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      consequent.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after hiss body");

    let alternate = null;
    if (matchAny(TokenType.MEW)) {
      // Could be `mew { }` or chained `mew hiss (...) { }`
      // We'll support only `mew { }` for simplicity as per spec
      consume(TokenType.LEFT_BRACE, "Expected '{' after 'mew'");
      const elseBody = [];
      while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
        elseBody.push(declaration());
      }
      consume(TokenType.RIGHT_BRACE, "Expected '}' after mew body");
      alternate = elseBody;
    }

    return node('IfStatement', { condition, consequent, alternate }, kw);
  }

  /** scratchStmt → "scratch" "(" expression ")" "{" declaration* "}" */
  function scratchStatement() {
    const kw = advance(); // consume SCRATCH
    consume(TokenType.LEFT_PAREN, "Expected '(' after 'scratch'");
    const condition = expression();
    consume(TokenType.RIGHT_PAREN, "Expected ')' after scratch condition");
    consume(TokenType.LEFT_BRACE, "Expected '{' after scratch condition");

    const body = [];
    while (!check(TokenType.RIGHT_BRACE) && !isAtEnd()) {
      body.push(declaration());
    }
    consume(TokenType.RIGHT_BRACE, "Expected '}' after scratch body");

    return node('WhileStatement', { condition, body }, kw);
  }

  /** purrStmt → "purr" expression? */
  function purrStatement() {
    const kw = advance(); // consume PURR
    // If the next token is } or EOF we treat it as `purr null`
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
      throw new MeowParserError('Unexpected end of input', tok.line, tok.column);
    }
    throw new MeowParserError(
      `Unexpected token '${tok.lexeme}'`,
      tok.line, tok.column,
    );
  }

  // ── Entry point ────────────────────────────────────────
  return program();
}
