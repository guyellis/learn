import { Send } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import React, { useState } from 'react';
import constants from '../../common/constants.js';
import db from '../../db/index.js';
import type { DrillOptions } from './types.js';

const { ALPHABET: alphabet, OPERATIONS: operations } = constants;

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
    <Stack spacing={3}>
      <Box>
        <h2>Level</h2>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {alphabet.map((letter, index) => (
            <Tooltip key={letter} title={letter}>
              <Button
                color="primary"
                onClick={() => setParentState({ levelIndex: index })}
                size="large"
                sx={{ minHeight: '48px', minWidth: '48px' }}
                variant={index === levelIndex ? 'contained' : 'outlined'}
              >
                {letter}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Box>
        <h2>Operation</h2>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {operations.map((operation, index) => (
            <Tooltip key={operation} title={operation}>
              <Button
                color="secondary"
                onClick={() => toggleOpIndex(index)}
                size="large"
                sx={{ fontSize: '1.25rem', minHeight: '48px', minWidth: '48px' }}
                variant={opIndexes.includes(index) ? 'contained' : 'outlined'}
              >
                {operation}
              </Button>
            </Tooltip>
          ))}
        </Box>
      </Box>
      <Box>
        <h3>Time</h3>
        <TextField
          helperText="1"
          id="time-minutes"
          label="Time"
          name="minutes"
          onChange={onChange}
          sx={{ width: 100 }}
          type="number"
          value={minutes}
        />
      </Box>
      <Box>
        <h3>Total Questions (you only get badges for 10 or more correct questions)</h3>
        <TextField
          helperText="20"
          id="total-problems"
          label="Total Questions"
          name="totalProblems"
          onChange={onChange}
          sx={{ width: 150 }}
          type="number"
          value={totalProblems}
        />
      </Box>
      <Box>
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
      </Box>
      {onscreenKeyboard && (
        <Box>
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
        </Box>
      )}
      <Box>
        <h3>Your Name (Optional)</h3>
        <TextField
          helperText="Jemima Puddle-Duck"
          id="user-name"
          label="Your Name"
          name="userName"
          onChange={onChange}
          sx={{ maxWidth: '100%', width: 250 }}
          type="text"
          value={userName}
        />
      </Box>
      <Box>
        <Button
          color="primary"
          onClick={onStart}
          size="large"
          sx={{ minHeight: '48px' }}
          variant="contained"
        >
          Start
          <Send sx={{ ml: 1 }} />
        </Button>
      </Box>
      <Box sx={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <Button
          color="secondary"
          id="clear-record-history"
          onClick={() => {
            db.clearScores();
            setHistoryCleared(true);
          }}
          size="large"
          sx={{ minHeight: '48px' }}
          variant="contained"
        >
          Clear Record History
        </Button>
        {historyCleared && <span>Record history cleared!</span>}
      </Box>
    </Stack>
  );
}

export default Options;
