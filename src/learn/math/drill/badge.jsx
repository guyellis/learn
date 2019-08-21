const FloatingActionButton = require('@material-ui/core/Fab').default;
const PropTypes = require('prop-types');
const React = require('react');

const buttonStyle = {
  margin: '5px',
  fontSize: '1.5em',
};

function badge({ content }) {
  return (
    <FloatingActionButton
      color="primary"
      style={buttonStyle}
      size="medium"
    >
      {`${content}`}
    </FloatingActionButton>
  );
}

badge.propTypes = {
  content: PropTypes.string.isRequired,
};

module.exports = badge;
