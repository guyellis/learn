import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';

export type ToolbarMenuProps = Record<string, never>;

function ToolbarMenu() {
  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'wrap', gap: 1, py: 1 }}>
        <Link to="/">
          <Button color="primary" size="large" sx={{ minHeight: '48px' }} variant="contained">
            Home
          </Button>
        </Link>
        <Link to="/math/drill">
          <Button color="primary" size="large" sx={{ minHeight: '48px' }} variant="contained">
            Drill
          </Button>
        </Link>
        <Link to="/math/score">
          <Button color="primary" size="large" sx={{ minHeight: '48px' }} variant="contained">
            Score
          </Button>
        </Link>
        <Link to="/help">
          <Button color="primary" size="large" sx={{ minHeight: '48px' }} variant="contained">
            Help
          </Button>
        </Link>
      </Toolbar>
    </AppBar>
  );
}

export default ToolbarMenu;
