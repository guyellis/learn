
const mockLocalStorage = require('./fixtures/local-storage');

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
