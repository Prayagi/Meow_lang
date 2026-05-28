import { MeowRuntimeError } from '../errors.js';

export class Environment {
    constructor(enclosing = null) {
        this.values = new Map();
        this.enclosing = enclosing;
    }

    define(name, value) {
        this.values.set(name, value);
    }

    get(name, node = null) {
        if (this.values.has(name)) {
            return this.values.get(name);
        }
        if (this.enclosing !== null) {
            return this.enclosing.get(name, node);
        }
        
        const line = node ? node.line : 0;
        const col = node ? node.column : 0;
        throw new MeowRuntimeError(`Undefined variable '${name}'.`, line, col, 'UNDEFINED_VARIABLE', { name });
    }

    assign(name, value, node = null) {
        if (this.values.has(name)) {
            this.values.set(name, value);
            return;
        }
        if (this.enclosing !== null) {
            this.enclosing.assign(name, value, node);
            return;
        }
        
        const line = node ? node.line : 0;
        const col = node ? node.column : 0;
        throw new MeowRuntimeError(`Undefined variable '${name}'.`, line, col, 'UNDEFINED_VARIABLE', { name });
    }
}
