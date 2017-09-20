const { Link } = require('react-router-dom');
const RaisedButton = require('material-ui/RaisedButton').default;
const React = require('react');

const style = {
  marginTop: '20px',
};

const githubIconStyle = {
  textAlign: 'right',
  marginTop: '20px',
};

function home() {
  return (
    <div>
      <div style={githubIconStyle}>
        <a
          aria-label="Issue guyellis/learn on GitHub"
          className="github-button"
          data-size="large"
          href="https://github.com/guyellis/learn/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          {'Issue'}
        </a>
      </div>
      <div>
        <Link to="/math/drill">
          <RaisedButton
            label="Math Drill"
            labelPosition="before"
            primary
          />
        </Link>
      </div>
      <div style={style}>
        <Link to="/math/scoreboard">
          <RaisedButton
            label="Scoreboard"
            labelPosition="before"
            primary
          />
        </Link>
      </div>
      <div style={style}>
        <Link to="/help">
          <RaisedButton
            label="Help"
            labelPosition="before"
            primary
          />
        </Link>
      </div>
    </div>
  );
}

module.exports = home;
