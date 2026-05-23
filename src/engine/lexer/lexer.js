// ============================================================
// lexer.js — Tokenizer for the Meow language
// ============================================================

import { TokenType, KEYWORDS, Token } from './tokens.js';
import { MeowLexerError } from '../errors.js';

/**
 * Tokenise a Meow source string into an array of Token objects.
 *
 * The lexer is hand‑written (no regex‑table approach) for clear
 * error positions and maximal‑munch keyword handling.
 *
 * @param {string} source
 * @returns {Token[]}
 * @throws {MeowLexerError}
 */
export function tokenize(source) {
  const tokens = [];
  let pos    = 0;   // current byte offset
  let line   = 1;   // 1‑based line
  let column = 1;   // 1‑based column

  const length = source.length;

  // ── Helpers ─────────────────────────────────────────────

  /** Peek at the current character without consuming it. */
  function peek() {
    return pos < length ? source[pos] : '\0';
  }

  /** Peek one character ahead. */
  function peekNext() {
    return pos + 1 < length ? source[pos + 1] : '\0';
  }

  /** Consume and return the current character, advancing position. */
  function advance() {
    const ch = source[pos];
    pos++;
    if (ch === '\n') {
      line++;
      column = 1;
    } else {
      column++;
    }
    return ch;
  }

  /** If the current char matches `expected`, consume it and return true. */
  function match(expected) {
    if (pos < length && source[pos] === expected) {
      advance();
      return true;
    }
    return false;
  }

  /** Create a token using the given type (lexeme derived from span). */
  function makeToken(type, lexeme, value, startLine, startCol) {
    tokens.push(new Token(type, lexeme, value, startLine, startCol));
  }

  // ── Main scan loop ────────────────────────────────────────

  while (pos < length) {
    const startLine = line;
    const startCol  = column;
    const ch = advance();

    switch (ch) {
      // ── Whitespace ──
      case ' ': case '\t': case '\r': case '\n':
        break; // skip

      // ── Single‑character tokens ──
      case '(': makeToken(TokenType.LEFT_PAREN,  '(', null, startLine, startCol); break;
      case ')': makeToken(TokenType.RIGHT_PAREN, ')', null, startLine, startCol); break;
      case '{': makeToken(TokenType.LEFT_BRACE,  '{', null, startLine, startCol); break;
      case '}': makeToken(TokenType.RIGHT_BRACE, '}', null, startLine, startCol); break;
      case ',': makeToken(TokenType.COMMA,       ',', null, startLine, startCol); break;
      case '+': makeToken(TokenType.PLUS,        '+', null, startLine, startCol); break;
      case '-': makeToken(TokenType.MINUS,       '-', null, startLine, startCol); break;
      case '*': makeToken(TokenType.STAR,        '*', null, startLine, startCol); break;
      case '%': makeToken(TokenType.PERCENT,     '%', null, startLine, startCol); break;

      // ── Slash or comment ──
      case '/':
        if (match('/')) {
          // Single‑line comment — skip until EOL
          while (pos < length && peek() !== '\n') advance();
        } else {
          makeToken(TokenType.SLASH, '/', null, startLine, startCol);
        }
        break;

      // ── One or two character operators ──
      case '=':
        if (match('=')) {
          makeToken(TokenType.EQUAL_EQUAL, '==', null, startLine, startCol);
        } else {
          makeToken(TokenType.EQUAL, '=', null, startLine, startCol);
        }
        break;

      case '!':
        if (match('=')) {
          makeToken(TokenType.BANG_EQUAL, '!=', null, startLine, startCol);
        } else {
          makeToken(TokenType.BANG, '!', null, startLine, startCol);
        }
        break;

      case '<':
        if (match('=')) {
          makeToken(TokenType.LESS_EQUAL, '<=', null, startLine, startCol);
        } else {
          makeToken(TokenType.LESS, '<', null, startLine, startCol);
        }
        break;

      case '>':
        if (match('=')) {
          makeToken(TokenType.GREATER_EQUAL, '>=', null, startLine, startCol);
        } else {
          makeToken(TokenType.GREATER, '>', null, startLine, startCol);
        }
        break;

      case '&':
        if (match('&')) {
          makeToken(TokenType.AND, '&&', null, startLine, startCol);
        } else {
          throw new MeowLexerError(
            `Unexpected character '&'. Did you mean '&&'?`,
            startLine, startCol,
          );
        }
        break;

      case '|':
        if (match('|')) {
          makeToken(TokenType.OR, '||', null, startLine, startCol);
        } else {
          throw new MeowLexerError(
            `Unexpected character '|'. Did you mean '||'?`,
            startLine, startCol,
          );
        }
        break;

      // ── Strings ──
      case '"': {
        let value = '';
        while (pos < length && peek() !== '"') {
          if (peek() === '\n') {
            // allow multi‑line strings but track position
          }
          const c = advance();
          if (c === '\\' && pos < length) {
            // Handle escape sequences
            const escaped = advance();
            switch (escaped) {
              case 'n':  value += '\n'; break;
              case 't':  value += '\t'; break;
              case '"':  value += '"';  break;
              case '\\': value += '\\'; break;
              default:   value += '\\' + escaped; break;
            }
          } else {
            value += c;
          }
        }
        if (pos >= length) {
          throw new MeowLexerError(
            'Unterminated string literal',
            startLine, startCol,
          );
        }
        advance(); // consume the closing "
        const lexeme = source.slice(
          // reconstruct isn't needed, we have the value
          0, 0, // placeholder — we'll store the original text differently
        );
        makeToken(TokenType.STRING, `"${value}"`, value, startLine, startCol);
        break;
      }

      default: {
        // ── Numbers ──
        if (isDigit(ch)) {
          let numStr = ch;
          while (isDigit(peek())) numStr += advance();
          // Decimal part
          if (peek() === '.' && isDigit(peekNext())) {
            numStr += advance(); // the '.'
            while (isDigit(peek())) numStr += advance();
          }
          makeToken(TokenType.NUMBER, numStr, Number(numStr), startLine, startCol);
          break;
        }

        // ── Identifiers & keywords ──
        if (isAlpha(ch)) {
          let word = ch;
          while (isAlphaNumeric(peek())) word += advance();

          // Check keyword table
          const kwType = KEYWORDS[word];
          if (kwType !== undefined) {
            // Determine literal value for boolean/null keywords
            let kwValue = null;
            if (kwType === TokenType.FUR)      kwValue = true;
            if (kwType === TokenType.HAIRBALL)  kwValue = false;
            // CATNIP keeps value = null (which is correct)
            makeToken(kwType, word, kwValue, startLine, startCol);
          } else {
            makeToken(TokenType.IDENTIFIER, word, null, startLine, startCol);
          }
          break;
        }

        // ── Unknown character ──
        throw new MeowLexerError(
          `Unexpected character '${ch}'`,
          startLine, startCol,
        );
      }
    }
  }

  // Always end with an EOF token
  makeToken(TokenType.EOF, '', null, line, column);
  return tokens;
}

// ── Character classification helpers ────────────────────────

function isDigit(ch) {
  return ch >= '0' && ch <= '9';
}

function isAlpha(ch) {
  return (ch >= 'a' && ch <= 'z') ||
         (ch >= 'A' && ch <= 'Z') ||
         ch === '_';
}

function isAlphaNumeric(ch) {
  return isAlpha(ch) || isDigit(ch);
}
