const constants = require('../../common/constants');
const PropTypes = require('prop-types');
const React = require('react');

const {
  COLOR_TEXT: colorText,
  COLOR_HTML: htmlColors,
  BADGE_BOUNDARIES: badgeBoundaries,
} = constants;

const divStyle = {
  width: '150px',
  // height: '300px',
  display: 'flex',
};

const divColorStyle = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  fontSize: 'large',
};

const divYouStyle = {
  width: '50%',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  fontSize: 'large',
  textAlign: 'right',
  // marginTop: '5px',
};

function renderColors(times) {
  let maxVal = Math.max(...badgeBoundaries);
  const { timePerQuestion } = times[0];
  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  divStyle.height = `${maxVal * 50}px`;

  const extra = badgeBoundaries.concat(maxVal);
  const widths = extra.reduce((acc, boundary, index) => {
    if (index !== badgeBoundaries.length) {
      acc.push(Math.round((100 * (extra[index + 1] - boundary)) / maxVal));
    }
    return acc;
  }, []);

  return (<span style={divColorStyle}>
    {
      colorText.map((color, index) => {
        const style = {
          backgroundColor: htmlColors[index],
          height: `${widths[index]}%`,
          width: '100%',
          textAlign: 'center',
        };
        return (<div
          key={color}
          style={style}
        >
          {color}
        </div>);
      },
      )
    }
  </span>);
}

function renderUserScores(times) {
// function scoreBar() {
  let maxVal = Math.max(...badgeBoundaries);
  const { timePerQuestion } = times[0];
  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  divStyle.height = `${maxVal * 50}px`;
  const timePerQuestionLimit = Math.min(maxVal, timePerQuestion);

  const one = Math.min(95, ((timePerQuestionLimit * 100) / maxVal) - 5);
  const three = Math.max(0, (((maxVal - timePerQuestionLimit) * 100) / maxVal) - 5);
  const userTime = [
    one,
    5,
    three,
  ];

  const rightArrow = '\u21FE';
  const downArrow = '\u2193';
  const arrow = timePerQuestion > timePerQuestionLimit
    ? downArrow : rightArrow;

  const userTimeText = ['', `YOU${arrow}`, ''];

  return (
    <span style={divYouStyle}>
      {
        userTime.map((time, index) => {
          const style = {
            height: `${time}%`,
          };
          return (<span key={time} style={style}>{userTimeText[index]}</span>);
        })
      }
    </span>
  );
}

function scoreBar({ times }) {
  // TODO: Dedup maxVal code below...
  let maxVal = Math.max(...badgeBoundaries);
  const { timePerQuestion } = times[0];
  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  divStyle.height = `${maxVal * 50}px`;

  return (
    <div style={divStyle}>
      {renderUserScores(times)}
      {renderColors(times)}
    </div>
  );
}

scoreBar.propTypes = {
  times: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    timePerQuestion: PropTypes.number.isRequired,
  }).isRequired).isRequired,
};

module.exports = scoreBar;
