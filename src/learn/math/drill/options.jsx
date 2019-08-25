const Fab = require('@material-ui/core/Fab').default;
const PropTypes = require('prop-types');
const Paper = require('@material-ui/core/Paper').default;
const { makeStyles } = require('@material-ui/core/styles');
const React = require('react');
const TextField = require('@material-ui/core/TextField').default;
const Switch = require('@material-ui/core/Switch').default;
const FormGroup = require('@material-ui/core/FormGroup').default;
const FormControlLabel = require('@material-ui/core/FormControlLabel').default;
const { Send } = require('@material-ui/icons');
const Tooltip = require('@material-ui/core/Tooltip').default;
const Typography = require('@material-ui/core/Typography').default;
const Grid = require('@material-ui/core/Grid').default;
const constants = require('../../common/constants');

const {
  ALPHABET: alphabet,
  OPERATIONS: operations,
} = constants;

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
};

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2),
    marginTop: 10,
  },
  form: { marginTop: 20 },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  fab: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  optionsSection: { marginTop: 10 },
}));

function options(props) {
  const classes = useStyles();
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

  function toggleOpIndex(opIndex) {
    const position = props.opIndexes.indexOf(opIndex);
    let operatIndexes;
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
      <Typography variant="h2" gutterBottom>
Drill
      </Typography>
      <Paper className={classes.root}>
        <div>
          <Typography variant="h4" gutterBottom>
Level
          </Typography>
          <div>
            {
            alphabet.map((letter, index) => (
              <Tooltip key={letter} title={letter}>
                <Fab
                  key={letter}
                  onClick={() => setParentState({ levelIndex: index })}
                  color={index === levelIndex ? 'secondary' : 'primary'}
                  style={buttonStyle}
                >
                  {letter}
                </Fab>
              </Tooltip>
            ))
          }
          </div>
        </div>
        <div>
          <Typography variant="h4" gutterBottom>
Operation
          </Typography>
          <div>
            {
            operations.map((operation, index) => (
              <Tooltip key={operation} title={operation}>
                <Fab
                  key={operation}
                  onClick={() => toggleOpIndex(index)}
                  color={opIndexes.includes(index) ? 'secondary' : 'primary'}
                  style={buttonStyle}
                >
                  {operation}
                </Fab>
              </Tooltip>
            ))
          }
          </div>
        </div>
      </Paper>
      <div className={classes.optionsSection}>
        <Typography variant="h4" gutterBottom>
Options
        </Typography>
        <Grid className={classes.form} container spacing={3}>
          <Grid item xs>
            <TextField
              label="Time"
              placeholder="1"
              className={classes.textField}
              required
              id="time-minutes"
              name="minutes"
              onChange={onChange}
              type="number"
              value={minutes}
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Total Questions"
              helperText="You only get badges for 10 or more correct questions"
              placeholder="20"
              required
              className={classes.textField}
              id="total-problems"
              name="totalProblems"
              onChange={onChange}
              type="number"
              value={totalProblems}
            />
          </Grid>
          <Grid item xs>
            <TextField
              label="Your Name"
              helperText="Jemima Puddle-Duck"
              id="user-name"
              name="userName"
              className={classes.textField}
              onChange={onChange}
              type="text"
              value={userName}
            />
          </Grid>
          <Grid item xs>
            <FormGroup row>
              <FormControlLabel
                control={(
                  <Switch
                    name="onscreenKeyboard"
                    onChange={onChange}
                    color="primary"
                    checked={onscreenKeyboard}
                  />
)}
                label="Use onscreen keyboard"
              />
            </FormGroup>
          </Grid>
          {onscreenKeyboard
        && (
        <Grid item xs>
          <FormGroup row>
            <FormControlLabel
              control={(
                <Switch
                  name="largeKeyboard"
                  onChange={onChange}
                  color="secondary"
                  checked={largeKeyboard}
                />
)}
              label="Large Keyboard"
            />
          </FormGroup>
        </Grid>
        )}
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="center"
        >
          <Tooltip title="Start">
            <Fab
              color="primary"
              variant="extended"
              aria-label="start"
              className={classes.fab}
              onClick={onStart}
            >
              <Send className={classes.extendedIcon} />
Start
            </Fab>
          </Tooltip>
        </Grid>
      </div>
      <Grid />
    </div>
  );
}


options.propTypes = {
  largeKeyboard: PropTypes.bool.isRequired,
  levelIndex: PropTypes.number.isRequired,
  minutes: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  onStart: PropTypes.func.isRequired,
  opIndexes: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
  setParentState: PropTypes.func.isRequired,
  totalProblems: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
};

module.exports = options;
