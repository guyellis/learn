
const React = require('react');
const PropTypes = require('prop-types');

// eslint-disable-next-line react/prefer-stateless-function
class Keyboard extends React.Component {
  render() {
    const { onscreenKeyboard } = this.props;
    if (!onscreenKeyboard) {
      return null;
    }
    return (
      <div>
        {'There should be a keybaord here...'}
      </div>
    );
  }
}

Keyboard.propTypes = {
  onscreenKeyboard: PropTypes.bool.isRequired,
};

module.exports = Keyboard;
