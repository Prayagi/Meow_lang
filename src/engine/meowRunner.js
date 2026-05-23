import { tokenize } from './lexer/lexer.js';
import { parse } from './parser/parser.js';
import { evaluate } from './interpreter/interpreter.js';

/**
 * Orchestrates the execution of Meow language code.
 * Pipeline: String -> Lexer -> Parser -> Interpreter -> Output
 * 
 * @param {string} sourceCode 
 * @returns {object} Execution result containing output, ast, and errors
 */
export function runMeowCode(sourceCode) {
    const result = {
        success: false,
        tokens: null,
        ast: null,
        output: [],
        errors: []
    };

    try {
        // 1. Lexical Analysis
        const tokens = tokenize(sourceCode);
        result.tokens = tokens;

        // 2. Parsing (AST Generation)
        const ast = parse(tokens);
        result.ast = ast;

        // 3. Evaluation (Interpreter)
        const evaluatedOutput = evaluate(ast);
        result.output = evaluatedOutput;
        
        result.success = true;
    } catch (error) {
        result.success = false;
        // Check if it's a known engine error (MeowLexerError or MeowParserError)
        if (error.line !== undefined) {
            result.errors.push({
                type: error.name,
                message: error.message,
                line: error.line,
                column: error.column
            });
        } else {
            // General JS error
            result.errors.push({
                type: 'InternalEngineError',
                message: error.message || 'An unknown error occurred during execution.',
            });
        }
    }

    return result;
}
