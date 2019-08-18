const { Link } = require('react-router-dom');
const Toolbar = require('@material-ui/core/Toolbar').default;
// const PropTypes = require('prop-types');
const clsx = require('clsx').default;
const CssBaseline = require('@material-ui/core/CssBaseline').default;
const Tooltip = require('@material-ui/core/Tooltip').default;
const AppBar = require('@material-ui/core/AppBar').default;
const Typography = require('@material-ui/core/Typography').default;
const IconButton = require('@material-ui/core/IconButton').default;
const Drawer = require('@material-ui/core/Drawer').default;
const MenuIcon = require('@material-ui/icons/Menu').default;
const ChevronLeftIcon = require('@material-ui/icons/ChevronLeft').default;
const ChevronRightIcon = require('@material-ui/icons/ChevronRight').default;
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
const { useTheme } = require('@material-ui/core/styles');
const Grid = require('@material-ui/core/Grid').default;
const PropTypes = require('prop-types');
const useStyles = require('./menuStyles');
const github = require('../assets/github-logo.svg');

const ToolbarMenu = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
    if (navigator.share) {
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

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, { [classes.appBarShift]: open })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, { [classes.hide]: open })}
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
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open, [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({ [classes.drawerOpen]: open, [classes.drawerClose]: !open }),
        }}
        open={open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
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
        <Divider />
        {shareComponent()}
      </Drawer>
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
  children: PropTypes.func,
};

module.exports = ToolbarMenu;
