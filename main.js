// A scope is a plain object. bindings is an array of { name, value, kind }; kind is 'let' or 'var'.
function makeScope(parent, isFunction) {
    return {
        parent: parent,           // enclosing scope, or null at the top level
        isFunction: isFunction,   // true for the top level and for `call` scopes
        bindings: [],
    };
}

// The binding stored in THIS scope only (not its parents), or null.
function ownBinding(scope, name) {
    for (const b of scope.bindings) {
        if (b.name === name) return b;
    }
    return null;
}

// Bind name in THIS scope. Return false if this scope already has the name.
function declareLet(scope, name, value) {
    if (ownBinding(scope, name)) return false;
    scope.bindings.push({ name, value, kind: 'let' });
    return true;
}

// Bind name in the nearest function scope. Return false if it already holds a let of that name.
function declareVar(scope, name, value) {
    let target = scope;
    while (target && !target.isFunction) target = target.parent;
    if (!target) return false;
    const existing = ownBinding(target, name);
    if (existing) {
        if (existing.kind === 'let') return false;
        existing.value = value;
        return true;
    }
    target.bindings.push({ name, value, kind: 'var' });
    return true;
}

// Return the binding from the innermost scope that has name, or null.
function find(scope, name) {
    let current = scope;
    while (current) {
        const binding = ownBinding(current, name);
        if (binding) return binding;
        current = current.parent;
    }
    return null;
}

const lines = require('fs').readFileSync(0, 'utf-8').split('\n').filter(l => l.trim() !== '');
let scope = makeScope(null, true);
for (const line of lines) {
    const [cmd, name, value] = line.trim().split(' ');
    if (cmd === 'enter') {
        scope = makeScope(scope, false);
    } else if (cmd === 'call') {
        scope = makeScope(scope, true);
    } else if (cmd === 'exit') {
        scope = scope.parent;
    } else if (cmd === 'let' || cmd === 'var') {
        const ok = cmd === 'let' ? declareLet(scope, name, value) : declareVar(scope, name, value);
        if (!ok) console.log('SyntaxError: ' + name + ' has already been declared');
    } else if (cmd === 'set' || cmd === 'print') {
        const binding = find(scope, name);
        if (binding === null) console.log('ReferenceError: ' + name + ' is not defined');
        else if (cmd === 'set') binding.value = value;
        else console.log(binding.value);
    }
}
