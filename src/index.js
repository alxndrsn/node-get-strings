module.exports = { getStrings, streamStrings };

const acorn = require('acorn');
const walk = require('acorn-walk');

function getStrings(src) {
  const strings = [];

  walk.simple(acorn.parse(src, { ecmaVersion:'latest' }), {
    Literal(node) {
      fromLiteral(node, str => strings.push(str));
    },
    TemplateLiteral(node) {
      strings.push(fromTemplateLiteral(node));
    },
  });

  return strings;
}

function streamStrings(src, target) {
  walk.simple(acorn.parse(src, { ecmaVersion:'latest' }), {
    Literal(node) {
      fromLiteral(node, str => target.write(str));
    },
    TemplateLiteral(node) {
      target.write(fromTemplateLiteral(node));
    },
  });
}

function fromLiteral(node, fn) {
  const { value } = node;
  if(typeof value === 'string') fn(value);
}

function fromTemplateLiteral(node) {
  const { expressions, quasis } = node;

  const parts = [ quasis[0].value.raw ];
  for(let i=0; i<expressions.length; ++i) parts.push(
    '${' + expressions[i].name + '}',
    quasis[i+1].value.raw,
  );

  return parts.join('');
}
