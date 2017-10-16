const PropTypes = require('prop-types');

const Types = {};

Types.previousResults = PropTypes.shape({
  actuals: PropTypes.arrayOf(PropTypes.number).isRequired,
  id: PropTypes.number.isRequired,
  task: PropTypes.arrayOf(PropTypes.number).isRequired, // left, right, opIndex, answer
  timeTaken: PropTypes.number.isRequired,
});

module.exports = Types;
