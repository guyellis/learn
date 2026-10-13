import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { useState } from 'react';

import constants from '../../common/constants.js';
import db from '../../db/index.js';
import BadgeTotals from './badge-totals.js';
import Badge from './badge.js';
import helper from './helper.js';

const { ALPHABET: alphabet, OPERATION_NAMES: operationNames } = constants;

function badge(badges?: number[] | null) {
  if (!badges) {
    return null;
  }
  return (
    <span>
      {badges.map((amount, color) => {
        if (!amount) {
          return null;
        }
        const key = `${amount}${color}`;

        return <Badge color={color} content={amount.toString()} key={key} />;
      })}
    </span>
  );
}

function Scoreboard() {
  const [, setRefresh] = useState(0);
  const { levels, ops: operations, totals } = helper.getScoreboard();
  const ops = [...operations];
  const opNames = ops.map((op) => {
    const operators = op.split('');
    const names = operators.map((operator) => operationNames[parseInt(operator, 10)]);
    return names.join(' / ');
  });

  const handleClearHistory = () => {
    db.clearScores();
    setRefresh((count) => count + 1);
  };
  /*
  {
    ops, // A Set of strings representing operators
    totals, // A 4 element array of badge totals
    levels, // An sparse array of up to 26 elements of objects with keys matching values in ops Set
  }
  */

  return (
    <div>
      <h3>Scoreboard</h3>
      <BadgeTotals totals={totals} />
      <Paper style={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              {opNames.map((opName) => (
                <TableCell key={opName}>{opName}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {levels.map((level, index) =>
              level ? (
                <TableRow key={alphabet[index]}>
                  <TableCell component="th" key={alphabet[index]} scope="row">
                    {alphabet[index]}
                  </TableCell>
                  {ops.map((op) => (
                    <TableCell key={op}>{badge(level[op])}</TableCell>
                  ))}
                </TableRow>
              ) : (
                ''
              ),
            )}
          </TableBody>
        </Table>
      </Paper>
      <div style={{ marginTop: '20px' }}>
        <Button
          color="secondary"
          id="clear-record-history"
          onClick={handleClearHistory}
          variant="contained"
        >
          Clear Record History
        </Button>
      </div>
    </div>
  );
}

export default Scoreboard;
