
const mockLocalStorage = require('./fixtures/local-storage');

global.localStorage = {
  setItem: (key, value) => {
    mockLocalStorage[key] = value;
  },
  getItem: key => mockLocalStorage[key],
};

global.requestAnimationFrame = (done) => {
  setTimeout(done, 0);
};
