export function fillArray<T>(size: number, value: T): T[] {
  return [...Array(size).keys()].map(() => value);
}

const util = {
  fillArray,
};

export default util;
