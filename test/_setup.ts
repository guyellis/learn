import ReactDOM from 'react-dom';

(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

if (!('Temporal' in globalThis)) {
  const { Temporal, toTemporalInstant } = await import('@js-temporal/polyfill');
  (globalThis as unknown as { Temporal: unknown }).Temporal = Temporal;
  (Date.prototype as unknown as { toTemporalInstant: unknown }).toTemporalInstant =
    toTemporalInstant;
}

// Hook Temporal.Now.instant to Date.now in test environment to respect Date.now mocks
Temporal.Now.instant = () => Temporal.Instant.fromEpochMilliseconds(Date.now());

const reactDomWithFindDOMNode = ReactDOM as unknown as {
  findDOMNode?: (node: unknown) => Element | null;
};

if (!reactDomWithFindDOMNode.findDOMNode) {
  reactDomWithFindDOMNode.findDOMNode = (node: unknown) => {
    if (node === null || node === undefined) {
      return null;
    }
    if (typeof Element !== 'undefined' && node instanceof Element) {
      return node;
    }
    const domNode = node as {
      _reactInternals?: { stateNode?: Element | null };
      nodeType?: number;
    };
    if (domNode.nodeType) {
      return node as Element;
    }
    return domNode._reactInternals?.stateNode || null;
  };
}

global.requestAnimationFrame = (done: FrameRequestCallback): number => {
  return Number(setTimeout(done, 0));
};

interface OutputEntry {
  args: unknown[];
  type: string;
}

let unhandledOutput: OutputEntry[] = [];
let logSpy: ReturnType<typeof vi.spyOn> | undefined;
let warnSpy: ReturnType<typeof vi.spyOn> | undefined;
let errorSpy: ReturnType<typeof vi.spyOn> | undefined;
let stderrSpy: ReturnType<typeof vi.spyOn> | undefined;

beforeEach(() => {
  unhandledOutput = [];
  logSpy = vi.spyOn(console, 'log').mockImplementation((...args: unknown[]) => {
    unhandledOutput.push({ args, type: 'console.log' });
  });
  warnSpy = vi.spyOn(console, 'warn').mockImplementation((...args: unknown[]) => {
    unhandledOutput.push({ args, type: 'console.warn' });
  });
  errorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation((warning: unknown, ...args: unknown[]) => {
      if (typeof warning === 'string' && /(Invalid prop|Failed prop type)/gi.test(warning)) {
        throw new Error(warning);
      }
      unhandledOutput.push({ args: [warning, ...args], type: 'console.error' });
    });
  stderrSpy = vi.spyOn(process.stderr, 'write').mockImplementation((...args: unknown[]) => {
    const chunk = args[0];
    unhandledOutput.push({ args: [chunk?.toString()], type: 'process.stderr.write' });
    if (typeof args[1] === 'function') {
      (args[1] as () => void)();
    } else if (typeof args[2] === 'function') {
      (args[2] as () => void)();
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
          `${type}: ${args.map((a: unknown) => (typeof a === 'object' && a !== null ? JSON.stringify(a) : String(a))).join(' ')}`,
      )
      .join('\n');
    unhandledOutput = [];
    throw new Error(`Unexpected unhandled console/stderr output in test:\n${formatted}`);
  }
});
