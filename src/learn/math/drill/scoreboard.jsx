const Badge = require('./badge');
const BadgeTotals = require('./badge-totals');
const constants = require('../../common/constants');
const helper = require('./helper');
const React = require('react');

const { COLOR_TEXT: colorText } = constants;

const {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} = require('material-ui/Table');

const {
  alphabet,
  operationNames,
} = helper;

function badge(badges) {
  if (!badges) {
    return null;
  }
  return (<span>
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
  const { ops, totals, levels } = helper.getScoreboard();
  /*
  ops shape looks like this:
  [{         // Operator: +
    0: {     // Level: A
      0: 3,  // Gold Badge - 3 times
      2: 1,  // Bronze Badge - once
    }
  }]
  */
  return (
    <div>
      <h3>{'Scoreboard'}</h3>
      <BadgeTotals totals={totals} />
      <Table>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
        >
          <TableRow>
            <TableHeaderColumn>{'Level'}</TableHeaderColumn>
            {
              ops.map((op, index) => (op
                ? <TableHeaderColumn
                  key={operationNames[index]}
                >
                  {operationNames[index]}
                </TableHeaderColumn>
                : null
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            levels.map((level, index) => (level
              ? <TableRow key={alphabet[index]}>
                <TableRowColumn key={alphabet[index]}>{alphabet[index]}</TableRowColumn>
                {
                  level.map((badges, badgeIndex) => (
                    <TableRowColumn key={`${colorText[badgeIndex]}`}>
                      {badge(badges)}
                    </TableRowColumn>))
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
