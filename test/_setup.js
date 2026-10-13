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

// Prevent tests from passing if a prop-type is not correct by
// throwing an error instead of doing a console.error()
const { error } = console;
// eslint-disable-next-line no-console
console.error = (warning, ...args) => {
  if (/(Invalid prop|Failed prop type)/gi.test(warning)) {
    throw new Error(warning);
  }
  error.apply(console, [warning, ...args]);
};
