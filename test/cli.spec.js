const { execSync } = require('node:child_process');

const { assert } = require('chai');

describe('get-strings', () => {
  it('should extract strings from a .js file', () => {
    // given
    const actual = get_strings('./test/examples/simple.js');

    // expect
    assert.deepEqual(
      actual,
      [
        'some expected',
        'strings',
        '"could"',
        'go here',
      ],
    );
  });
  
  it('should extract strings from a .coffee file', () => {
    // given
    const actual = get_strings('./test/examples/simple.coffee');

    // expect
    assert.deepEqual(
      actual,
      [
        'some expected',
        'strings',
        '"could"',
        'go here',
      ],
    );
  });
});

function get_strings(...files) {
  return execSync([
    'npx .',
    ...files,
  ].join(' '));
}
