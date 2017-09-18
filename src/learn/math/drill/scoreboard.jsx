// const db = require('../../db');
// const Finished = require('./finished');
const helper = require('./helper');
const { List, ListItem } = require('material-ui/List');
// const Options = require('./options');
const React = require('react');
const FloatingActionButton = require('material-ui/FloatingActionButton').default;

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

function badge(color, amount) {
  const title = `${amount} ${colorText[color]}`;
  return (
    <FloatingActionButton
      iconStyle={buttonIconStyle}
      backgroundColor={htmlColors[color]}
      style={buttonStyle}
      title={title}
      mini
    >
      {amount}
    </FloatingActionButton>);
}

const badgeBoundaries = [
  '2 seconds or less (per question)',
  'between 2 and 3 seconds (per question)',
  'between 3 and 4 seconds (per question)',
  'more than 4 seconds (per question)',
];

function scoreboard() {
  // TODO: Calculate total badges
  const totalBadges = [15, 3, 7, 8];

  return (
    <div>
      <h3>{'Scoreboard'}</h3>
      <List>
        {
          totalBadges.map((badgeTotal, index) => {
            const primaryText =
            `${badgeTotal} ${colorText[index]} Badge(s) - ${badgeBoundaries[index]}`;
            return (
              <ListItem
                key={colorText[index]}
                primaryText={primaryText}
                leftIcon={badge(index, badgeTotal)}
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
              operationNames.map(operation => (
                <TableHeaderColumn key={operation}>{operation}</TableHeaderColumn>
              ))
            }
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          {
            alphabet.map(letter => (
              <TableRow key={letter}>
                <TableRowColumn>{letter}</TableRowColumn>
                <TableRowColumn>{badge(0, 1)}</TableRowColumn>
                <TableRowColumn>{badge(1, 2)}</TableRowColumn>
                <TableRowColumn>{badge(2, 1)}</TableRowColumn>
                <TableRowColumn>{badge(3, 1)}</TableRowColumn>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  );
}

module.exports = scoreboard;
