import { useState, useContext, useEffect} from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { LayoutContext } from '../../../utils/context/layout';
import { AuthContext } from '../../../utils/context/auth';
import { useHistory } from 'react-router-dom';
import { getCurrentUserChannel, getPhotoPublicPath } from '../../../utils/services/request';
import UserPlaceholder from '../../../assets/images/placeholder.jpg'
import { Button } from '@mui/material';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import { formatNumbers } from '../../../utils/helpers';
import UploadsTab from './uploads';

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
});

const ChannelProfile = (props) => {

    const [currentTab, setCurrentTab] = useState("1");
    const [channel, setChannel] = useState(null);
    const [channelName, setChannelName] = useState('');
    const [slogan, setSlogan] = useState('');
    const [channelCover, setChannelCover] = useState('');
    const [channelLogo, setChannelLogo] = useState('');
    const [subscriptions, setSubscriptions] = useState(3432432);

    const authCtx = useContext(AuthContext);
    const layoutCtx = useContext(LayoutContext);
    const history = useHistory();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            layoutCtx.showPreLoader();
            if(!authCtx.channel) return history.push('/user-profile');
            console.log(authCtx.channel);
    
            setChannel(authCtx.channel);
            setChannelName(authCtx.channel.name || '');
            setChannelLogo(authCtx.channel.logo || '');
            setChannelCover(authCtx.channel.cover || '');

            if(!authCtx.channel.name){
                let res = await getCurrentUserChannel();
                let data = res.data;
                setChannelName(data.name);
                setChannelLogo(data.photo);
                setChannelCover(data.cover);
                setSlogan(data.slogan);
            }

            layoutCtx.hidPreLoader();
        }catch(err){
            layoutCtx.hidPreLoader()
            console.log(err)
        }
    }
    
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    }

    const moveToUpload = () => {
        history.push('/channel/upload');
    }
    
    return (
        <div className="channel-profile">
            <div className="header">

                <div className="info">
                    {
                        channelLogo ?
                        <img src={getPhotoPublicPath(channelLogo)} alt="logo"/> :
                        <img src={UserPlaceholder} alt="logo" />
                    }

                    <div className="options">
                        <h1>{channelName}</h1>
                        <h2>{slogan}</h2>
                        <Button variant="contained" className="btn theme-secondary" onClick={moveToUpload}>Upload Video</Button>
                    </div>

                    <div className="numbers">
                        <span>
                            <h1>55k</h1>
                            <h2>views</h2>
                        </span>
                        <span>
                            <h1>{formatNumbers(subscriptions)}</h1>
                            <h2>subscribers</h2>
                        </span>
                        <span>
                            <h1>89</h1>
                            <h2>videos</h2>
                        </span>
                    </div>
                </div>

            <div className="tab-container">
                <ThemeProvider theme={MawahibTheme}>
                    <TabContext value={currentTab}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabList textColor="secondary" indicatorColor="secondary" onChange={handleTabChange} aria-label="lab API tabs example" className={'tab-list'}>
                            <Tab label="Overview" value="1" className="tab-list-item" />
                            <Tab label="Uploads" value="2" className="tab-list-item" />
                            <Tab label="Preferences" value="3" className="tab-list-item" />
                        </TabList>
                        </Box>
                        <TabPanel value="1">Item One</TabPanel>
                        <TabPanel value="2"> <UploadsTab /> </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </ThemeProvider>
            </div>
            </div>
        </div>
    );
}

export default ChannelProfile;