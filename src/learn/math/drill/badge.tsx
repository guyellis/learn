import FloatingActionButton from '@mui/material/Fab';
import React from 'react';

const buttonStyle: React.CSSProperties = {
  fontSize: '1.5em',
  margin: '5px',
};

export interface BadgeProps {
  color?: number | string;
  content: number | string;
}

function badge({ content }: BadgeProps) {
  return (
    <FloatingActionButton color="primary" size="medium" style={buttonStyle}>
      {`${content}`}
    </FloatingActionButton>
  );
}

export default badge;
