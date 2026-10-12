import { Send } from '@mui/icons-material';
import Button from '@mui/material/Button';
import FloatingActionButton from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import constants from '../../common/constants.js';
import db from '../../db/index.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

const buttonStyle = {
  fontSize: '2em',
  margin: '5px',
};

const sectionStyle = {
  marginTop: '30px',
};

function Options(props) {
  const [historyCleared, setHistoryCleared] = useState(false);
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
        <h2>Level</h2>
        <div>
          {alphabet.map((letter, index) => (
            <Tooltip key={letter} title={letter}>
              <FloatingActionButton
                color={index === levelIndex ? 'secondary' : 'primary'}
                onClick={() => setParentState({ levelIndex: index })}
                style={buttonStyle}
              >
                {letter}
              </FloatingActionButton>
            </Tooltip>
          ))}
        </div>
      </div>
      <div style={sectionStyle}>
        <h2>Operation</h2>
        <div>
          {operations.map((operation, index) => (
            <Tooltip key={operation} title={operation}>
              <FloatingActionButton
                color={opIndexes.includes(index) ? 'secondary' : 'primary'}
                onClick={() => toggleOpIndex(index)}
                style={buttonStyle}
              >
                {operation}
              </FloatingActionButton>
            </Tooltip>
          ))}
        </div>
      </div>
      <div style={sectionStyle}>
        <h3>Time</h3>
        <TextField
          helperText="1"
          id="time-minutes"
          label="Time"
          name="minutes"
          onChange={onChange}
          style={{ marginLeft: 20, width: 100 }}
          type="number"
          value={minutes}
        />
      </div>
      <div style={sectionStyle}>
        <h3>Total Questions (you only get badges for 10 or more correct questions)</h3>
        <TextField
          helperText="20"
          id="total-problems"
          label="Total Questions"
          name="totalProblems"
          onChange={onChange}
          style={{ marginLeft: 40, width: 150 }}
          type="number"
          value={totalProblems}
        />
      </div>
      <div style={sectionStyle}>
        <h3>Keyboard</h3>
        <FormGroup row>
          <FormControlLabel
            control={
              <Switch
                checked={onscreenKeyboard}
                color="primary"
                name="onscreenKeyboard"
                onChange={onChange}
              />
            }
            label="Use onscreen keyboard"
          />
        </FormGroup>
      </div>
      {onscreenKeyboard && (
        <div style={sectionStyle}>
          <h3>Large Keyboard</h3>
          <FormGroup row>
            <FormControlLabel
              control={
                <Switch
                  checked={largeKeyboard}
                  color="secondary"
                  name="largeKeyboard"
                  onChange={onChange}
                />
              }
              label="Large Keyboard"
            />
          </FormGroup>
        </div>
      )}
      <div style={sectionStyle}>
        <h3>Your Name (Optional)</h3>
        <TextField
          helperText="Jemima Puddle-Duck"
          id="user-name"
          label="Your Name"
          name="userName"
          onChange={onChange}
          style={{ marginLeft: 40, width: 250 }}
          type="text"
          value={userName}
        />
      </div>
      <div style={sectionStyle}>
        <Button color="primary" onClick={onStart} variant="contained">
          Start
          <Send />
        </Button>
      </div>
      <div style={sectionStyle}>
        <Button
          color="secondary"
          id="clear-record-history"
          onClick={() => {
            db.clearScores();
            setHistoryCleared(true);
          }}
          variant="contained"
        >
          Clear Record History
        </Button>
        {historyCleared && <span style={{ marginLeft: '10px' }}>Record history cleared!</span>}
      </div>
    </div>
  );
}

Options.propTypes = {
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

export default Options;
