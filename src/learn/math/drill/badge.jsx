import FloatingActionButton from '@mui/material/Fab';
import PropTypes from 'prop-types';
import React from 'react';

const buttonStyle = {
  fontSize: '1.5em',
  margin: '5px',
};

function badge({ content }) {
  return (
    <FloatingActionButton color="primary" size="medium" style={buttonStyle}>
      {`${content}`}
    </FloatingActionButton>
  );
}

badge.propTypes = {
  content: PropTypes.string.isRequired,
};

export default badge;
