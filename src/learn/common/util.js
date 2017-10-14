
function fillArray(size, value) {
  return [...Array(size).keys()].map(() => value);
}

module.exports = {
  fillArray,
};
