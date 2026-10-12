import poly from '../src/poly.js';

describe('PolyFill', () => {
  test('should check PolyFill list', () =>
    new Promise((resolve) => {
      poly(undefined, (error) => {
        expect(error).toBeFalsy();
        resolve();
      });
    }));

  test('should check for dummy property', () =>
    new Promise((resolve) => {
      const { appendChild } = document.head;
      document.head.appendChild = (js) => js.onload();
      poly(['dummy'], (error) => {
        expect(error).toBeFalsy();
        document.head.appendChild = appendChild;
        resolve();
      });
    }));

  test('should throw a fake error', () =>
    new Promise((resolve) => {
      const { appendChild } = document.head;
      document.head.appendChild = (js) => js.onerror('Fake Error');
      poly(['dummy'], (error) => {
        expect(error.message).toBe(
          'Failed to load script https://cdn.polyfill.io/v2/polyfill.min.js?features=dummy',
        );
        document.head.appendChild = appendChild;
        resolve();
      });
    }));
});
