const constants = require('../../common/constants');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const PropTypes = require('prop-types');
const React = require('react');

const { COLOR_TEXT: colorText } = constants;

const buttonStyle = {
  margin: '5px',
  fontSize: '1.5em',
};

const buttonIconStyle = {
  color: 'white',
};

const htmlColors = ['#ffd700', '#c0c0c0', '#8C7853', 'lightblue'];

function badge({ color, content }) {
  const title = `${content} ${colorText[color]}`;
  return (
    <FloatingActionButton
      iconStyle={buttonIconStyle}
      backgroundColor={htmlColors[color]}
      style={buttonStyle}
      title={title}
      mini
    >
      {`${content}`}
    </FloatingActionButton>);
}

badge.propTypes = {
  color: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
};

module.exports = badge;
