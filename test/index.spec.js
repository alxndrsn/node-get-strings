const { assert } = require('chai');

const { getStrings } = require('../src');

describe('getStrings()', () => {
  [
  ].forEach(([ src, expected ], idx) => {
    it(`should extract strings from example #${idx+1}`, () => {
      // expect
      assert.deepEqual(getStrings(src), expected);
    });
  });
});
