const AVPlayArrow = require('material-ui/svg-icons/av/play-arrow').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const helper = require('./helper');
const MenuItem = require('material-ui/MenuItem').default;
const PropTypes = require('prop-types');
const RaisedButton = require('material-ui/RaisedButton').default;
const React = require('react');
const SelectField = require('material-ui/SelectField').default;
const TextField = require('material-ui/TextField').default;
const Toggle = require('material-ui/Toggle').default;

const {
  alphabet,
  operations,
} = helper;

const buttonStyle = {
  margin: '5px',
  fontSize: '2em',
};
const buttonIconStyle = {
  color: 'white',
};

function options(props) {
  const {
    levelIndex,
    minutes,
    onscreenKeyboard,
    opIndex,
    totalProblems,
  } = props;

  return (<div>
    <div>
      <div>
        <h2>{'Level'}</h2>
        {
          alphabet.map((letter, index) => (
            <FloatingActionButton
              iconStyle={buttonIconStyle}
              key={letter}
              onClick={() => props.setParentState({ levelIndex: index })}
              secondary={index === levelIndex}
              style={buttonStyle}
              title={letter}
            >
              {letter}
            </FloatingActionButton>))
        }
      </div>
      <SelectField
        floatingLabelText="Operation"
        value={opIndex}
        onChange={(e, i, v) => props.setParentState({ opIndex: v })}
        name="operation"
        style={{ width: 100 }}
      >
        {
          operations.map((operation, index) =>
            <MenuItem key={operation} value={index} primaryText={operation} />)
        }
      </SelectField>
    </div>
    <div>
      <TextField
        floatingLabelText="Time"
        hintText="1"
        name="minutes"
        onChange={props.onChange}
        style={{ width: 100, marginLeft: 20 }}
        type="number"
        value={minutes}
      />
      <TextField
        floatingLabelText="Total Questions"
        hintText="20"
        name="totalProblems"
        onChange={props.onChange}
        style={{ width: 150, maarginLeft: 40 }}
        type="number"
        value={totalProblems}
      />
    </div>
    <div>
      <Toggle
        label="Use onscreen keyboard"
        labelPosition="right"
        name="onscreenKeyboard"
        onToggle={props.onChange}
        toggled={onscreenKeyboard}
      />
    </div>
    <div>
      <RaisedButton
        label="Start"
        labelPosition="before"
        primary
        onClick={props.onStart}
        icon={<AVPlayArrow />}
      />
    </div>
  </div>);
}


options.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  minutes: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  opIndex: PropTypes.number.isRequired,
  onscreenKeyboard: PropTypes.bool.isRequired,
  setParentState: PropTypes.func.isRequired,
  totalProblems: PropTypes.string.isRequired,
};

module.exports = options;
