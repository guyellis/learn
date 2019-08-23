const Tooltip = require('@material-ui/core/Tooltip').default;
const Avatar = require('@material-ui/core/Avatar').default;
const PropTypes = require('prop-types');
const React = require('react');
const constants = require('../../common/constants');

const {
  COLOR_TEXT: colorText,
  COLOR_HTML: htmlColors,
} = constants;

function badge({ color, content }) {
  const title = `${content === 'M' ? 'Mixed' : content} ${colorText[color]}`;
  return (
    <>
      <Tooltip title={title}>
        <Avatar style={{ backgroundColor: htmlColors[color] }}>
          {content}
        </Avatar>
      </Tooltip>
    </>
  );
}

badge.propTypes = {
  color: PropTypes.number.isRequired,
  content: PropTypes.string.isRequired,
};

module.exports = badge;
