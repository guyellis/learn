import React from 'react';
import constants from '../../common/constants.js';
import Badge from './badge.js';

const { COLOR_TEXT: colorText } = constants;

const badgeBoundaries = [
  '2 seconds or less (per question)',
  'between 2 and 3 seconds (per question)',
  'between 3 and 4 seconds (per question)',
  'more than 4 seconds (per question)',
];

export interface BadgeTotalsProps {
  totals: number[];
}

function badgeTotals(props: BadgeTotalsProps) {
  const { totals } = props;

  return (
    <div>
      {totals.map((total, colorIndex) => {
        const key = colorText[colorIndex];
        const primaryText = `${key} Badge(s) - ${badgeBoundaries[colorIndex]}`;

        return (
          <div key={key}>
            <Badge color={colorIndex} content={total.toString()} />
            <span>{primaryText}</span>
          </div>
        );
      })}
    </div>
  );
}

export default badgeTotals;
