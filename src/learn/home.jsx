const FloatingActionButton = require('material-ui/FloatingActionButton').default;
const SocialShare = require('material-ui/svg-icons/social/share').default;
const ActionBugReport = require('material-ui/svg-icons/action/bug-report').default;
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

function share() {
  navigator.share({
    title: 'Math Drill',
    text: 'Math Exercises for Kids',
    url: 'https://learn.guyellisrocks.com',
  })
  // eslint-disable-next-line no-console
    .then(() => console.log('Successful share'))
  // eslint-disable-next-line no-console
    .catch((error) => console.log('Error sharing', error));
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
      <FloatingActionButton
        title="Share"
        onClick={share}
      >
        <SocialShare />
      </FloatingActionButton>
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
          <FloatingActionButton
            title="Bugs and Issues"
          >
            <ActionBugReport />
          </FloatingActionButton>
        </a>
        {shareComponent()}
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
        <Link to="/math/score">
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
