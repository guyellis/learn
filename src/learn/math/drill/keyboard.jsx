const ContentBackspace = require('material-ui/svg-icons/content/backspace').default;
const KeyboardReturn = require('material-ui/svg-icons/hardware/keyboard-return').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const PropTypes = require('prop-types');
const React = require('react');

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
};

const buttonIconStyle = {
  color: 'white',
};

// eslint-disable-next-line react/prefer-stateless-function
class Keyboard extends React.Component {
  constructor(props) {
    super(props);
    const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'back', 'enter', 'nothing'];
    this.click = buttons.reduce((acc, item) => {
      acc[item] = this.onClick.bind(this, item);
      return acc;
    }, {});

    if (props.largeKeyboard) {
      buttonIconStyle.height = '80px';
      buttonIconStyle.width = '80px';
    }
  }

  onClick(value) {
    if (value === 'nothing') {
      return;
    }
    const { keyPress } = this.props;
    keyPress(value);
  }

  render() {
    const {
      onscreenKeyboard,
    } = this.props;

    if (!onscreenKeyboard) {
      return null;
    }

    return (
      <div>
        <div>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[1]}
            style={buttonStyle}
            title="One"
          >
            {'1'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[2]}
            style={buttonStyle}
            title="Two"
          >
            {'2'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[3]}
            style={buttonStyle}
            title="Three"
          >
            {'3'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.back}
            style={buttonStyle}
            title="Backspace"
          >
            <ContentBackspace />
          </FloatingActionButton>
        </div>
        <div>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[4]}
            style={buttonStyle}
            title="Four"
          >
            {'4'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[5]}
            style={buttonStyle}
            title="Five"
          >
            {'5'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[6]}
            style={buttonStyle}
            title="Six"
          >
            {'6'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.nothing}
            style={buttonStyle}
            title="Nothing"
          >
            {' '}
          </FloatingActionButton>
        </div>
        <div>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[7]}
            style={buttonStyle}
            title="Seven"
          >
            {'7'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[8]}
            style={buttonStyle}
            title="Eight"
          >
            {'8'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[9]}
            style={buttonStyle}
            title="Nine"
          >
            {'9'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.nothing}
            style={buttonStyle}
            title="Nothing"
          >
            {' '}
          </FloatingActionButton>
        </div>
        <div>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.nothing}
            style={buttonStyle}
            title="Nothing"
          >
            {' '}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click[0]}
            style={buttonStyle}
            title="Zero"
          >
            {'0'}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.nothing}
            style={buttonStyle}
            title="Nothing"
          >
            {' '}
          </FloatingActionButton>
          <FloatingActionButton
            iconStyle={buttonIconStyle}
            onClick={this.click.enter}
            style={buttonStyle}
            title="enter"
          >
            <KeyboardReturn />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

Keyboard.propTypes = {
  keyPress: PropTypes.func.isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  largeKeyboard: PropTypes.bool.isRequired,
};

module.exports = Keyboard;
