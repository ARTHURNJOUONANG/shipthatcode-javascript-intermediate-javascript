function memoize(fn) {
  const cache = new Map();
  return function (value) {
    if (cache.has(value)) return cache.get(value);
    const result = fn(value);
    cache.set(value, result);
    return result;
  };
}

let squareCalls = 0;
let cubeCalls = 0;

function square(n) {
  squareCalls += 1;
  return n * n;
}

function cube(n) {
  cubeCalls += 1;
  return n * n * n;
}

const memoSquare = memoize(square);
const memoCube = memoize(cube);

const numbers = require('fs').readFileSync(0, 'utf8').trim().split(/\s+/).map(Number);
for (const n of numbers) {
  console.log(n + ' ' + memoSquare(n) + ' ' + memoCube(n));
}
console.log('square calls: ' + squareCalls);
console.log('cube calls: ' + cubeCalls);
