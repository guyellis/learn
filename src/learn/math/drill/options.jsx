const AVPlayArrow = require('material-ui/svg-icons/av/play-arrow').default;
const FlatButton = require('material-ui/FlatButton').default;
const helper = require('./helper');
const MenuItem = require('material-ui/MenuItem').default;
const PropTypes = require('prop-types');
const React = require('react');
const SelectField = require('material-ui/SelectField').default;
const TextField = require('material-ui/TextField').default;

const {
  alphabet,
  operations,
} = helper;

function options(props) {
  // eslint-disable-next-line no-console
  console.log('props:', props);
  const {
    levelIndex,
    opIndex,
    minutes,
  } = props;
    // eslint-disable-next-line no-console
  console.log('level:', levelIndex);
  return (<div>
    <SelectField
      floatingLabelText="Level"
      value={levelIndex}
      onChange={(e, i, v) => props.setParentState({ levelIndex: v })}
      name="level"
      style={{ width: 100 }}
    >
      {
        alphabet.map((letter, index) =>
          <MenuItem key={letter} value={index} primaryText={letter} />)
      }
    </SelectField>
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
    <TextField
      floatingLabelText="Time"
      hintText="Minutes"
      name="minutes"
      onChange={props.onChange}
      style={{ width: 100, paddingLeft: 20 }}
      type="number"
      value={minutes}
    />
    <FlatButton
      label="Start"
      labelPosition="before"
      primary
      onClick={props.onStart}
      icon={<AVPlayArrow />}
    />
  </div>);
}


options.propTypes = {
  levelIndex: PropTypes.number.isRequired,
  minutes: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  opIndex: PropTypes.number.isRequired,
  setParentState: PropTypes.func.isRequired,
};

module.exports = options;
