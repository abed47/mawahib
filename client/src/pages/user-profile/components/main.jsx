import { useContext, useState } from "react";
import { AuthContext } from '../../../utils/context/auth';
import UserPlaceHolder from '../../../assets/images/placeholder.jpg';
import { Button } from '@mui/material';
import StoreService from "../../../utils/services/store";
import {useHistory} from 'react-router-dom';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getPhotoPublicPath } from '../../../utils/services/request';
// import { ThemeProvider } from "@mui/material";

const MawahibTheme = createTheme({
    palette:{
        primary:{
            main: '#006796',
            contrastText: 'white'
        },
        secondary: {
            main: '#4ec1b8',
            contrastText: 'white'
        },
    }
})

const UserProfile = (prop) => {

    let [currentTab, setCurrentTab] = useState("1");
    
    let authCtx = useContext(AuthContext);
    const history = useHistory();

    const moveToSettings = () => history.push('/user-profile/settings')
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    }

    const handleLogout = () => {
        authCtx.setChannel(null);
        authCtx.setHasChannel(false);
        authCtx.setUser(null);
        authCtx.setLoggedIn(false);
        StoreService.clear();
        history.push('/');
    }

    return (
        <div className="user-profile">
            <div className="header">
                <div className="info">
                    {
                        authCtx.user.photo ?
                        (<img src={getPhotoPublicPath(authCtx.user.photo)} alt="user" />) :
                        (<img src={UserPlaceHolder} alt="user" />)
                    }

                    <div className="options">
                        <h1>{authCtx.user.first_name} {authCtx.user.last_name}</h1>
                        <Button variant="contained" className="btn theme-secondary" onClick={moveToSettings}>Settings</Button>
                        <Button variant="contained" className="btn theme-primary ml-2" onClick={handleLogout}>Sign Out</Button>
                    </div>
                </div>

                <div className="tab-container">
                    <ThemeProvider theme={MawahibTheme}>
                        <TabContext value={currentTab}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList textColor="secondary" indicatorColor="secondary" onChange={handleTabChange} aria-label="lab API tabs example" className={'tab-list'}>
                                <Tab label="Overview" value="1" className="tab-list-item" />
                                <Tab label="Activity" value="2" className="tab-list-item" />
                                <Tab label="Playlists" value="3" className="tab-list-item" />
                            </TabList>
                            </Box>
                            <TabPanel value="1">Item One</TabPanel>
                            <TabPanel value="2">Item Two</TabPanel>
                            <TabPanel value="3">Item Three</TabPanel>
                        </TabContext>
                    </ThemeProvider>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;