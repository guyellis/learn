// const db = require('../../db');
// const Finished = require('./finished');
const helper = require('./helper');
// const moment = require('moment');
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


function scoreboard() {
  return (
    <div>
      <h3>{'Scoreboard'}</h3>
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
