import { BugReport, Share } from '@mui/icons-material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import FloatingActionButton from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import { Link } from 'react-router-dom';

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
  return (
    <Tooltip title="Share">
      <FloatingActionButton aria-label="Share" color="primary" onClick={share}>
        <Share />
      </FloatingActionButton>
    </Tooltip>
  );
}

function home() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mb: 3 }}>
        <a
          aria-label="Issue guyellis/learn on GitHub"
          href="https://github.com/guyellis/learn/issues"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Tooltip title="Bugs and Issues">
            <FloatingActionButton aria-label="Report a bug" color="primary">
              <BugReport />
            </FloatingActionButton>
          </Tooltip>
        </a>
        {shareComponent()}
      </Box>
      <Stack spacing={2}>
        <Link style={{ textDecoration: 'none' }} to="/math/drill">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Math Drill
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/math/score">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Scoreboard
          </Button>
        </Link>
        <Link style={{ textDecoration: 'none' }} to="/help">
          <Button
            color="primary"
            fullWidth
            size="large"
            sx={{ minHeight: '48px' }}
            variant="contained"
          >
            Help
          </Button>
        </Link>
      </Stack>
    </Container>
  );
}

export default home;
