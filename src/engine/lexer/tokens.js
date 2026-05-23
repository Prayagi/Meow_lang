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
  MEOW:         'MEOW',         // print          meow expr
  MEOWMEOW:     'MEOWMEOW',     // var decl       meowmeow x = expr
  HISS:         'HISS',         // if             hiss (cond) { }
  MEW:          'MEW',          // else           mew { }
  SCRATCH:      'SCRATCH',      // while          scratch (cond) { }
  POUNCE:       'POUNCE',       // function       pounce name(params) { }
  PURR:         'PURR',         // return         purr expr
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
 * "meowmeow" must come BEFORE "meow" when scanning
 * (handled by the lexer's maximal‑munch rule).
 */
export const KEYWORDS = Object.freeze({
  paw:       TokenType.PAW,
  meowmeow:  TokenType.MEOWMEOW,
  meow:      TokenType.MEOW,
  hiss:      TokenType.HISS,
  mew:       TokenType.MEW,
  scratch:   TokenType.SCRATCH,
  pounce:    TokenType.POUNCE,
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
