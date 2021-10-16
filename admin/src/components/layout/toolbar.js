import AppBar from '@material-ui/core/AppBar';
import clsx from "clsx";
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Typography from '@material-ui/core/Typography';

const MatToolBar = (props) => {
    const classes = props.classes;
    const theme = props.theme;
    const handleDrawerOpen = props.handleDrawerOpen;
    const open = props.open
    return (
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              //   [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Mawahib
          </Typography>
        </Toolbar>
      </AppBar>
    );
} 

export default MatToolBar;