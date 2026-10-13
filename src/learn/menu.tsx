import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';

export type ToolbarMenuProps = Record<string, never>;

export interface ToolbarMenuState {
  value: number;
}

class ToolbarMenu extends React.Component<ToolbarMenuProps, ToolbarMenuState> {
  handleChange: (event: unknown, index: unknown, value: number) => void;

  constructor(props: ToolbarMenuProps) {
    super(props);
    // TODO: Fix and remove this ESLint disable
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      value: 3,
    };
    this.handleChange = (_event, _index, value) => this.setState({ value });
  }

  render() {
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
}

export default ToolbarMenu;
