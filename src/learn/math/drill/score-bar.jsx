const constants = require('../../common/constants');
const PropTypes = require('prop-types');
const React = require('react');

const {
  COLOR_TEXT: colorText,
  COLOR_HTML: htmlColors,
  BADGE_BOUNDARIES: badgeBoundaries,
} = constants;

const divStyle = {
  width: '100%',
};

const divColorStyle = {
  width: '100%',
  display: 'flex',
  height: '35px',
  fontSize: 'x-large',
};

const divTimeStyle = {
  width: '100%',
  display: 'flex',
  height: '35px',
  fontSize: 'x-large',
  marginTop: '5px',
};

// const timePerQuestion = 1;

function scoreBar({ timePerQuestion }) {
// function scoreBar() {
  let maxVal = Math.max(...badgeBoundaries);

  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  const timePerQuestionLimit = Math.min(maxVal, timePerQuestion);
  const extra = badgeBoundaries.concat(maxVal);
  const widths = extra.reduce((acc, boundary, index) => {
    if (index !== badgeBoundaries.length) {
      acc.push(Math.round((100 * (extra[index + 1] - boundary)) / maxVal));
    }
    return acc;
  }, []);

  const times = [
    ((timePerQuestionLimit * 100) / maxVal) - 5,
    10,
    (((maxVal - timePerQuestionLimit) * 100) / maxVal) - 5,
  ];
  // This is totally cheating by replacing the O in YOU with an O that has a caret
  // above it to be the indicator of where the user scored and then putting that word
  // at the location under the badge color bar.
  const timesText = ['', 'Y\u00D4U', ''];

  return (
    <div style={divStyle}>
      <div style={divColorStyle}>
        {
          colorText.map((color, index) => {
            const style = {
              backgroundColor: htmlColors[index],
              width: `${widths[index]}%`,
              textAlign: 'center',
            };
            return (<span
              key={color}
              style={style}
            >
              {color}
            </span>);
          },
          )
        }
      </div>
      <div style={divTimeStyle}>
        {
          times.map((time, index) => {
            const style = {
              width: `${time}%`,
            };
            return (<span key={time} style={style}>{timesText[index]}</span>);
          })
        }
      </div>
    </div>
  );
}

scoreBar.propTypes = {
  timePerQuestion: PropTypes.number.isRequired,
};

module.exports = scoreBar;
