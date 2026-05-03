module.exports = { getStrings, streamStrings };

const acorn = require('acorn');
const walk = require('acorn-walk');

function collectStrings(src, collect) {
  return walk.simple(acorn.parse(src, { ecmaVersion:'latest' }), {
    Literal(node) {
      fromLiteral(node, collect);
    },
    TemplateLiteral(node) {
      fromTemplateLiteral(node, collect);
    },
  });
}

function getStrings(src) {
  const strings = [];
  collectStrings(src, str => strings.push(str));
  return strings;
}

function streamStrings(src, target) {
  collectStrings(src, str => target.write(str));
}

function fromLiteral(node, fn) {
  const { value } = node;
  if(typeof value === 'string') fn(value);
}

function fromTemplateLiteral(node, fn) {
  const { expressions, quasis } = node;

  const parts = [ quasis[0].value.raw ];
  for(let i=0; i<expressions.length; ++i) parts.push(
    '${' + expressions[i].name + '}',
    quasis[i+1].value.raw,
  );

  fn(parts.join(''));
}
