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
   * @param {string} kind       – error category (Lexer / Parser / Runtime)
   * @param {string} message    – technical description
   * @param {number} line       – 1‑based line (0 if unknown)
   * @param {number} column     – 1‑based column (0 if unknown)
   */
  constructor(kind, message, line = 0, column = 0) {
    super(message);
    this.name      = 'MeowError';
    this.kind      = kind;
    this.line       = line;
    this.column     = column;
    this.catMessage = translateToCat(kind, message);
  }

  toErrorObject() {
    return {
      message:    this.message,
      line:       this.line,
      column:     this.column,
      catMessage: this.catMessage,
    };
  }
}

export class MeowLexerError extends MeowError {
  constructor(message, line, column) {
    super('Lexer', message, line, column);
    this.name = 'MeowLexerError';
  }
}

export class MeowParserError extends MeowError {
  constructor(message, line, column) {
    super('Parser', message, line, column);
    this.name = 'MeowParserError';
  }
}

export class MeowRuntimeError extends MeowError {
  constructor(message, line, column) {
    super('Runtime', message, line, column);
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
    hint: 'Use meowmeow name = value to declare a variable.',
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
    hint: 'Declare it with meowmeow before using it.',
  },
  {
    pattern: /not a function/i,
    cat: '🐟 You tried to call something that isn\'t a function. That\'s like trying to eat a toy fish!',
    hint: 'Make sure you declared the function with pounce before calling it.',
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
    hint: 'Check your scratch loops — make sure the condition eventually becomes false.',
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
    pattern: /purr.*outside.*function|return.*outside/i,
    cat: '🚫 You can\'t purr (return) outside a function! That\'s like coughing up a hairball in public.',
    hint: 'Move the purr statement inside a pounce function.',
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
 * Utility: create a nice formatted error string for display.
 */
export function formatMeowError(err) {
  if (err instanceof MeowError) {
    const loc = err.line ? ` (line ${err.line}, col ${err.column})` : '';
    return `[${err.kind} Error]${loc}: ${err.message}\n\n${err.catMessage}`;
  }
  return `[Error]: ${err.message || String(err)}`;
}
