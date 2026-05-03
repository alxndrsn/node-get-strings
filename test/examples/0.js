const { g } = require('./something');
const x = 123;
const y = 'a string';
console.log(`${x}${y}`);
const z = 'a' + 'b' + 'c';
switch(Math.random()) {
  case 'astring': process.exit(1); break;
  default: process.exit(2); console.log(x, y, z);
}
f(x);
function f(n) {
  g(`
    Hi ${n}
  `);
}
console.log(``);
