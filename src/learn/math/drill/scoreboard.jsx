const { List, ListItem } = require('material-ui/List');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const helper = require('./helper');
const React = require('react');

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

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
  // backgroundColor: 'black',
};
const buttonIconStyle = {
  color: 'white',
};

const colorText = ['Gold', 'Silver', 'Bronze', 'Blue'];
const htmlColors = ['#ffd700', '#c0c0c0', '#8C7853', 'lightblue'];

function badgeItem(color, amount) {
  const title = `${amount} ${colorText[color]}`;
  return (
    <FloatingActionButton
      iconStyle={buttonIconStyle}
      backgroundColor={htmlColors[color]}
      key={color}
      style={buttonStyle}
      title={title}
      mini
    >
      {`${amount}`}
    </FloatingActionButton>);
}

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
        return badgeItem(color, amount);
      })
    }
  </span>);
}

const badgeBoundaries = [
  '2 seconds or less (per question)',
  'between 2 and 3 seconds (per question)',
  'between 3 and 4 seconds (per question)',
  'more than 4 seconds (per question)',
];

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
      <List>
        {
          totals.map((total, colorIndex) => {
            const primaryText =
            `${colorText[colorIndex]} Badge(s) - ${badgeBoundaries[colorIndex]}`;
            return (
              <ListItem
                key={colorText[colorIndex]}
                primaryText={primaryText}
                leftIcon={badgeItem(colorIndex, total)}
              />
            );
          })
        }
      </List>
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
                <TableRowColumn>{alphabet[index]}</TableRowColumn>
                {
                  level.map(badges => (<TableRowColumn>{badge(badges)}</TableRowColumn>))
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
