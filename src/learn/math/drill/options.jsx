const Fab = require('@material-ui/core/Fab').default;
const PropTypes = require('prop-types');
const Button = require('@material-ui/core/Button').default;
const React = require('react');
const TextField = require('@material-ui/core/TextField').default;
const Switch = require('@material-ui/core/Switch').default;
const FormGroup = require('@material-ui/core/FormGroup').default;
const FormControlLabel = require('@material-ui/core/FormControlLabel').default;
const { Send } = require('@material-ui/icons');
const constants = require('../../common/constants');

const {
  ALPHABET: alphabet,
  OPERATIONS: operations,
} = constants;

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
};

const sectionStyle = {
  marginTop: '30px',
};

function options(props) {
  const {
    largeKeyboard,
    levelIndex,
    minutes,
    onChange,
    onscreenKeyboard,
    onStart,
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
        <h2>
Level
        </h2>
        <div>
          {
            alphabet.map((letter, index) => (
              <Fab
                key={letter}
                onClick={() => setParentState({ levelIndex: index })}
                secondary={index === levelIndex}
                style={buttonStyle}
              >
                {letter}
              </Fab>
            ))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h2>
Operation
        </h2>
        <div>
          {
            operations.map((operation, index) => (
              <Fab
                key={operation}
                onClick={() => toggleOpIndex(index)}
                secondary={opIndexes.includes(index)}
                style={buttonStyle}
              >
                {operation}
              </Fab>
            ))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h3>
Time
        </h3>
        <TextField
          label="Time"
          helperText="1"
          id="time-minutes"
          name="minutes"
          onChange={onChange}
          style={{ width: 100, marginLeft: 20 }}
          type="number"
          value={minutes}
        />
      </div>
      <div style={sectionStyle}>
        <h3>
Total Questions (you only get badges for 10 or more correct questions)
        </h3>
        <TextField
          label="Total Questions"
          helperText="20"
          id="total-problems"
          name="totalProblems"
          onChange={onChange}
          style={{ width: 150, marginLeft: 40 }}
          type="number"
          value={totalProblems}
        />
      </div>
      <div style={sectionStyle}>
        <h3>
Keyboard
        </h3>
        <FormGroup row>
          <FormControlLabel
            control={(
              <Switch
                name="onscreenKeyboard"
                onChange={onChange}
                color="primary"
                checked={onscreenKeyboard}
              />
)}
            label="Use onscreen keyboard"
          />
        </FormGroup>
      </div>
      {onscreenKeyboard
        && (
        <div style={sectionStyle}>
          <h3>
Large Keyboard
          </h3>
          <FormGroup row>
            <FormControlLabel
              control={(
                <Switch
                  name="largeKeyboard"
                  onChange={onChange}
                  color="secondary"
                  checked={largeKeyboard}
                />
)}
              label="Large Keyboard"
            />
          </FormGroup>
        </div>
        )}
      <div style={sectionStyle}>
        <h3>
Your Name (Optional)
        </h3>
        <TextField
          label="Your Name"
          helperText="Jemima Puddle-Duck"
          id="user-name"
          name="userName"
          onChange={onChange}
          style={{ width: 250, marginLeft: 40 }}
          type="text"
          value={userName}
        />
      </div>
      <div style={sectionStyle}>
        <Button variant="contained" color="primary" onClick={onStart}>
Start
          <Send />
        </Button>
      </div>
      <div style={sectionStyle} />
    </div>
  );
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
