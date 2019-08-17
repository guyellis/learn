const React = require('react');
const TableHead = require('@material-ui/core/TableHead').default;
const TableRow = require('@material-ui/core/TableRow').default;
const TableBody = require('@material-ui/core/TableBody').default;
const TableCell = require('@material-ui/core/TableCell').default;
const Table = require('@material-ui/core/Table').default;
const Paper = require('@material-ui/core/Paper').default;

const Badge = require('./badge');
const BadgeTotals = require('./badge-totals');
const constants = require('../../common/constants');
const helper = require('./helper');

const {
  ALPHABET: alphabet,
  OPERATION_NAMES: operationNames,
} = constants;


function badge(badges) {
  if (!badges) {
    return null;
  }
  return (
    <span>
      {
      badges.map((amount, color) => {
        if (!amount) {
          return null;
        }
        const key = `${amount}${color}`;

        return (
          <Badge
            key={key}
            color={color}
            content={amount.toString()}
          />
        );
      })
    }
    </span>
  );
}

function scoreboard() {
  const { ops: operations, totals, levels } = helper.getScoreboard();
  const ops = [...operations];
  const opNames = ops.map((op) => {
    const operators = op.split('');
    const names = operators.map(operator => operationNames[parseInt(operator, 10)]);
    return names.join(' / ');
  });
  /*
  {
    ops, // A Set of strings representing operators
    totals, // A 4 element array of badge totals
    levels, // An sparse array of up to 26 elements of objects with keys matching values in ops Set
  }
  */

  return (
    <div>
      <h3>
       Scoreboard
      </h3>
      <BadgeTotals totals={totals} />
      <Paper style={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Level</TableCell>
              {opNames.map(opName => (
                <TableCell key={opName}>
                  {opName}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {levels.map((level, index) => (level ? (
              <TableRow key={alphabet[index]}>
                <TableCell component="th" scope="row" key={alphabet[index]}>
                  {alphabet[index]}
                </TableCell>
                {ops.map(op => (
                  <TableCell key={op}>{badge(level[op])}</TableCell>
                ))}
              </TableRow>
            ) : ('')
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}

module.exports = scoreboard;
