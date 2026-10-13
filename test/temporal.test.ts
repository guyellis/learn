import helper from '../src/learn/math/drill/helper.js';
import { formatFromNow } from '../src/learn/math/drill/score-bar.jsx';

describe('Temporal loading and compatibility', () => {
  test('feature detection identifies native Temporal when present', () => {
    expect('Temporal' in globalThis).toBe(true);
  });

  test('conditional loader installs polyfill when native Temporal is missing', async () => {
    const savedTemporal = globalThis.Temporal;
    const savedToTemporalInstant = Date.prototype.toTemporalInstant;

    try {
      delete (globalThis as { Temporal?: unknown }).Temporal;
      expect('Temporal' in globalThis).toBe(false);

      if (!('Temporal' in globalThis)) {
        const { Temporal, toTemporalInstant } = await import('@js-temporal/polyfill');
        (globalThis as { Temporal?: unknown }).Temporal = Temporal;
        (Date.prototype as unknown as { toTemporalInstant: unknown }).toTemporalInstant =
          toTemporalInstant;
      }

      expect('Temporal' in globalThis).toBe(true);
      expect(typeof globalThis.Temporal.Instant).toBe('function');
      expect(typeof Date.prototype.toTemporalInstant).toBe('function');
    } finally {
      (globalThis as { Temporal?: unknown }).Temporal = savedTemporal;
      Date.prototype.toTemporalInstant = savedToTemporalInstant;
    }
  });

  test('helper and score-bar work with polyfill Temporal implementation', async () => {
    const savedTemporal = globalThis.Temporal;
    const savedDateNow = Date.now;
    const { Temporal: PolyfillTemporal } = await import('@js-temporal/polyfill');

    try {
      (globalThis as { Temporal?: unknown }).Temporal = PolyfillTemporal;
      PolyfillTemporal.Now.instant = () =>
        PolyfillTemporal.Instant.fromEpochMilliseconds(Date.now());

      const instant = helper.toInstant(1500000000000);
      expect(instant.epochMilliseconds).toBe(1500000000000);

      const base = 1506395542848;
      Date.now = vi.fn(() => base + 1000 * 10);
      expect(formatFromNow(base)).toBe('a few seconds ago');
    } finally {
      (globalThis as { Temporal?: unknown }).Temporal = savedTemporal;
      Date.now = savedDateNow;
    }
  });
});
