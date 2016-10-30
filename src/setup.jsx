const React = require('react');
// const TextField = require('material-ui/TextField').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const { RadioButton, RadioButtonGroup } = require('material-ui/RadioButton');
const AddCircle = require('material-ui/svg-icons/content/add-circle').default;
const AddCircleOutline = require('material-ui/svg-icons/content/add-circle-outline').default;
const RemoveCircle = require('material-ui/svg-icons/content/remove-circle').default;
const RemoveCircleOutline = require('material-ui/svg-icons/content/remove-circle-outline').default;

// eslint-disable-next-line react/prefer-stateless-function
class LearnSetup extends React.Component {

  render() {
    const {
      onChange,
      sign,
      toggleSetup,
    } = this.props;
    const disabled = true;
    return (
      <div>
        <h1>Settings</h1>
        <RadioButtonGroup name="sign" defaultSelected={sign} onChange={onChange}>
          <RadioButton
            value="+"
            checkedIcon={<AddCircle />}
            uncheckedIcon={<AddCircleOutline />}
          />
          <RadioButton
            value="-"
            checkedIcon={<RemoveCircle />}
            uncheckedIcon={<RemoveCircleOutline />}
          />
          <RadioButton
            value="*"
            checkedIcon={<AddCircle />}
            uncheckedIcon={<AddCircleOutline />}
            disabled={disabled}
          />
          <RadioButton
            value="/"
            checkedIcon={<AddCircle />}
            uncheckedIcon={<AddCircleOutline />}
            disabled={disabled}
          />
        </RadioButtonGroup>
        <FloatingActionButton
          onClick={toggleSetup}
          title="Save and Go To Exercise"
        >
          <DoneIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

LearnSetup.propTypes = {
  // lower: React.PropTypes.number.isRequired,
  onChange: React.PropTypes.func.isRequired,
  sign: React.PropTypes.string.isRequired,
  toggleSetup: React.PropTypes.func.isRequired,
  // upper: React.PropTypes.number.isRequired,
};

module.exports = LearnSetup;
