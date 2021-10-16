import React, {useState, useEffect} from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import LayoutUtilsProvider from '../utils/context/LayoutContext';
import {sidenav as sideNavMenuItems} from '../utils/config/menus'
import MatSideNav from "./layout/sidenav";
import AppBar from './layout/toolbar';
import SnackBar from "./layout/snackbar";
import PreLoader from "./layout/preloader"
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    height: '100%'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    // marginLeft: drawerWidth,
    // width: `calc(100% - ${drawerWidth}px)`,
    // transition: theme.transitions.create(["width", "margin"], {
    //   easing: theme.transitions.easing.sharp,
    //   duration: theme.transitions.duration.enteringScreen,
    // }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  currentPage:{
    // borderRight: "3px solid red"
  },
  sideNavItem:{
    paddingTop:"0 !important",
    paddingBottom:"0 !important",
    margin: "15px 0"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    display: "flex",
    // justifyContent: 'space-between'
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    position: 'relative',
    height: '100%',
  },
}));

export default function MiniDrawer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const resizeWindow = () => {
    let width  = window.innerWidth
    if(width < 600){
        setIsMobile(true);
        return
    }

    setIsMobile(false)
  }
  useEffect(() => {
    window.addEventListener("resize", resizeWindow);
    return () => window.removeEventListener("resize", resizeWindow);
  }, []);


  const handleDrawerOpen = () => {
      let width = window.innerWidth;

      if(width < 680){
          setMobileNavOpen(true)
        return
      }
    setOpen(!open);
  };

  const handleDrawerClose = () => {
    setOpen(false);
    setMobileNavOpen(false);
  };

  return (
    <LayoutUtilsProvider>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar theme={theme} classes={classes} handleDrawerOpen={handleDrawerOpen} open={open} />
        <MatSideNav 
          theme={theme}
          classes={classes}
          handleDrawerOpen={handleDrawerOpen} 
          handleDrawerClose={handleDrawerClose}
          open={open} 
          sideNavMenuItems={sideNavMenuItems}
          mobileNavOpen={mobileNavOpen}
          />

        <main className={[classes.content]}>
          {/* <div className={classes.toolbar} /> */}


          <PreLoader />

          {props.children}

          <SnackBar />

        </main>

      </div>
    </LayoutUtilsProvider>
  );
}
