import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

const containerStyle = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'column',
  marginTop: '40px',
  padding: '20px',
  textAlign: 'center',
};

const imageStyle = {
  borderRadius: '8px',
  height: 'auto',
  marginBottom: '24px',
  maxWidth: '100%',
  width: '500px',
};

const buttonWrapperStyle = {
  marginTop: '20px',
};

function NotFound() {
  return (
    <div style={containerStyle}>
      <img alt="404 Page Not Found" src="/404.webp" style={imageStyle} />
      <Typography component="h1" gutterBottom variant="h4">
        Oops! Page Not Found
      </Typography>
      <Typography color="text.secondary" paragraph variant="body1">
        We couldn&apos;t find the page you were looking for. Let&apos;s get you back to practicing
        math!
      </Typography>
      <div style={buttonWrapperStyle}>
        <Link to="/">
          <Button color="primary" variant="contained">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
