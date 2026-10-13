import React from 'react';
import constants from '../../common/constants.js';
import Badge from './badge.js';
import helper from './helper.js';
import type { PreviousResult } from './types.js';

const { OPERATIONS } = constants;
const spanStyle: React.CSSProperties = { paddingLeft: 20 };
const inABox: React.CSSProperties = {
  borderStyle: 'solid',
  borderWidth: 1,
  marginLeft: 20,
  padding: 3,
};
const check = '\u2714';
const xmark = '\u2717';
const lineStyle: React.CSSProperties = { lineHeight: '35px' };
const correctStyle: React.CSSProperties = { color: 'green', ...lineStyle };
const incorrectStyle: React.CSSProperties = { color: 'red', ...lineStyle };
const spanStyleIncorrect: React.CSSProperties = { color: 'red', ...spanStyle };

export interface RunningResultsProps {
  previousResults: PreviousResult[];
  showIndex?: boolean;
}

function runningResults(props: RunningResultsProps) {
  const { previousResults, showIndex = false } = props;
  const previousResultRows = previousResults.map(({ actuals, id, task, timeTaken }) => {
    const [left, right, opIndex, answer] = task;
    const [actual] = actuals; // most recent answer is first in array
    const incorrects = actuals.slice(1).reverse();
    const operation = OPERATIONS[opIndex];
    const correct = answer === actual;
    const style = correct ? correctStyle : incorrectStyle;
    const colorIndex = helper.getBadgeColorIndex(timeTaken);
    return (
      <div key={id} style={style}>
        {showIndex && <span style={spanStyle}>{`${id + 1})`}</span>}
        <Badge color={colorIndex} content={operation} />
        <span style={spanStyle}>{left}</span>
        <span style={spanStyle}>{operation}</span>
        <span style={spanStyle}>{right}</span>
        <span style={spanStyle}>=</span>
        <span style={inABox}>{actual}</span>
        <span style={spanStyle}>{correct ? check : xmark}</span>
        <span style={spanStyle}>{`${timeTaken} seconds`}</span>
        {!!incorrects.length && (
          <span style={spanStyleIncorrect}>{`Incorrect answer(s): ${incorrects.join()}`}</span>
        )}
      </div>
    );
  });
  return <div>{previousResultRows}</div>;
}

export default runningResults;
