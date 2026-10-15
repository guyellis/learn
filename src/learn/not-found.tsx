import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

const containerStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '40px',
  padding: '20px',
  textAlign: 'center',
};

const imageStyle: React.CSSProperties = {
  borderRadius: '8px',
  height: 'auto',
  marginBottom: '24px',
  maxWidth: '100%',
  width: '500px',
};

function NotFound() {
  return (
    <div style={containerStyle}>
      <img alt="404 Page Not Found" src="/404.webp" style={imageStyle} />
      <Typography component="h1" gutterBottom variant="h4">
        Oops! Page Not Found
      </Typography>
      {/* @ts-expect-error paragraph was removed in MUI v6, but preserved to match existing behavior and tests */}
      <Typography color="text.secondary" paragraph variant="body1">
        We couldn&apos;t find the page you were looking for. Let&apos;s get you back to practicing
        math!
      </Typography>
      <Box sx={{ mt: 3 }}>
        <Link to="/">
          <Button color="primary" size="large" sx={{ minHeight: '48px' }} variant="contained">
            Back to Home
          </Button>
        </Link>
      </Box>
    </div>
  );
}

export default NotFound;
