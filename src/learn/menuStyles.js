const { makeStyles } = require('@material-ui/core/styles');


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  content: {
    flexGrow: 1,
    padding: 20,
  },
  link: {
    textDecoration: 'none',
    color: 'rgba(0, 0, 0, 0.87)',
  },
  appLabel: {
    marginLeft: 10,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

module.exports = useStyles;
