const AVPlayArrow = require('material-ui/svg-icons/av/play-arrow').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const constants = require('../../common/constants');
const PropTypes = require('prop-types');
const RaisedButton = require('material-ui/RaisedButton').default;
const React = require('react');
const TextField = require('material-ui/TextField').default;
const Toggle = require('material-ui/Toggle').default;

const {
  ALPHABET: alphabet,
  OPERATIONS: operations,
} = constants;

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
};

const buttonIconStyle = {
  color: 'white',
};

const sectionStyle = {
  marginTop: '30px',
};

function options(props) {
  const {
    largeKeyboard,
    levelIndex,
    minutes,
    onscreenKeyboard,
    opIndexes,
    setParentState,
    totalProblems,
    userName,
  } = props;

  function toggleOpIndex(opIndex) {
    const position = props.opIndexes.indexOf(opIndex);
    let operatIndexes;
    if (position >= 0) {
      operatIndexes = props.opIndexes;
      if (props.opIndexes.length > 1) {
        // Don't allow count to fall under 1
        operatIndexes.splice(position, 1);
      }
    } else {
      operatIndexes = props.opIndexes.concat(opIndex);
    }

    props.setParentState({ opIndexes: operatIndexes });
  }

  return (
    <div>
      <div style={sectionStyle}>
        <h2>Level</h2>
        <div>
          {
            alphabet.map((letter, index) => (
              <FloatingActionButton
                iconStyle={buttonIconStyle}
                key={letter}
                onClick={() => setParentState({ levelIndex: index })}
                secondary={index === levelIndex}
                style={buttonStyle}
                title={letter}
              >
                {letter}
              </FloatingActionButton>))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h2>Operation</h2>
        <div>
          {
            operations.map((operation, index) => (
              <FloatingActionButton
                iconStyle={buttonIconStyle}
                key={operation}
                onClick={() => toggleOpIndex(index)}
                secondary={opIndexes.includes(index)}
                style={buttonStyle}
                title={operation}
              >
                {operation}
              </FloatingActionButton>))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h3>Time</h3>
        <TextField
          floatingLabelText="Time"
          hintText="1"
          name="minutes"
          onChange={props.onChange}
          style={{ width: 100, marginLeft: 20 }}
          type="number"
          value={minutes}
        />
      </div>
      <div style={sectionStyle}>
        <h3>Total Questions (you only get badges for 10 or more correct questions)</h3>
        <TextField
          floatingLabelText="Total Questions"
          hintText="20"
          name="totalProblems"
          onChange={props.onChange}
          style={{ width: 150, marginLeft: 40 }}
          type="number"
          value={totalProblems}
        />
      </div>
      <div style={sectionStyle}>
        <h3>Keyboard</h3>
        <Toggle
          label="Use onscreen keyboard"
          labelPosition="right"
          name="onscreenKeyboard"
          onToggle={props.onChange}
          toggled={onscreenKeyboard}
        />
      </div>
      {onscreenKeyboard &&
        <div style={sectionStyle}>
          <h3>Large Keyboard</h3>
          <Toggle
            label="Large Keyboard"
            labelPosition="right"
            name="largeKeyboard"
            onToggle={props.onChange}
            toggled={largeKeyboard}
          />
        </div>
      }
      <div style={sectionStyle}>
        <h3>Your Name (Optional)</h3>
        <TextField
          floatingLabelText="Your Name"
          hintText="Jemima Puddle-Duck"
          name="userName"
          onChange={props.onChange}
          style={{ width: 250, marginLeft: 40 }}
          type="text"
          value={userName}
        />
      </div>
      <div style={sectionStyle}>
        <RaisedButton
          label="Start"
          labelPosition="before"
          primary
          onClick={props.onStart}
          icon={<AVPlayArrow />}
        />
      </div>
      <div style={sectionStyle} />
    </div>);
}


options.propTypes = {
  largeKeyboard: PropTypes.bool.isRequired,
  levelIndex: PropTypes.number.isRequired,
  minutes: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setParentState: PropTypes.func.isRequired,
  totalProblems: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

module.exports = options;
