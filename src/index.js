module.exports = { getStrings };

const acorn = require('acorn');
const walk = require('acorn-walk');

function getStrings(src) {
  const strings = [];

  walk.simple(acorn.parse(src, { ecmaVersion:'latest' }), {
    Literal(node) {
      const { value } = node;
      if(typeof value === 'string') strings.push(value);
    },
  });

  return strings;
}
