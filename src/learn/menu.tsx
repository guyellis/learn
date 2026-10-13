import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';

export type ToolbarMenuProps = Record<string, never>;

function ToolbarMenu() {
  return (
    <Toolbar>
      <Link to="/">
        <Button color="primary" variant="contained">
          Home
        </Button>
      </Link>
      <Link to="/math/drill">
        <Button color="primary" variant="contained">
          Drill
        </Button>
      </Link>
      <Link to="/math/score">
        <Button color="primary" variant="contained">
          Score
        </Button>
      </Link>
      <Link to="/help">
        <Button color="primary" variant="contained">
          Help
        </Button>
      </Link>
    </Toolbar>
  );
}

export default ToolbarMenu;
