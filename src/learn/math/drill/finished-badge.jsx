const PropTypes = require('prop-types');
const React = require('react');
const Badge = require('./badge');
const constants = require('../../common/constants');
const helper = require('./helper');

const finishedBadgeStyle = {

};

const {
  COLOR_TEXT: colorText,
  ALPHABET: alphabet,
  OPERATION_NAMES: operationNames,
  OPERATIONS: operations,
} = constants;

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

  if (totalCorrectAnswers < 10) {
    const message = `You need 10 or more correct answers to earn a badge. On this 
test you got ${totalCorrectAnswers} answer(s) correct.`;
    return noBadge(message);
  }

  const colorIndex = helper.getBadgeColorIndex(timePerQuestion);
  const color = colorText[colorIndex];
  const letter = alphabet[levelIndex];

  const operationName = opIndexes.length === 1
    ? operationNames[opIndexes[0]]
    : `Mixed ${opIndexes.map(opIndex => operationNames[opIndex]).join(' / ')}`;

  const operation = opIndexes.length === 1
    ? operations[opIndexes[0]]
    : 'M';

  return (
    <div style={finishedBadgeStyle}>
      <span>
        <Badge color={colorIndex} content={operation} />
      </span>
      <span>
        {` Congratulations on getting a new ${color} Badge for Level ${letter} ${operationName}!`}
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
