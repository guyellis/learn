const PropTypes = require('prop-types');
const React = require('react');
const { makeStyles } = require('@material-ui/core/styles');
const List = require('@material-ui/core/List').default;
const ListItem = require('@material-ui/core/ListItem').default;
const ListItemText = require('@material-ui/core/ListItemText').default;
const ListItemAvatar = require('@material-ui/core/ListItemAvatar').default;
const Divider = require('@material-ui/core/Divider').default;
const constants = require('../../common/constants');
const Badge = require('./badge');

const { COLOR_TEXT: colorText } = constants;

const badgeBoundaries = [
  '2 seconds or less (per question)',
  'between 2 and 3 seconds (per question)',
  'between 3 and 4 seconds (per question)',
  'more than 4 seconds (per question)',
];


const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
}));

function badgeTotals(props) {
  const { totals } = props;
  const classes = useStyles();

  return (
    <div>
      {
        totals.map((total, colorIndex) => {
          const key = colorText[colorIndex];
          const primaryText = `${key} Badge(s) - ${badgeBoundaries[colorIndex]}`;

          return (
            <List key={key} className={classes.root}>
              <ListItem>
                <ListItemAvatar>
                  <Badge color={colorIndex} content={total.toString()} />
                </ListItemAvatar>
                <ListItemText primary={primaryText} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </List>
          );
        })
      }
    </div>
  );
}

badgeTotals.propTypes = {
  totals: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
};

module.exports = badgeTotals;
