const { Link } = require('react-router-dom');
const { Toolbar, ToolbarGroup, ToolbarSeparator } = require('material-ui/Toolbar');
// const PropTypes = require('prop-types');
const RaisedButton = require('material-ui/RaisedButton').default;
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
        <ToolbarGroup firstChild>
          <Link to="/math/set">
            <RaisedButton
              label="Set"
              primary
            />
          </Link>
          <Link to="/math/go">
            <RaisedButton
              label="Go"
              primary
            />
          </Link>
          <Link to="/math/score">
            <RaisedButton
              label="Score"
              primary
            />
          </Link>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarSeparator />
          <Link to="/help">
            <RaisedButton
              label="Help"
              primary
            />
          </Link>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

ToolbarMenu.propTypes = {
  // match: PropTypes.shape({
  //   params: PropTypes.shape({
  //     id: PropTypes.string.isRequired,
  //     slug: PropTypes.string.isRequired,
  //   }).isRequired,
  // }).isRequired,
  // history: React.PropTypes.shape({
  //   push: React.PropTypes.func.isRequired,
  // }).isRequired,
};

module.exports = ToolbarMenu;
