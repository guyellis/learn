const Badge = require('./badge');
const constants = require('../../common/constants');
const helper = require('./helper');
const PropTypes = require('prop-types');
const React = require('react');

const { alphabet, operationNames, operations } = helper;

const finishedBadgeStyle = {

};

const { COLOR_TEXT: colorText } = constants;

function noBadge(message) {
  return (
    <div style={finishedBadgeStyle}>
      {message}
    </div>
  );
}

function finishedBadge(props) {
  const {
    levelIndex,
    opIndexes,
    timePerQuestion,
    totalCorrectAnswers,
  } = props;

  if (opIndexes.length > 1) {
    const message = 'Badges are only earned when you are doing a single operation and for this test you did multiple operations.';
    return noBadge(message);
  }

  if (totalCorrectAnswers < 10) {
    const message = `You need 10 or more correct answers to earn a badge. On this 
test you got ${totalCorrectAnswers} answer(s) correct.`;
    return noBadge(message);
  }

  const colorIndex = helper.getBadgeColorIndex(timePerQuestion);
  const color = colorText[colorIndex];
  const letter = alphabet[levelIndex];
  const operationName = operationNames[opIndexes[0]];
  const operation = operations[opIndexes[0]];

  return (
    <div style={finishedBadgeStyle}>
      <span>
        <Badge color={colorIndex} content={operation} />
      </span>
      <span>
        {` - Congratulations on getting a new ${color} Badge for Level ${letter} ${operationName}!`}
      </span>
    </div>
  );
}

finishedBadge.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  timePerQuestion: PropTypes.number.isRequired,
  totalCorrectAnswers: PropTypes.number.isRequired,
};

module.exports = finishedBadge;
