import FloatingActionButton from '@material-ui/core/Fab';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Send } from '@material-ui/icons';
import Tooltip from '@material-ui/core/Tooltip';
import constants from '../../common/constants.js';

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
              <Tooltip key={letter} title={letter}>
                <FloatingActionButton
                  onClick={() => setParentState({ levelIndex: index })}
                  color={index === levelIndex ? 'secondary' : 'primary'}
                  style={buttonStyle}
                >
                  {letter}
                </FloatingActionButton>
              </Tooltip>
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
              <Tooltip key={operation} title={operation}>
                <FloatingActionButton
                  onClick={() => toggleOpIndex(index)}
                  color={opIndexes.includes(index) ? 'secondary' : 'primary'}
                  style={buttonStyle}
                >
                  {operation}
                </FloatingActionButton>
              </Tooltip>
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

export default options;
