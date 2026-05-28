import { Environment } from '../runtime/environment.js';
import { MeowRuntimeError } from '../errors.js';

class ReturnException {
    constructor(value) {
        this.value = value;
    }
}

/**
 * Evaluates the given Meow AST and returns the console output.
 * @param {object} ast - The AST root node
 * @returns {string[]} An array of strings representing output
 */
export function evaluate(ast) {
    const globalEnv = new Environment();
    const output = [];

    // Native 'print' equivalent is the 'meow' statement, but we can also
    // inject native functions if we want.
    
    function isTruthy(val) {
        if (val === null) return false;
        if (typeof val === 'boolean') return val;
        return true;
    }

    function isEqual(a, b) {
        return a === b;
    }

    function checkNumberOperands(operator, left, right, node) {
        if (typeof left === 'number' && typeof right === 'number') return;
        throw new MeowRuntimeError(`Operands must be numbers for operator '${operator}'.`, node.line, node.column, 'TYPE_ERROR', { operator });
    }

    function visit(node, env) {
        if (!node) return null;

        switch (node.type) {
            case 'Program':
                let lastResult = null;
                for (const stmt of node.body) {
                    lastResult = visit(stmt, env);
                }
                return lastResult;
            
            case 'VariableDeclaration':
                let initVal = null;
                if (node.initializer) {
                    initVal = visit(node.initializer, env);
                }
                env.define(node.name, initVal);
                return initVal;
            
            case 'ExpressionStatement':
                return visit(node.expression, env);
            
            case 'AssignmentExpression':
                const value = visit(node.value, env);
                env.assign(node.name, value, node);
                return value;
            
            case 'BinaryExpression':
                const left = visit(node.left, env);
                const right = visit(node.right, env);
                const op = node.operator;
                
                switch(op) {
                    case '+': 
                        if (typeof left === 'number' && typeof right === 'number') return left + right;
                        if (typeof left === 'string' || typeof right === 'string') return String(left) + String(right);
                        throw new MeowRuntimeError(`Cannot use '+' on these types.`, node.line, node.column, 'TYPE_ERROR', { operator: '+' });
                    case '-':
                        checkNumberOperands(op, left, right, node);
                        return left - right;
                    case '*':
                        checkNumberOperands(op, left, right, node);
                        return left * right;
                    case '/':
                        checkNumberOperands(op, left, right, node);
                        if (right === 0) throw new MeowRuntimeError('Division by zero.', node.line, node.column, 'DIVISION_BY_ZERO');
                        return left / right;
                    case '%':
                        checkNumberOperands(op, left, right, node);
                        return left % right;
                    case '==': return isEqual(left, right);
                    case '!=': return !isEqual(left, right);
                    case '<': 
                        checkNumberOperands(op, left, right, node);
                        return left < right;
                    case '>':
                        checkNumberOperands(op, left, right, node);
                        return left > right;
                    case '<=':
                        checkNumberOperands(op, left, right, node);
                        return left <= right;
                    case '>=':
                        checkNumberOperands(op, left, right, node);
                        return left >= right;
                }
                break;
            
            case 'LogicalExpression':
                const l = visit(node.left, env);
                if (node.operator === '||') {
                    if (isTruthy(l)) return l;
                    return visit(node.right, env);
                }
                if (node.operator === '&&') {
                    if (!isTruthy(l)) return l;
                    return visit(node.right, env);
                }
                break;
                
            case 'UnaryExpression':
                const operand = visit(node.operand, env);
                if (node.operator === '-') {
                    if (typeof operand !== 'number') {
                        throw new MeowRuntimeError(`Operand must be a number for '-'.`, node.line, node.column, 'TYPE_ERROR', { operator: '-' });
                    }
                    return -operand;
                }
                if (node.operator === '!') {
                    return !isTruthy(operand);
                }
                break;
            
            case 'Literal':
                return node.value;
                
            case 'Identifier':
                return env.get(node.name, node);
            
            case 'PurrStatement':
                const purrVal = node.expression ? visit(node.expression, env) : '';
                output.push(String(purrVal));
                return null;
                
            case 'IfStatement':
                const condition = visit(node.condition, env);
                if (isTruthy(condition)) {
                    const blockEnv = new Environment(env);
                    for (const stmt of node.consequent) visit(stmt, blockEnv);
                } else if (node.alternate) {
                    const blockEnv = new Environment(env);
                    for (const stmt of node.alternate) visit(stmt, blockEnv);
                }
                return null;
                
            case 'WhileStatement':
                let steps = 0;
                while (isTruthy(visit(node.condition, env))) {
                    if (steps++ > 10000) {
                        throw new MeowRuntimeError('Infinite loop detected (step limit reached).', node.line, node.column, 'INFINITE_LOOP');
                    }
                    const blockEnv = new Environment(env);
                    for (const stmt of node.body) visit(stmt, blockEnv);
                }
                return null;

            case 'FunctionDeclaration':
                const func = function(args) {
                    const closure = new Environment(env);
                    for (let i = 0; i < node.params.length; i++) {
                        closure.define(node.params[i], args[i]);
                    }
                    try {
                        for (const stmt of node.body) {
                            visit(stmt, closure);
                        }
                    } catch (e) {
                        if (e instanceof ReturnException) {
                            return e.value;
                        }
                        throw e;
                    }
                    return null;
                };
                func.arity = node.params.length;
                env.define(node.name, func);
                return null;

            case 'ReturnStatement':
                const retVal = node.value ? visit(node.value, env) : null;
                throw new ReturnException(retVal);

            case 'CallExpression':
                const callee = visit(node.callee, env);
                const args = node.arguments.map(arg => visit(arg, env));
                
                if (typeof callee !== 'function') {
                    throw new MeowRuntimeError('Not a function.', node.callee.line, node.callee.column, 'NOT_A_FUNCTION', { found: typeof callee });
                }
                if (args.length !== callee.arity) {
                    throw new MeowRuntimeError(`Expected ${callee.arity} argument(s) but got ${args.length}.`, node.line, node.column, 'ARGUMENT_MISMATCH', { expected: callee.arity, found: args.length });
                }
                return callee(args);

            default:
                throw new MeowRuntimeError(`Unknown node type: ${node.type}`, node.line, node.column, 'UNKNOWN_NODE', { nodeType: node.type });
        }
    }

    try {
        visit(ast, globalEnv);
    } catch (err) {
        // If a ReturnException bubbles to the top level it means the
        // user used `purr` outside of a `pounce` function. Previously
        // we converted this into a runtime error which prevented the
        // program from running and repeatedly showed the same error
        // even for minor edits. Treat a top-level return as a
        // graceful program exit instead: stop execution and return
        // whatever output has been produced so far.
        if (err instanceof ReturnException) {
            return output;
        }
        throw err;
    }

    return output;
}
