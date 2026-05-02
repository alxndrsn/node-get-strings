const { assert } = require('chai');

const { getStrings } = require('../src');

describe('getStrings()', () => {
  [
    [ `x = 'hi'`, [ 'hi' ] ],
  ].forEach(([ src, expected ], idx) => {
    it(`should extract strings from example #${idx+1}`, () => {
      // expect
      assert.deepEqual(getStrings(src), expected);
    });
  });
});
