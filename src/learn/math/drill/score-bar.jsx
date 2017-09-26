const constants = require('../../common/constants');
const PropTypes = require('prop-types');
const React = require('react');
const moment = require('moment');
const helper = require('./helper');

const {
  BADGE_BOUNDARIES: badgeBoundaries,
  COLOR_HTML: htmlColors,
  COLOR_TEXT: colorText,
} = constants;

const sbStyle = {

};

const sbHeadStyle = {
  width: '100%',
  border: '1px solid black',
  display: 'flex',
  textAlign: 'center',
};

const sbHeadItemStyle = {
  flexGrow: '1',
};

const sbBodyStyle = {
  width: '100%',
  border: '1px solid black',
  display: 'flex',
};

const sbBodyItemStyle = {
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  fontSize: 'large',
  height: '100%',
  flexGrow: '1',
  textAlign: 'center',
};

function renderColors(times) {
  let maxVal = Math.max(...badgeBoundaries);
  const { timePerQuestion } = times[0];
  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  sbBodyStyle.height = `${maxVal * 50}px`;

  const extra = badgeBoundaries.concat(maxVal);
  const widths = extra.reduce((acc, boundary, index) => {
    if (index !== badgeBoundaries.length) {
      acc.push(Math.round((100 * (extra[index + 1] - boundary)) / maxVal));
    }
    return acc;
  }, []);

  return (<span style={sbBodyItemStyle}>
    {
      colorText.map((color, index) => {
        const style = {
          backgroundColor: htmlColors[index],
          height: `${widths[index]}%`,
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
  return times.map((time) => {
    let maxVal = Math.max(...badgeBoundaries);
    const { timePerQuestion, date } = time;
    maxVal = timePerQuestion > (maxVal * 1.5)
      ? maxVal * 2
      : maxVal * 1.5;
    sbBodyStyle.height = `${maxVal * 50}px`;
    const timePerQuestionLimit = Math.min(maxVal, timePerQuestion);

    const one = Math.min(95, ((timePerQuestionLimit * 100) / maxVal) - 5);
    const three = Math.max(0, (((maxVal - timePerQuestionLimit) * 100) / maxVal) - 5);
    const userTimes = [
      one,
      10,
      three,
    ];

    const rightArrow = '\u21FE';
    const downArrow = '\u2193';
    const arrow = timePerQuestion > timePerQuestionLimit
      ? downArrow : rightArrow;

    const userTimeText = ['', `YOU${arrow}`, ''];

    const userColor = helper.getBadgeHtmlColor(timePerQuestion);

    return (
      <span key={date} style={sbBodyItemStyle}>
        {
          userTimes.map((userTime, index) => {
            const key = `userTimes-${index}`;
            const style = {
              height: `${userTime}%`,
            };
            if (index === 1) {
              style.backgroundColor = userColor;
            }
            return (<span key={key} style={style}>{userTimeText[index]}</span>);
          })
        }
      </span>
    );
  });
}

function renderTitles(times) {
  const titles = times.map(({ date }) => ({
    title: moment(date).fromNow(),
    date,
  })).concat({ title: 'Badges', date: 0 });

  return (
    <div style={sbHeadStyle}>{
      titles.map(({ title, date }) => <span key={date} style={sbHeadItemStyle}>{title}</span>)
    }
    </div>
  );
}

function scoreBar({ times, showScoreBar }) {
  if (!showScoreBar || !times.length) {
    return null;
  }
  // TODO: Dedup maxVal code below...
  let maxVal = Math.max(...badgeBoundaries);
  const { timePerQuestion } = times[0];
  maxVal = timePerQuestion > (maxVal * 1.5)
    ? maxVal * 2
    : maxVal * 1.5;
  sbBodyStyle.height = `${maxVal * 50}px`;

  return (
    <div style={sbStyle}>
      <div style={sbHeadStyle}>
        {renderTitles(times)}
      </div>
      <div style={sbBodyStyle}>
        {renderUserScores(times)}
        {renderColors(times)}
      </div>
    </div>
  );
}

scoreBar.propTypes = {
  times: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.number.isRequired,
    timePerQuestion: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  showScoreBar: PropTypes.bool.isRequired,
};

module.exports = scoreBar;
