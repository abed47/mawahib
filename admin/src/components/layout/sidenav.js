import {useEffect, useState} from 'react'
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import Icon from 'react-eva-icons';
import Drawer from '@material-ui/core/Drawer';
import clsx from "clsx";
import List from '@material-ui/core/List';
import {useHistory} from 'react-router-dom'
const MatSideNav = (props) => {
    const classes = props.classes;
    const open = props.open;
    const handleDrawerClose = props.handleDrawerClose;
    const handleDrawerOpen = props.handleDrawerOpen;
    const mobileNavOpen = props.mobileNavOpen;
    const theme  = props.theme;
    const sideNavMenuItems = props.sideNavMenuItems;

    const history = useHistory()

    const [currentPage, setCurrentPage] = useState("")

    const handleLogout = () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('userType');
      localStorage.removeItem('loggedIn');
      history.push('/login')
    }


    useEffect(() => {
      handleChildRoutes(history.location.pathname)
    },[])
    
    const handleNavigation = (url) => {
      // history.push(url)
      // history.push({
      //   pathname: url
      // })

      // return <Redirect to={url} />

      setCurrentPage(url);
      history.push(url)
    }

    const handleChildRoutes = (r) => {
      if(r.includes('client')){
        setCurrentPage('/clients')
      }

      if(r.includes('partner')){
        setCurrentPage('/partners')
      }

      if(r.includes('order')){
        setCurrentPage('/orders')
      }

      if(r.includes('pricing')){
        setCurrentPage('/pricing')
      }
    }


    return (
        <>
        { window.innerWidth > 600 &&
            <Drawer
              variant="permanent"
              className={clsx(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
              })}
              classes={{
                paper: clsx(classes.drawer,{
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }),
              }}
            >
              <div >
                {/* <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "rtl" ? (
                    <ChevronRightIcon />
                  ) : (
                    <ChevronLeftIcon />
                  )}
                </IconButton> */}
              </div>
              {/* <Divider /> */}
      
              <List>
      
              {
                sideNavMenuItems.map( item => {
                  
                  if(localStorage.getItem('userType') && item.permissions[+localStorage.getItem('userType') - 1]){
                    return (
                      <ListItem 
                        button 
                        className={clsx(classes.sideNavItem,{
                          [classes.currentPage]: item.path === currentPage
                        })} 
                        key={item.title} 
                        onClick={() => handleNavigation(item.path)}>
                        <ListItemIcon className={item.path == currentPage ?  "active" : ""}>
                        <Icon 
                          name={item.icon}
                          size="large"   
                          fill = {item.path == currentPage ?  "#ff0000" : "#707070"}
                          animation={{
                            type: "pulse",  // zoom, pulse, shake, flip
                            hover: true,
                            infinite: false,
                            
                          }}
  
                          
                        />
                        </ListItemIcon>
                        <ListItemText primary={item.title} />
                      </ListItem>
                    )
                  }
                  
                })
              }
      
              </List>

              <List>
      
                {/* //TODO: add logout functionality */}
                <ListItem button onClick={handleLogout} >
                    <ListItemIcon>
                    <Icon 
                      name="log-out-outline"
                      size="large"   
                      fill = "#707070"  // small, medium, large, xlarge
                      animation={{
                        type: "pulse",  // zoom, pulse, shake, flip
                        hover: true,
                        infinite: false,
                        
                      }}
                    />
                    </ListItemIcon>
                    <ListItemText primary="logout" />
                  </ListItem>

                </List>
            </Drawer>
              }    
            <SwipeableDrawer
              anchor="left"
              open={mobileNavOpen}
              onClose={handleDrawerClose}
              onOpen={handleDrawerOpen}
            >
              <Divider />
              <List>
              {
                sideNavMenuItems.map( item => {
                  if(item.divider){
                    return <Divider/>
                  }
                  return (
                    <ListItem button key={item.title} onClick={() => handleNavigation(item.path)}>
                      <ListItemIcon>
                      <Icon 
                        name={item.icon}
                        size="large"   
                        fill = "#707070"  // small, medium, large, xlarge
                        animation={{
                          type: "pulse",  // zoom, pulse, shake, flip
                          hover: true,
                          infinite: false,
                          
                        }}
                      />
                      </ListItemIcon>
                      <ListItemText primary={item.title} />
                    </ListItem>
                  )
                })
              }
              </List>
            </SwipeableDrawer>
            </>
    )
} 

export default MatSideNav;