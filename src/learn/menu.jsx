import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import React from 'react';
import { Link } from 'react-router-dom';

class ToolbarMenu extends React.Component {
  constructor(props) {
    super(props);
    // TODO: Fix and remove this ESLint disable
    // eslint-disable-next-line react/state-in-constructor
    this.state = {
      value: 3,
    };
    this.handleChange = (event, index, value) => this.setState({ value });
  }

  render() {
    return (
      <Toolbar>
        <Link to="/">
          <Button variant="contained" color="primary">Home</Button>
        </Link>
        <Link to="/math/drill">
          <Button variant="contained" color="primary">Drill</Button>
        </Link>
        <Link to="/math/score">
          <Button variant="contained" color="primary">Score</Button>
        </Link>
        <Link to="/help">
          <Button variant="contained" color="primary">Help</Button>
        </Link>
      </Toolbar>
    );
  }
}

export default ToolbarMenu;
