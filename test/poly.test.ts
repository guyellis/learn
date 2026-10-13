import poly from '../src/poly.js';

describe('PolyFill', () => {
  test('should check PolyFill list', () =>
    new Promise<void>((resolve) => {
      poly(undefined, (error) => {
        expect(error).toBeFalsy();
        resolve();
      });
    }));

  test('should check for dummy property', () =>
    new Promise<void>((resolve) => {
      const { appendChild } = document.head;
      document.head.appendChild = ((node: Node) => {
        const js = node as HTMLScriptElement;
        js.onload?.(new Event('load'));
        return node;
      }) as unknown as typeof document.head.appendChild;
      poly(['dummy'], (error) => {
        expect(error).toBeFalsy();
        document.head.appendChild = appendChild;
        resolve();
      });
    }));

  test('should throw a fake error', () =>
    new Promise<void>((resolve) => {
      const { appendChild } = document.head;
      document.head.appendChild = ((node: Node) => {
        const js = node as HTMLScriptElement;
        js.onerror?.('Fake Error');
        return node;
      }) as unknown as typeof document.head.appendChild;
      poly(['dummy'], (error) => {
        expect(error?.message).toBe(
          'Failed to load script https://cdn.polyfill.io/v2/polyfill.min.js?features=dummy',
        );
        document.head.appendChild = appendChild;
        resolve();
      });
    }));
});
