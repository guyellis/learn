import FloatingActionButton from '@mui/material/Fab';
import PropTypes from 'prop-types';
import React from 'react';

const buttonStyle = {
  margin: '5px',
  fontSize: '1.5em',
};

function badge({ content }) {
  return (
    <FloatingActionButton
      color="primary"
      style={buttonStyle}
      size="medium"
    >
      {`${content}`}
    </FloatingActionButton>
  );
}

badge.propTypes = {
  content: PropTypes.string.isRequired,
};

export default badge;
