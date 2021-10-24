import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from './topnav';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import Toolbar from '@mui/material/Toolbar';
import MawahibCroppedLogo from '../../assets/images/mawahib-croped.png'
import PagePreloader from './PagesPreLoader';
import SnackBar from './SnackBar';
import {sideNavMenu} from '../../utils/config/menus';
import { useLocation, useHistory } from 'react-router-dom';
const drawerWidth = 240;

function ResponsiveDrawer(props) {
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currentPath, setCurrentPath] = React.useState('/');

  const mLocation = useLocation();
  const history = useHistory();

  React.useEffect(() => {
    setCurrentPath(mLocation.pathname);
  }, [mLocation.pathname])  

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navigate = (p) => {
    history.push(p);
  }

  const drawer = (
    <div className="side-nav-container">
      <Toolbar className="side-nav-header">
        <img src={MawahibCroppedLogo} />
      </Toolbar>
      <Divider />
      <List className={'nav-list categories'}>
        
        {
          sideNavMenu.map((item, index) => {
            if(item.type === 1) return (
              <ListItem button key='home' className={`nav-list-item ${currentPath === item.path ? 'active' : ''}` } onClick={() => navigate(item.path)}>
                    <ListItemIcon className="nav-list-item-icon">
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
              </ListItem>
            );
          })
        }


      </List>
      <Divider />
      {/* <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List> */}
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } , backgroundColor:'red'}}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#131218' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: '#131218' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" className="main-page-wrapper" sx={{ flexGrow: 1, p: 3 }}>
        {/* <Toolbar /> */}
        <div className="pages-wrapper">
          {children}
          <PagePreloader />
          <SnackBar />
        </div>

      </Box>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default ResponsiveDrawer;