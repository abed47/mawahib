import { AppBar, Toolbar, IconButton } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search'
import MenuIcon from '@mui/icons-material/Menu';
import UserPlaceHolder from '../../assets/images/placeholder.jpg';
import {Link} from 'react-router-dom';
import { useContext } from "react";
import {AuthContext} from '../../utils/context/auth';
import { getPhotoPublicPath } from '../../utils/services/request';

const AppBarComponent = ({drawerWidth, handleDrawerToggle}) => {

  let authCtx = useContext(AuthContext);
  
    return (
    <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          height: '50px',
          backgroundColor: 'none'
        }}
        className="top-nav-main"
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <div className="top-nav-container">
            <div className="search-input-wrapper">
              <div className="search-input">
                <SearchIcon name="home" />
                <input type="text" placeholder="Search"/>
              </div>
            </div>

            <div className="user-profile">
              {
                authCtx.loggedIn ? (
                  <Link className="link profile" to="/user-profile">
                    {
                      authCtx.user.photo ? (
                        <img src={getPhotoPublicPath(authCtx.user.photo)} alt=""  />
                      ) : (
                        <img src={UserPlaceHolder} alt=""  />
                      )
                    }
                  </Link>
                ) : (
                  <Link className="link profile" to="login">
                    <img src={UserPlaceHolder} alt="user profile"  />
                  </Link>
                )
              }
            </div>
          </div>
        </Toolbar>
      </AppBar>
      )
}

export default AppBarComponent;