const { Link } = require('react-router-dom');
const Toolbar = require('@material-ui/core/Toolbar').default;
// const PropTypes = require('prop-types');
const Button = require('@material-ui/core/Button').default;
const React = require('react');

class ToolbarMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 3,
    };
    this.handleChange = (event, index, value) => this.setState({ value });
  }

  render() {
    return (
      <Toolbar>
        <Link to="/">
          <Button variant="contained" color="primary">Home</Button>
        </Link>
        <Link to="/math/drill">
          <Button variant="contained" color="primary">Drill</Button>
        </Link>
        <Link to="/math/score">
          <Button variant="contained" color="primary">Score</Button>
        </Link>
        <Link to="/help">
          <Button variant="contained" color="primary">Help</Button>
        </Link>
      </Toolbar>
    );
  }
}

// ToolbarMenu.propTypes = {
// match: PropTypes.shape({
//   params: PropTypes.shape({
//     id: PropTypes.string.isRequired,
//     slug: PropTypes.string.isRequired,
//   }).isRequired,
// }).isRequired,
// history: React.PropTypes.shape({
//   push: React.PropTypes.func.isRequired,
// }).isRequired,
// };

module.exports = ToolbarMenu;
