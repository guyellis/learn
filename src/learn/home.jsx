
const React = require('react');
const { Link } = require('react-router-dom');
const FlatButton = require('material-ui/FlatButton').default;

function home() {
  return (
    <div>
      <Link to="/math/drill">
        <FlatButton
          label="Math Drill"
          labelPosition="before"
          primary
        />
      </Link>
    </div>
  );
}

module.exports = home;
