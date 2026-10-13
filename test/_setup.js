import ReactDOM from 'react-dom';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

if (!('Temporal' in globalThis)) {
  const { Temporal, toTemporalInstant } = await import('@js-temporal/polyfill');
  globalThis.Temporal = Temporal;
  Date.prototype.toTemporalInstant = toTemporalInstant;
}

// Hook Temporal.Now.instant to Date.now in test environment to respect Date.now mocks
Temporal.Now.instant = () => Temporal.Instant.fromEpochMilliseconds(Date.now());

if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = (node) => {
    if (node === null || node === undefined) {
      return null;
    }
    if (typeof Element !== 'undefined' && node instanceof Element) {
      return node;
    }
    if (node.nodeType) {
      return node;
    }
    return node._reactInternals?.stateNode || null;
  };
}

global.requestAnimationFrame = (done) => {
  setTimeout(done, 0);
};

let unhandledOutput = [];
let logSpy;
let warnSpy;
let errorSpy;
let stderrSpy;

beforeEach(() => {
  unhandledOutput = [];
  logSpy = vi.spyOn(console, 'log').mockImplementation((...args) => {
    unhandledOutput.push({ args, type: 'console.log' });
  });
  warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args) => {
    unhandledOutput.push({ args, type: 'console.warn' });
  });
  errorSpy = vi.spyOn(console, 'error').mockImplementation((warning, ...args) => {
    if (typeof warning === 'string' && /(Invalid prop|Failed prop type)/gi.test(warning)) {
      throw new Error(warning);
    }
    unhandledOutput.push({ args: [warning, ...args], type: 'console.error' });
  });
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation((chunk, encoding, callback) => {
    unhandledOutput.push({ args: [chunk?.toString()], type: 'process.stderr.write' });
    if (typeof encoding === 'function') {
      encoding();
    } else if (typeof callback === 'function') {
      callback();
    }
    return true;
  });
});

afterEach(() => {
  logSpy?.mockRestore();
  warnSpy?.mockRestore();
  errorSpy?.mockRestore();
  stderrSpy?.mockRestore();

  if (unhandledOutput.length > 0) {
    const formatted = unhandledOutput
      .map(
        ({ args, type }) =>
          `${type}: ${args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' ')}`,
      )
      .join('\n');
    unhandledOutput = [];
    throw new Error(`Unexpected unhandled console/stderr output in test:\n${formatted}`);
  }
});
