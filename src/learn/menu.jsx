const { Link } = require('react-router-dom');
const Toolbar = require('@material-ui/core/Toolbar').default;
// const PropTypes = require('prop-types');
const CssBaseline = require('@material-ui/core/CssBaseline').default;
const Tooltip = require('@material-ui/core/Tooltip').default;
const AppBar = require('@material-ui/core/AppBar').default;
const Typography = require('@material-ui/core/Typography').default;
const IconButton = require('@material-ui/core/IconButton').default;
const Drawer = require('@material-ui/core/Drawer').default;
const MenuIcon = require('@material-ui/icons/Menu').default;
const Home = require('@material-ui/icons/Home').default;
const Share = require('@material-ui/icons/Share').default;
const VideogameAsset = require('@material-ui/icons/VideogameAsset').default;
const Help = require('@material-ui/icons/Help').default;
const Score = require('@material-ui/icons/Score').default;
const Divider = require('@material-ui/core/Divider').default;
const List = require('@material-ui/core/List').default;
const ListItem = require('@material-ui/core/ListItem').default;
const ListItemIcon = require('@material-ui/core/ListItemIcon').default;
const ListItemText = require('@material-ui/core/ListItemText').default;
const React = require('react');
const { useState } = require('react');
const Grid = require('@material-ui/core/Grid').default;
const PropTypes = require('prop-types');
const Hidden = require('@material-ui/core/Hidden').default;
const { useTheme } = require('@material-ui/core/styles');
const useStyles = require('./menuStyles');
const github = require('../assets/github-logo.svg');

const ToolbarMenu = (props) => {
  const { children } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const share = () => {
    navigator.share({
      title: 'Math Drill',
      text: 'Math Exercises for Kids',
      url: 'https://learn.guyellisrocks.com',
    })
    // eslint-disable-next-line no-console
      .then(() => console.log('Successful share'))
    // eslint-disable-next-line no-console
      .catch(error => console.log('Error sharing', error));
  };

  const shareComponent = () => {
    if (!navigator.share) {
      return null;
    }
    return (
      <Tooltip title="Share">
        <ListItem onClick={share} button>
          <ListItemIcon><Share /></ListItemIcon>
          <ListItemText primary="Share" />
        </ListItem>
      </Tooltip>
    );
  };

  const drawer = (
    <>
      <div className={classes.toolbar} />
      <Divider />
      <div
        className={classes.list}
        role="presentation"
        onClick={handleDrawerToggle}
        onKeyDown={handleDrawerToggle}
      >
        <List>
          <Link className={classes.link} to="/">
            <Tooltip title="Home">
              <ListItem button>
                <ListItemIcon><Home /></ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Tooltip>
          </Link>
          <Link className={classes.link} to="/math/drill">
            <Tooltip title="Drill">
              <ListItem button>
                <ListItemIcon><VideogameAsset /></ListItemIcon>
                <ListItemText primary="Drill" />
              </ListItem>
            </Tooltip>
          </Link>
          <Link className={classes.link} to="/math/score">
            <Tooltip title="Score">
              <ListItem button>
                <ListItemIcon><Score /></ListItemIcon>
                <ListItemText primary="Score" />
              </ListItem>
            </Tooltip>
          </Link>
          <Link className={classes.link} to="/help">
            <Tooltip title="Help">
              <ListItem button>
                <ListItemIcon><Help /></ListItemIcon>
                <ListItemText primary="Help" />
              </ListItem>
            </Tooltip>
          </Link>
        </List>
      </div>
      <Divider />
      {shareComponent()}
    </>
  );
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <div className={classes.appLabel}>
            <Typography variant="h6" noWrap>
LEARN
            </Typography>
          </div>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="center"
          >
            <Tooltip title="Fork me!">
              <a
                aria-label="Fork guyellis/learn on GitHub"
                href="https://github.com/guyellis/learn"
                rel="noopener noreferrer"
                target="_blank"
              >
                <img src={github} alt="github" height={30} width={30} />
              </a>
            </Tooltip>
          </Grid>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={null}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{ paper: classes.drawerPaper }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </div>
  );
};

ToolbarMenu.defaultProps = {
  children: null,
};

ToolbarMenu.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.object,
};

module.exports = ToolbarMenu;
