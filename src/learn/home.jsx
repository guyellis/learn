const Fab = require('@material-ui/core/Fab').default;
const { Link } = require('react-router-dom');
const Button = require('@material-ui/core/Button').default;
const React = require('react');
const { Share, BugReport } = require('@material-ui/icons');
const Tooltip = require('@material-ui/core/Tooltip').default;

const style = {
  marginTop: '20px',
};

const githubIconStyle = {
  textAlign: 'right',
  marginTop: '20px',
};

function share() {
  navigator.share({
    title: 'Math Drill',
    text: 'Math Exercises for Kids',
    url: 'https://learn.guyellisrocks.com',
  })
  // eslint-disable-next-line no-console
    .then(() => console.log('Successful share'))
  // eslint-disable-next-line no-console
    .catch(error => console.log('Error sharing', error));
}

function shareComponent() {
  if (!navigator.share) {
    return null;
  }
  const shareStyle = {
    paddingLeft: '20px',
  };
  return (
    <span style={shareStyle}>
      <Tooltip title="Share">
        <Fab
          color="primary"
          aria-label="add"
          onClick={share}
        >
          <Share />
        </Fab>
      </Tooltip>
    </span>
  );
}

function home() {
  return (
    <div>
      <div style={githubIconStyle}>
        <a
          aria-label="Issue guyellis/learn on GitHub"
          href="https://github.com/guyellis/learn/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Tooltip title="Bugs and Issues">
            <Fab
              color="primary"
              aria-label="add"
            >
              <BugReport />
            </Fab>
          </Tooltip>
        </a>
        {shareComponent()}
      </div>
      <div>
        <Link to="/math/drill">
          <Button variant="contained" color="primary">Math Drill</Button>
        </Link>
      </div>
      <div style={style}>
        <Link to="/math/score">
          <Button variant="contained" color="primary">Scoreboard</Button>
        </Link>
      </div>
      <div style={style}>
        <Link to="/help">
          <Button variant="contained" color="primary">Help</Button>
        </Link>
      </div>
    </div>
  );
}

module.exports = home;
