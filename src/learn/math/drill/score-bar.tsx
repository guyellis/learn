import React from 'react';
import constants from '../../common/constants.js';
import helper from './helper.js';
import type { ScoreBarTime } from './types.js';

const {
  BADGE_BOUNDARIES: badgeBoundaries,
  COLOR_HTML: htmlColors,
  COLOR_TEXT: colorText,
} = constants;

const sbStyleBase: React.CSSProperties = {};

const sbHeadStyleBase: React.CSSProperties = {
  border: '1px solid black',
  display: 'flex',
  textAlign: 'left',
  width: '100%',
};

const sbHeadItemStyleBase: React.CSSProperties = {
  flexGrow: 1,
};

const sbBodyStyleBase: React.CSSProperties = {
  border: '1px solid black',
  display: 'flex',
  width: '100%',
};

const sbBodyItemStyleBase: React.CSSProperties = {
  border: '1px solid black',
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  fontSize: 'large',
  height: '100%',
  textAlign: 'center',
};

export interface ScoreBarProps {
  showScoreBar: boolean;
  times: ScoreBarTime[];
}

function renderColors(times: ScoreBarTime[], maxVal: number) {
  const sbBodyItemStyle = { ...sbBodyItemStyleBase, height: `${maxVal * 50}px` };

  const extra = badgeBoundaries.concat(maxVal);
  const widths = extra.reduce<number[]>((acc, boundary, index) => {
    if (index !== badgeBoundaries.length) {
      acc.push(Math.round((100 * (extra[index + 1] - boundary)) / maxVal));
    }
    return acc;
  }, []);

  return (
    <span style={sbBodyItemStyle}>
      {colorText.map((color, index) => {
        const style: React.CSSProperties = {
          backgroundColor: htmlColors[index],
          height: `${widths[index]}%`,
        };
        return (
          <div key={color} style={style}>
            {color}
          </div>
        );
      })}
    </span>
  );
}

function renderUserScores(times: ScoreBarTime[], maxVal: number) {
  return times.map((time) => {
    const { date, timePerQuestion } = time;
    const sbBodyItemStyle = { ...sbBodyItemStyleBase, height: `${maxVal * 50}px` };
    const timePerQuestionLimit = Math.min(maxVal, timePerQuestion);

    const one = Math.min(95, (timePerQuestionLimit * 100) / maxVal - 5).toFixed(1);
    const three = Math.max(0, ((maxVal - timePerQuestionLimit) * 100) / maxVal - 5).toFixed(1);
    const userTimes = [one, 10, three];

    const rightArrow = '\u21FE';
    const downArrow = '\u2193';
    const arrow = timePerQuestion > timePerQuestionLimit ? downArrow : rightArrow;

    const userTimeText = ['', `YOU${arrow}`, ''];

    const userColor = helper.getBadgeHtmlColor(timePerQuestion);

    return (
      <span key={date} style={sbBodyItemStyle}>
        {userTimes.map((userTime, index) => {
          const key = `userTimes-${index}`;
          const style: React.CSSProperties = {
            height: `${userTime}%`,
          };
          if (index === 1) {
            style.backgroundColor = userColor;
          }
          return (
            <span key={key} style={style}>
              {userTimeText[index]}
            </span>
          );
        })}
      </span>
    );
  });
}

function formatFromNow(date: number | string) {
  const instant =
    typeof date === 'number'
      ? Temporal.Instant.fromEpochMilliseconds(date)
      : Temporal.Instant.from(date);
  const now = Temporal.Now.instant();
  const timeZone = Temporal.Now.timeZoneId();
  const zNow = now.toZonedDateTimeISO(timeZone);
  const zThen = instant.toZonedDateTimeISO(timeZone);

  const duration = zNow.since(zThen, { largestUnit: 'year' });
  const totalSeconds = now.since(instant).total({ unit: 'second' });

  if (totalSeconds < 45) {
    return 'a few seconds ago';
  }
  const totalMinutes = Math.round(now.since(instant).total({ unit: 'minute' }));
  if (totalMinutes < 45) {
    return totalMinutes <= 1 ? 'a minute ago' : `${totalMinutes} minutes ago`;
  }
  const totalHours = Math.round(now.since(instant).total({ unit: 'hour' }));
  if (totalHours < 22) {
    return totalHours <= 1 ? 'an hour ago' : `${totalHours} hours ago`;
  }
  const totalDays = Math.round(now.since(instant).total({ unit: 'day' }));
  if (totalDays < 26) {
    return totalDays <= 1 ? 'a day ago' : `${totalDays} days ago`;
  }
  const totalMonths = Math.round(duration.years * 12 + duration.months + duration.days / 30);
  if (totalMonths < 11) {
    return totalMonths <= 1 ? 'a month ago' : `${totalMonths} months ago`;
  }
  const totalYears = Math.round(duration.years + duration.months / 12);
  return totalYears <= 1 ? 'a year ago' : `${totalYears} years ago`;
}

function renderTitles(times: ScoreBarTime[]) {
  const titles = times
    .map(({ date }) => ({
      date,
      title: formatFromNow(date),
    }))
    .concat({ date: 0, title: 'Badges' });

  return (
    <div style={sbHeadStyleBase}>
      {titles.map(({ date, title }) => (
        <span key={date} style={sbHeadItemStyleBase}>
          {title}
        </span>
      ))}
    </div>
  );
}

function scoreBar({ showScoreBar, times }: ScoreBarProps) {
  if (!showScoreBar || !times.length) {
    return null;
  }

  const boundaryMax = Math.max(...badgeBoundaries);
  const maxTimePerQuestion = Math.max(...times.map((time) => time.timePerQuestion));
  const maxVal = maxTimePerQuestion > boundaryMax * 1.5 ? boundaryMax * 2 : boundaryMax * 1.5;

  const sbBodyStyle: React.CSSProperties = { ...sbBodyStyleBase, height: `${maxVal * 50}px` };

  return (
    <div style={sbStyleBase}>
      <div style={sbHeadStyleBase}>{renderTitles(times)}</div>
      <div style={sbBodyStyle}>
        {renderUserScores(times, maxVal)}
        {renderColors(times, maxVal)}
      </div>
    </div>
  );
}

export { formatFromNow };
export default scoreBar;
