export function fillArray(size, value) {
  return [...Array(size).keys()].map(() => value);
}

const util = {
  fillArray,
};

export default util;
