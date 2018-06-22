const PropTypes = require('prop-types');
const React = require('react');
const Badge = require('./badge');
const constants = require('../../common/constants');

const { COLOR_TEXT: colorText } = constants;

const badgeBoundaries = [
  '2 seconds or less (per question)',
  'between 2 and 3 seconds (per question)',
  'between 3 and 4 seconds (per question)',
  'more than 4 seconds (per question)',
];

function badgeTotals(props) {
  const { totals } = props;

  return (
    <div>
      {
        totals.map((total, colorIndex) => {
          const key = colorText[colorIndex];
          const primaryText = `${key} Badge(s) - ${badgeBoundaries[colorIndex]}`;

          return (
            <div key={key}>
              <Badge color={colorIndex} content={total.toString()} />
              <span>
                {primaryText}
              </span>
            </div>
          );
        })
      }
    </div>
  );
}

badgeTotals.propTypes = {
  totals: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};

module.exports = badgeTotals;
