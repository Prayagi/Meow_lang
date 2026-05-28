import { tokenize } from './lexer/lexer.js';
import { parse } from './parser/parser.js';
import { evaluate } from './interpreter/interpreter.js';
import { MeowError } from './errors.js';

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
        // If the engine produced a MeowError subclass, use its structured form.
        if (error instanceof MeowError) {
            const errObj = error.toErrorObject();
            // Attach a small code context (2 lines before/after) if we have a line number
            if (errObj.line && errObj.line > 0) {
                const ctx = getCodeContext(sourceCode, errObj.line, 2);
                errObj.codeContext = ctx;
            }
            result.errors.push(errObj);
        } else {
            // General JS error
            result.errors.push({
                type: 'InternalEngineError',
                message: error && error.message ? error.message : 'An unknown error occurred during execution.',
            });
        }
    }

    return result;
}

function getCodeContext(source, line, radius = 2) {
    const lines = source.split(/\r?\n/);
    const idx = Math.max(0, line - 1);
    const start = Math.max(0, idx - radius);
    const end = Math.min(lines.length - 1, idx + radius);
    const snippet = [];
    for (let i = start; i <= end; i++) {
        snippet.push({ line: i + 1, text: lines[i] });
    }
    return snippet;
}
