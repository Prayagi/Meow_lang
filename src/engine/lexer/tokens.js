// ============================================================
// tokens.js — Token type definitions for the Meow language
// ============================================================

/**
 * Enum of every token type the lexer can produce.
 * Grouped by category for readability.
 */
export const TokenType = Object.freeze({
  // ── Literals ──────────────────────────────────────────────
  NUMBER:       'NUMBER',
  STRING:       'STRING',
  IDENTIFIER:   'IDENTIFIER',

  // ── Keywords ──────────────────────────────────────────────
  PAW:          'PAW',          // program entry  paw { }
  MEOW:         'MEOW',         // var decl       meow x = expr
  HISS:         'HISS',         // if             hiss (cond) { }
  MEW:          'MEW',          // else           mew { } or else { }
  CHASE:        'CHASE',        // while          chase (cond) { }
  SCRATCH:      'SCRATCH',      // function       scratch name(params) { }
  BRING:        'BRING',        // return         bring expr
  PURR:         'PURR',         // print          purr(expr)
  FUR:          'FUR',          // true
  HAIRBALL:     'HAIRBALL',     // false
  CATNIP:       'CATNIP',       // null

  // ── Operators — arithmetic ────────────────────────────────
  PLUS:         'PLUS',         // +
  MINUS:        'MINUS',        // -
  STAR:         'STAR',         // *
  SLASH:        'SLASH',        // /
  PERCENT:      'PERCENT',      // %

  // ── Operators — comparison ────────────────────────────────
  EQUAL_EQUAL:  'EQUAL_EQUAL',  // ==
  BANG_EQUAL:   'BANG_EQUAL',   // !=
  LESS:         'LESS',         // <
  GREATER:      'GREATER',      // >
  LESS_EQUAL:   'LESS_EQUAL',   // <=
  GREATER_EQUAL:'GREATER_EQUAL',// >=

  // ── Operators — logical ───────────────────────────────────
  AND:          'AND',          // &&
  OR:           'OR',           // ||
  BANG:         'BANG',         // !

  // ── Assignment ────────────────────────────────────────────
  EQUAL:        'EQUAL',        // =

  // ── Delimiters ────────────────────────────────────────────
  LEFT_PAREN:   'LEFT_PAREN',   // (
  RIGHT_PAREN:  'RIGHT_PAREN',  // )
  LEFT_BRACE:   'LEFT_BRACE',   // {
  RIGHT_BRACE:  'RIGHT_BRACE',  // }
  COMMA:        'COMMA',        // ,

  // ── Special ───────────────────────────────────────────────
  EOF:          'EOF',
});

/**
 * Map keyword strings → TokenType.
 * "meowmeow" is handled for backwards compatibility.
 */
export const KEYWORDS = Object.freeze({
  paw:       TokenType.PAW,
  meowmeow:  TokenType.MEOW,        // fallback var decl
  meow:      TokenType.MEOW,        // standard var decl
  hiss:      TokenType.HISS,
  mew:       TokenType.MEW,
  else:      TokenType.MEW,         // fallback else clause
  chase:     TokenType.CHASE,
  scratch:   TokenType.SCRATCH,
  pounce:    TokenType.SCRATCH,     // fallback function declaration
  bring:     TokenType.BRING,
  purr:      TokenType.PURR,
  fur:       TokenType.FUR,
  hairball:  TokenType.HAIRBALL,
  catnip:    TokenType.CATNIP,
});

/**
 * A single token produced by the lexer.
 */
export class Token {
  /**
   * @param {string} type   – One of the TokenType values
   * @param {string} lexeme – The raw source text this token was scanned from
   * @param {*}      value  – Parsed literal value (number, string, boolean, null, or null for non‑literals)
   * @param {number} line   – 1‑based line number
   * @param {number} column – 1‑based column number (of the first character)
   */
  constructor(type, lexeme, value, line, column) {
    this.type   = type;
    this.lexeme = lexeme;
    this.value  = value;
    this.line   = line;
    this.column = column;
  }

  toString() {
    return `Token(${this.type}, ${JSON.stringify(this.lexeme)}, ${JSON.stringify(this.value)}) @ ${this.line}:${this.column}`;
  }
}
