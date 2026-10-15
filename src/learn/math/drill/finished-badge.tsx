import React from 'react';
import constants from '../../common/constants.js';
import Badge from './badge.js';
import helper from './helper.js';

const finishedBadgeStyle: React.CSSProperties = {};

const {
  ALPHABET: alphabet,
  COLOR_TEXT: colorText,
  OPERATION_NAMES: operationNames,
  OPERATIONS: operations,
} = constants;

export interface FinishedBadgeProps {
  levelIndex: number;
  opIndexes: number[];
  timePerQuestion: number;
  totalCorrectAnswers: number;
}

function noBadge(message: string) {
  return <div style={finishedBadgeStyle}>{message}</div>;
}

function finishedBadge(props: FinishedBadgeProps) {
  const { levelIndex, opIndexes, timePerQuestion, totalCorrectAnswers } = props;

  if (totalCorrectAnswers < 10) {
    const message = `You need 10 or more correct answers to earn a badge. On this 
test you got ${totalCorrectAnswers} answer(s) correct.`;
    return noBadge(message);
  }

  const colorIndex = helper.getBadgeColorIndex(timePerQuestion);
  const color = colorText[colorIndex];
  const letter = alphabet[levelIndex];

  const operationName =
    opIndexes.length === 1
      ? operationNames[opIndexes[0]]
      : `Mixed ${opIndexes.map((opIndex) => operationNames[opIndex]).join(' / ')}`;

  const operation = opIndexes.length === 1 ? operations[opIndexes[0]] : 'M';

  return (
    <div style={finishedBadgeStyle}>
      <span>
        <Badge content={operation} />
      </span>
      <span>
        {` Congratulations on getting a new ${color} Badge for Level ${letter} ${operationName}!`}
      </span>
    </div>
  );
}

export default finishedBadge;
