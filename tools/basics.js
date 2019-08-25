// This module generates pages of basic multiplication and division problems.
// Multiplication: From 1x1 to 12x12
// Division: From 1/1 to 144/12

const _ = require('lodash');
const fse = require('fs-extra');
const path = require('path');

const allPairs = () => {
  const numbers = [...Array(12).keys()].map(a => a + 1);

  const m = numbers.reduce((acc, num) => {
    const pairs = numbers.map(a => ([a, num]));
    return acc.concat(pairs);
  }, []);


  const d = numbers.reduce((acc, num) => {
    const pairs = numbers.map(a => ([a * num, num]));
    return acc.concat(pairs);
  }, []);

  const mult = m.reduce((acc, [a, b]) => acc.concat(`${a} x ${b} =`), []);
  const div = d.reduce((acc, [a, b]) => acc.concat(`${a} / ${b} =`), []);

  return _.shuffle(mult.concat(div));
};

const math = allPairs();

const text = math.join('\n');

fse.writeFileSync(path.join(__dirname, 'problems.txt'), text, 'utf-8');
