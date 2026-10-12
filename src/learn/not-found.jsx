import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  marginTop: '40px',
  padding: '20px',
};

const imageStyle = {
  maxWidth: '100%',
  width: '500px',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '24px',
};

const buttonWrapperStyle = {
  marginTop: '20px',
};

function NotFound() {
  return (
    <div style={containerStyle}>
      <img
        src="/404.webp"
        alt="404 Page Not Found"
        style={imageStyle}
      />
      <Typography variant="h4" component="h1" gutterBottom>
        Oops! Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        We couldn&apos;t find the page you were looking for. Let&apos;s get you back to practicing math!
      </Typography>
      <div style={buttonWrapperStyle}>
        <Link to="/">
          <Button variant="contained" color="primary">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
