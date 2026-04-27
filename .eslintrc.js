module.exports = {
  extends: [ 'eslint:recommended' ],
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'comma-dangle': [ 'error', {
      arrays:    'always-multiline',
      objects:   'always-multiline',
      imports:   'always-multiline',
      exports:   'always-multiline',
      functions: 'ignore',
    } ],
    'eol-last': 'error',
    'key-spacing': [ 'error', {
      singleLine: { 'beforeColon':false, 'afterColon':false },
      multiLine:  { 'beforeColon':false, 'afterColon':true, mode:'minimum' },
    } ],
    'no-cond-assign': 'off',
    'no-multiple-empty-lines': [ 'error', { max:99999, maxBOF:0, maxEOF:0 } ],
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-undef-init': 'error',
    'no-unused-expressions': 'error',
    'no-unused-vars': [ 'error', { caughtErrorsIgnorePattern:'^_$' } ],
    'object-curly-spacing': [ 'error', 'always' ],
    'semi': [ 'error', 'always' ],
  },
  globals: {
  },
};
