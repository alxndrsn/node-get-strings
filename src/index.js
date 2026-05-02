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
    TemplateLiteral(node) {
      const { expressions, quasis } = node;

      const parts = [ quasis[0].value.raw ];
      for(let i=0; i<expressions.length; ++i) parts.push(
        '${' + expressions[i].name + '}',
        quasis[i+1].value.raw,
      );

      strings.push(parts.join(''));
    },
  });

  return strings;
}
