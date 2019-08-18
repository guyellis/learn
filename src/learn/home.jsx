const React = require('react');
const Typography = require('@material-ui/core/Typography').default;


function home() {
  return (
    <div>
      <div>
        <Typography variant="h2" gutterBottom>
Home
        </Typography>
      </div>
    </div>
  );
}

module.exports = home;
