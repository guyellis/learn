import { BugReport, Share } from '@mui/icons-material';
import Button from '@mui/material/Button';
import FloatingActionButton from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { Link } from 'react-router-dom';

const style: React.CSSProperties = {
  marginTop: '20px',
};

const githubIconStyle: React.CSSProperties = {
  marginTop: '20px',
  textAlign: 'right',
};

function share() {
  navigator
    .share({
      text: 'Math Exercises for Kids',
      title: 'Math Drill',
      url: 'https://learn.headvert.com',
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
  const shareStyle: React.CSSProperties = {
    paddingLeft: '20px',
  };
  return (
    <span style={shareStyle}>
      <Tooltip title="Share">
        <FloatingActionButton aria-label="add" color="primary" onClick={share}>
          <Share />
        </FloatingActionButton>
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
            <FloatingActionButton aria-label="add" color="primary">
              <BugReport />
            </FloatingActionButton>
          </Tooltip>
        </a>
        {shareComponent()}
      </div>
      <div>
        <Link to="/math/drill">
          <Button color="primary" variant="contained">
            Math Drill
          </Button>
        </Link>
      </div>
      <div style={style}>
        <Link to="/math/score">
          <Button color="primary" variant="contained">
            Scoreboard
          </Button>
        </Link>
      </div>
      <div style={style}>
        <Link to="/help">
          <Button color="primary" variant="contained">
            Help
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default home;
