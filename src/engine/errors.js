// ============================================================
// errors.js — Cat‑themed error translator for the Meow language
// ============================================================

// ── Base error class ────────────────────────────────────────

/**
 * Every Meow‑engine error extends this so we always carry
 * position info and a fun cat translation.
 */
export class MeowError extends Error {
  /**
   * @param {string} kind       – error category (Lexer | Parser | Runtime)
   * @param {string} message    – technical description
   * @param {number} line       – 1‑based line (0 if unknown)
   * @param {number} column     – 1‑based column (0 if unknown)
   * @param {string} code       – machine friendly error code (e.g. MISSING_PAW)
   * @param {object} meta       – optional extra structured info (found/expected/...)
   */
  constructor(kind, message, line = 0, column = 0, code = undefined, meta = undefined) {
    super(message);
    this.name      = 'MeowError';
    this.kind      = kind;
    this.line      = line;
    this.column    = column;
    this.code      = code || mapMessageToErrorCode(kind, message);
    this.meta      = meta || {};
    this.catMessage = translateToCat(kind, message);
  }

  /**
   * Return a structured error object intended for the UI / AI.
   */
  toErrorObject() {
    return {
      type:    this.code || `${this.kind.toUpperCase()}_ERROR`,
      kind:    this.kind,
      message: this.message,
      line:    this.line,
      column:  this.column,
      meta:    this.meta || {},
    };
  }
}

export class MeowLexerError extends MeowError {
  constructor(message, line, column, code, meta) {
    super('Lexer', message, line, column, code, meta);
    this.name = 'MeowLexerError';
  }
}

export class MeowParserError extends MeowError {
  constructor(message, line, column, code, meta) {
    super('Parser', message, line, column, code, meta);
    this.name = 'MeowParserError';
  }
}

export class MeowRuntimeError extends MeowError {
  constructor(message, line, column, code, meta) {
    super('Runtime', message, line, column, code, meta);
    this.name = 'MeowRuntimeError';
  }
}

// ── Cat‑themed translation tables ───────────────────────────

/**
 * Each entry is { pattern: RegExp, cat: string | (match) => string }.
 * First match wins.
 */
const CAT_TRANSLATIONS = [
  // ── Lexer errors ──────────────────────────────────────────
  {
    pattern: /unterminated string/i,
    cat: '🧶 Oh no! You left a string dangling like a yarn ball! Close your quotes, hooman.',
    hint: 'Make sure every opening " has a matching closing ".',
  },
  {
    pattern: /unexpected character/i,
    cat: '🐾 *confused cat noises* I found a weird squiggle I don\'t understand.',
    hint: 'Check for typos or unsupported characters near the error location.',
  },

  // ── Parser errors ─────────────────────────────────────────
  {
    pattern: /expected.*paw/i,
    cat: '🐱 Every cat program needs a "paw { }" to start! No paw, no play!',
    hint: 'Wrap your code in paw { ... }.',
  },
  {
    pattern: /expected.*'\{'/i,
    cat: '📦 I expected an opening brace { but didn\'t find one. Even cats need boxes!',
    hint: 'Add a { to open the block.',
  },
  {
    pattern: /expected.*'\}'/i,
    cat: '📦 You opened a box but never closed it! Add a } — cats like tidy boxes.',
    hint: 'Add a matching } to close the block.',
  },
  {
    pattern: /expected.*'\)'/i,
    cat: '🐾 You opened a parenthesis but forgot to close it. Tsk tsk, sloppy paws!',
    hint: 'Add a matching ) to close the expression.',
  },
  {
    pattern: /expected.*'\('/i,
    cat: '🐾 I need an opening ( here — think of it as cupping your paws.',
    hint: 'Add a ( before the condition or arguments.',
  },
  {
    pattern: /expected identifier/i,
    cat: '🏷️ I need a name here! Even kittens have names.',
    hint: 'Provide a variable or function name (letters, digits, underscores).',
  },
  {
    pattern: /expected.*'='/i,
    cat: '✏️ You forgot the = sign. How am I supposed to assign anything without it?',
    hint: 'Use meow name = value to declare a variable.',
  },
  {
    pattern: /unexpected token/i,
    cat: '😾 I didn\'t expect that here! It\'s like finding a cucumber behind a cat.',
    hint: 'Double‑check the syntax around the error location.',
  },
  {
    pattern: /unexpected end/i,
    cat: '😿 The code ended too soon! Did you fall asleep on the keyboard?',
    hint: 'Make sure all blocks and expressions are complete.',
  },

  // ── Runtime errors ────────────────────────────────────────
  {
    pattern: /undefined variable/i,
    cat: '🔍 I can\'t find that variable anywhere — and I looked under the couch!',
    hint: 'Declare it with meow before using it.',
  },
  {
    pattern: /not a function/i,
    cat: '🐟 You tried to call something that isn\'t a function. That\'s like trying to eat a toy fish!',
    hint: 'Make sure you declared the function with scratch before calling it.',
  },
  {
    pattern: /argument.*mismatch|expected \d+ argument/i,
    cat: '🐾 Wrong number of treats! The function expected a different amount.',
    hint: 'Check the function declaration to see how many parameters it takes.',
  },
  {
    pattern: /division by zero/i,
    cat: '💥 You tried to divide by zero! Even cats know that breaks the universe!',
    hint: 'Make sure the divisor isn\'t zero before dividing.',
  },
  {
    pattern: /step limit|infinite loop|too many steps/i,
    cat: '😵‍💫 Your program ran around in circles like a cat chasing its tail! I had to stop it.',
    hint: 'Check your chase loops — make sure the condition eventually becomes false.',
  },
  {
    pattern: /recursion|call stack|stack overflow|depth/i,
    cat: '🌀 Too many nested function calls! I\'m dizzy like a cat in a spinning chair.',
    hint: 'Make sure your recursive function has a proper base case.',
  },
  {
    pattern: /type error|cannot (add|subtract|multiply|divide|compare)/i,
    cat: '🤔 You\'re mixing types like kibble and tuna — they don\'t go together that way!',
    hint: 'Check that both sides of the operator have compatible types.',
  },
  {
    pattern: /cannot use.*operator/i,
    cat: '🙀 That operator doesn\'t work with those values. It\'s like a cat wearing boots — wrong fit!',
    hint: 'Make sure the operand types match what the operator expects.',
  },
  {
    pattern: /bring.*outside.*function|return.*outside/i,
    cat: '🚫 You can\'t bring (return) outside a function! That\'s like coughing up a hairball in public.',
    hint: 'Move the bring statement inside a scratch function.',
  },
];

