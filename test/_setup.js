import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const origSetState = React.Component.prototype.setState;
React.Component.prototype.setState = function setState(updater, callback) {
  renderer.act(() => {
    origSetState.call(this, updater, callback);
  });
};

if (!ReactDOM.findDOMNode) {
  ReactDOM.findDOMNode = (node) => {
    if (node == null) return null;
    if (typeof Element !== 'undefined' && node instanceof Element) return node;
    if (node.nodeType) return node;
    return node._reactInternals?.stateNode || null;
  };
}

const origCreate = renderer.create;
renderer.create = function create(element, options) {
  let res;
  renderer.act(() => {
    res = origCreate.call(renderer, element, options);
  });
  if (res && res.update) {
    const origUpdate = res.update;
    res.update = function update(newElement) {
      renderer.act(() => {
        origUpdate.call(res, newElement);
      });
    };
  }
  return res;
};

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
