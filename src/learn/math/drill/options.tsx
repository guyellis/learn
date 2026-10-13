import { Send } from '@mui/icons-material';
import Button from '@mui/material/Button';
import FloatingActionButton from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import constants from '../../common/constants.js';
import db from '../../db/index.js';
import type { DrillOptions } from './types.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

const buttonStyle: React.CSSProperties = {
  fontSize: '2em',
  margin: '5px',
};

const sectionStyle: React.CSSProperties = {
  marginTop: '30px',
};

export interface OptionsProps {
  largeKeyboard: boolean;
  levelIndex: number;
  minutes: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onscreenKeyboard: boolean;
  onStart: () => void;
  opIndexes: number[];
  setParentState: (state: Partial<DrillOptions>) => void;
  totalProblems: string;
  userName: string;
}

function Options(props: OptionsProps) {
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

  function toggleOpIndex(opIndex: number) {
    const position = props.opIndexes.indexOf(opIndex);
    let operatIndexes: number[];
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

export default Options;
