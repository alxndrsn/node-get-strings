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

  describe('usage message', () => {
    it('--help should output usage message', () => {
      // expect
      assert.match(execSync(`npx . --help`).toString(), /^NAME\n/);
    });
    it('--usage should output usage message', () => {
      // expect
      assert.match(execSync(`npx . --help`).toString(), /^NAME\n/);
    });
    it('no args should output usage message and exit 1', () => {
      // expect
      const err = assert.throws(() => execSync(`npx .`));
      // and
      assert.match(err.stdout.toString(), /^NAME\n/);
    });
  });

  describe('output format: null-terminated strings', () => {
    [
      '--null',
      '-0',
    ].forEach(flag => {
      describe(flag, () => {
        it('should extract strings from a .js file', () => {
          // when
          const actual = execSync(`npx . ${flag} ./test/examples/simple.js`)
              .toString()
              .split('\0');

          // expect
          assert.deepEqual(actual, simpleJsStrings);
        });
      });
    });
  });

  describe('output format: JSON', () => {
    [
      '--json',
      '-j',
    ].forEach(flag => {
      describe(flag, () => {
        it('should extract strings from a .js file', () => {
          // when
          const actual = JSON.parse(execSync(`npx . ${flag} ./test/examples/simple.js`).toString());

          // expect
          assert.deepEqual(actual, simpleJsStrings);
        });
      });
    });
  });

  describe('output format: JSON lines', () => {
    [
      '', // default
      '--jsonl',
      '-l',
    ].forEach(flag => {
      describe(flag, () => {
        it('should extract strings from a .js file', () => {
          // when
          const raw = execSync(`npx . ${flag} ./test/examples/simple.js`)
              .toString();

          // then
          assert.equal(raw.at(-1), '\n');

          // when
          const actual = raw
              .split('\n')
              .filter(it => it)
              .map(line => JSON.parse(line));

          // then
          assert.deepEqual(actual, simpleJsStrings);
        });
      });
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
