
const React = require('react');
const { Link } = require('react-router-dom');
const RaisedButton = require('material-ui/RaisedButton').default;

function home() {
  return (
    <div>
      <Link to="/math/drill">
        <RaisedButton
          label="Math Drill"
          labelPosition="before"
          primary
        />
      </Link>
    </div>
  );
}

module.exports = home;
