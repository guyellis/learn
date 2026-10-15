import Box from '@mui/material/Box';
import React from 'react';

export interface BadgeProps {
  content: number | string;
}

function badge({ content }: BadgeProps) {
  return (
    <Box
      component="span"
      sx={{
        alignItems: 'center',
        bgcolor: 'primary.main',
        borderRadius: '50%',
        boxShadow: 6,
        color: 'primary.contrastText',
        display: 'inline-flex',
        fontSize: '1.5em',
        height: 48,
        justifyContent: 'center',
        m: '5px',
        userSelect: 'none',
        verticalAlign: 'middle',
        width: 48,
      }}
    >
      {`${content}`}
    </Box>
  );
}

export default badge;