/** Fallback messages when nothing specific matches. */
const FALLBACK_CATS = {
  Lexer:   '😿 *hisses at the source code* Something went wrong while reading your program.',
  Parser:  '😾 I can\'t understand the structure of your code. It\'s like a ball of tangled yarn!',
  Runtime: '🙀 Something went wrong while running your program. Even cats have bad days!',
};

const FALLBACK_HINTS = {
  Lexer:   'Check your source code for typos or unsupported characters.',
  Parser:  'Review the Meow language syntax and make sure your code follows it.',
  Runtime: 'Double‑check variable names, function calls, and operator usage.',
};

// ── Translator ──────────────────────────────────────────────

/**
 * Translates a technical error message into a cat‑themed one.
 * @param {string} kind    – "Lexer" | "Parser" | "Runtime"
 * @param {string} message – technical description
 * @returns {string} a fun, helpful cat message
 */
function translateToCat(kind, message) {
  for (const entry of CAT_TRANSLATIONS) {
    if (entry.pattern.test(message)) {
      return `${entry.cat}\n💡 Hint: ${entry.hint}`;
    }
  }
  const fallbackCat  = FALLBACK_CATS[kind]  || FALLBACK_CATS.Runtime;
  const fallbackHint = FALLBACK_HINTS[kind] || FALLBACK_HINTS.Runtime;
  return `${fallbackCat}\n💡 Hint: ${fallbackHint}`;
}

/**
 * Map a human message to a compact error code. This is used when the
 * creator of the MeowError didn't explicitly provide a code.
 */
function mapMessageToErrorCode(kind, message) {
  if (!message) return undefined;
  const m = message.toLowerCase();
  if (/expected.*paw/.test(m)) return 'MISSING_PAW';
  if (/expected '\{'/.test(m) || /expected\{/.test(m)) return 'MISSING_LEFT_BRACE';
  if (/expected '\}'/.test(m) || /expected\}/.test(m)) return 'MISSING_RIGHT_BRACE';
  if (/expected '\('/.test(m)) return 'MISSING_LEFT_PAREN';
  if (/expected '\)'/.test(m)) return 'MISSING_RIGHT_PAREN';
  if (/expected identifier/i.test(m)) return 'MISSING_IDENTIFIER';
  if (/expected '='/.test(m) || /expected '='/i.test(m)) return 'MISSING_EQUAL';
  if (/unexpected token/i.test(m)) return 'UNEXPECTED_TOKEN';
  if (/unexpected end/i.test(m)) return 'UNEXPECTED_EOF';
  if (/undefined variable/i.test(m)) return 'UNDEFINED_VARIABLE';
  if (/not a function/i.test(m)) return 'NOT_A_FUNCTION';
  if (/division by zero/i.test(m)) return 'DIVISION_BY_ZERO';
  if (/infinite loop/i.test(m) || /step limit/i.test(m)) return 'INFINITE_LOOP';
  if (/return statement outside function/i.test(m)) return 'RETURN_OUTSIDE_FUNCTION';
  if (/operands must be numbers/i.test(m) || /cannot use '\+'/.test(m)) return 'TYPE_ERROR';
  return undefined;
}

/**
 * Utility: create a nice formatted error string for display.
 */
export function formatMeowError(err) {
  if (err instanceof MeowError) {
    const loc = err.line ? ` (line ${err.line}, col ${err.column})` : '';
    return `[${err.kind} Error]${loc}: ${err.message}\n\n${err.catMessage}`;
  }
  return `[Error]: ${err.message || String(err)}`;
}
