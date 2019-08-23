const poly = require('../src/poly');

describe('PolyFill', () => {
  test('should check PolyFill list', (done) => {
    poly(undefined, (error) => {
      expect(error).toBeFalsy();
      done();
    });
  });

  test('should check for dummy property', (done) => {
    const { appendChild } = document.head;
    document.head.appendChild = (js) => js.onload();
    poly(['dummy'], (error) => {
      expect(error).toBeFalsy();
      document.head.appendChild = appendChild;
      done();
    });
  });

  test('should throw a fake error', (done) => {
    const { appendChild } = document.head;
    document.head.appendChild = (js) => js.onerror('Fake Error');
    poly(['dummy'], (error) => {
      expect(error.message).toBe('Failed to load script https://cdn.polyfill.io/v2/polyfill.min.js?features=dummy');
      document.head.appendChild = appendChild;
      done();
    });
  });
});
