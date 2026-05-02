const { execSync } = require('node:child_process');

const { assert } = require('chai');

const simpleJsStrings = [
  './something',
  'a string',
  '${x}${y}',
  'a',
  'b',
  'c',
  'astring',
  '\n    Hi ${n}\n  ',
  '',
];

describe('get-strings', () => {
  before(function() {
    this.timeout(10_000);
    execSync(`npx --yes . ${__filename}`);
  });

  describe('output format: null-terminated strings', () => {
    it('should extract strings from a .js file', () => {
      // when
      const actual = execSync(`npx . ./test/examples/simple.js`)
          .toString()
          .split('\0');

      // expect
      assert.deepEqual(actual, simpleJsStrings);
    });
  });

  describe('output format: JSON', () => {
    it('should extract strings from a .js file', () => {
      // when
      const actual = JSON.parse(execSync(`npx . --json ./test/examples/simple.js`).toString());

      // expect
      assert.deepEqual(actual, simpleJsStrings);
    });
  });

  it('should provide helpful usage instructions for a .coffee file', () => {
    try {
      // when
      execSync('npx . ./test/examples/non-existent.coffee');

      assert.fail('should have returned non-zero exit code');
    } catch(err) {
      // expect
      assert.equal(err.stdout.toString(), `
Failed with file: ./test/examples/non-existent.coffee

.coffee not supported; try:

  get-strings <(npx coffee -c "./test/examples/non-existent.coffee")
`);
    }
  });
});
