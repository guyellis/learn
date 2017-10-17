const Badge = require('./badge');
const BadgeTotals = require('./badge-totals');
const constants = require('../../common/constants');
const helper = require('./helper');
const React = require('react');

const {
  ALPHABET: alphabet,
  OPERATION_NAMES: operationNames,
} = constants;

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} = require('material-ui/Table');

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
          />);
      })
    }
    </span>);
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
      <h3>Scoreboard</h3>
      <BadgeTotals totals={totals} />
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>Level</TableHeaderColumn>
            {
              opNames.map(opName => (
                <TableHeaderColumn
                  key={opName}
                >
                  {opName}
                </TableHeaderColumn>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            levels.map((level, index) => (level
              ?
                <TableRow key={alphabet[index]}>
                  <TableRowColumn key={alphabet[index]}>{alphabet[index]}</TableRowColumn>
                  {
                  ops.map(op => (
                    <TableRowColumn key={op}>
                      {badge(level[op])}
                    </TableRowColumn>
                  ))
                }
                </TableRow>
              : null
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

module.exports = scoreboard;
