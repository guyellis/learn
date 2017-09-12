
const React = require('react');
const { Link } = require('react-router-dom');
const RaisedButton = require('material-ui/RaisedButton').default;

const style = {
  marginTop: '50px',
};

function home() {
  return (
    <div style={style}>
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
