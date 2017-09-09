const React = require('react');
const TextField = require('material-ui/TextField').default;
const DoneIcon = require('material-ui/svg-icons/action/done').default;
const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const { RadioButton, RadioButtonGroup } = require('material-ui/RadioButton');
const AddCircle = require('material-ui/svg-icons/content/add-circle').default;
const AddCircleOutline = require('material-ui/svg-icons/content/add-circle-outline').default;
const RemoveCircle = require('material-ui/svg-icons/content/remove-circle').default;
const RemoveCircleOutline = require('material-ui/svg-icons/content/remove-circle-outline').default;
const constants = require('./constants');
// const SvgIcon = require('material-ui/SvgIcon');

// eslint-disable-next-line react/prefer-stateless-function
class LearnSetup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lower: this.props.lower,
      sign: this.props.sign,
      upper: this.props.upper,
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  save() {
    const { upper: upperS, lower: lowerS } = this.state;
    const errors = {};
    const upper = parseInt(upperS, 10);
    const lower = parseInt(lowerS, 10);
    if (isNaN(upper)) {
      errors.upper = 'Must be a number';
    }
    if (isNaN(lower)) {
      errors.lower = 'Must be a number';
    }
    if (!isNaN(lower) && !isNaN(upper)) {
      if (upper <= lower) {
        errors.lower = `Must be lower than ${constants.upperText}`;
        errors.upper = `Must be higher than ${constants.lowerText}`;
      }
    }
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
    } else {
      this.props.saveSettings(Object.assign({}, this.state, { upper, lower }));
    }
  }

  render() {
    // const DivideIcon = props => (
    //   <SvgIcon {...props}>
    //     <path d="M7.309,71.663h107.188c4.036,0,7.308-3.271,7.308-7.309c0-4.
    // 037-3.271-7.309-7.308-7.309H7.309C3.272,57.046,0,60.318,0,64.354C0,68.391,
    // 3.272,71.663,7.309,71.663z" />
    //   </SvgIcon>
    // );

    const {
      errors,
      lower,
      sign,
      upper,
    } = this.state;
    // const disabled = true;
    const styles = {
      buttonGroup: {
        display: 'flex',
      },
      radioButton: {
        margin: '5px',
        width: 'auto',
      },
      doneButton: {
        marginTop: '40px',
      },
    };
    return (
      <div>
        <h1>Settings</h1>
        <RadioButtonGroup
          defaultSelected={sign}
          name="sign"
          onChange={this.onChange}
          style={styles.buttonGroup}
        >
          <RadioButton
            checkedIcon={<AddCircle />}
            style={styles.radioButton}
            uncheckedIcon={<AddCircleOutline />}
            value="+"
          />
          <RadioButton
            checkedIcon={<RemoveCircle />}
            style={styles.radioButton}
            uncheckedIcon={<RemoveCircleOutline />}
            value="-"
          />
          {/*
          <RadioButton
            value="*"
            checkedIcon={<AddCircle />}
            uncheckedIcon={<AddCircleOutline />}
            disabled={disabled}
          />
          <RadioButton
            value="/"
            checkedIcon={<DivideIcon />}
            uncheckedIcon={<DivideIcon />}
            disabled={disabled}
          />
          */}
        </RadioButtonGroup>
        <div>
          <TextField
            errorText={errors.lower}
            floatingLabelText={constants.lowerText}
            hintText="Lower Limit"
            name="lower"
            onChange={this.onChange}
            type="number"
            value={lower}
          />
        </div>
        <div>
          <TextField
            errorText={errors.upper}
            floatingLabelText={constants.upperText}
            hintText="Upper Limit"
            name="upper"
            onChange={this.onChange}
            type="number"
            value={upper}
          />
        </div>
        <FloatingActionButton
          style={styles.doneButton}
          onClick={this.save}
          title="Save and Go To Exercise"
        >
          <DoneIcon />
        </FloatingActionButton>
      </div>
    );
  }
}

LearnSetup.propTypes = {
  lower: React.PropTypes.number.isRequired,
  sign: React.PropTypes.string.isRequired,
  saveSettings: React.PropTypes.func.isRequired,
  upper: React.PropTypes.number.isRequired,
};

module.exports = LearnSetup;
