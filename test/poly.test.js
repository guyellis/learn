const poly = require('../src/poly');

describe('PolyFill', () => {
  test('should check PolyFill list', (done) => {
    poly(undefined, (error) => {
      expect(error).toBeFalsy();
      done();
    });
  });
});
