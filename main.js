const lines = require('fs').readFileSync(0, 'utf8').trim().split('\n');
const capacity = Number(lines[0]);

const stack = (function (limit) {
  const items = [];
  return {
    push(value) {
      if (items.length >= limit) return false;
      items.push(value);
      return true;
    },
    pop() {
      return items.pop();
    },
    peek() {
      return items.length === 0 ? undefined : items[items.length - 1];
    },
    size() {
      return items.length;
    },
  };
})(capacity);

for (const line of lines.slice(1)) {
  if (line.startsWith('push ')) {
    console.log(stack.push(line.slice(5)) ? 'ok' : 'full');
  } else if (line === 'pop' || line === 'peek') {
    const value = stack[line]();
    console.log(value === undefined ? 'empty' : value);
  } else if (line === 'size') {
    console.log(stack.size());
  } else if (line === 'api') {
    console.log(Object.keys(stack).join(','));
  }
}
