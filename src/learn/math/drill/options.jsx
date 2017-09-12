const AVPlayArrow = require('material-ui/svg-icons/av/play-arrow').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const helper = require('./helper');
const PropTypes = require('prop-types');
const RaisedButton = require('material-ui/RaisedButton').default;
const React = require('react');
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

const sectionStyle = {
  marginTop: '30px',
};

function options(props) {
  const {
    levelIndex,
    minutes,
    onscreenKeyboard,
    opIndex,
    totalProblems,
    setParentState,
  } = props;

  return (
    <div>
      <div style={sectionStyle}>
        <h2>{'Level'}</h2>
        <div>
          {
            alphabet.map((letter, index) => (
              <FloatingActionButton
                iconStyle={buttonIconStyle}
                key={letter}
                onClick={() => setParentState({ levelIndex: index })}
                secondary={index === levelIndex}
                style={buttonStyle}
                title={letter}
              >
                {letter}
              </FloatingActionButton>))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h2>{'Operation'}</h2>
        <div>
          {
            operations.map((operation, index) => (
              <FloatingActionButton
                iconStyle={buttonIconStyle}
                key={operation}
                onClick={() => setParentState({ opIndex: index })}
                secondary={index === opIndex}
                style={buttonStyle}
                title={operation}
              >
                {operation}
              </FloatingActionButton>))
          }
        </div>
      </div>
      <div style={sectionStyle}>
        <h3>{'Time'}</h3>
        <TextField
          floatingLabelText="Time"
          hintText="1"
          name="minutes"
          onChange={props.onChange}
          style={{ width: 100, marginLeft: 20 }}
          type="number"
          value={minutes}
        />
      </div>
      <div style={sectionStyle}>
        <h3>{'Total Questions'}</h3>
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
      <div style={sectionStyle}>
        <h3>{'Keyboard'}</h3>
        <Toggle
          label="Use onscreen keyboard"
          labelPosition="right"
          name="onscreenKeyboard"
          onToggle={props.onChange}
          toggled={onscreenKeyboard}
        />
      </div>
      <div style={sectionStyle}>
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
