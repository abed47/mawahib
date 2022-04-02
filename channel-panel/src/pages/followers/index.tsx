import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import 'react-tabs/style/react-tabs.css';
import { Tab, Tabs, Box, Typography } from '@mui/material';
import { useCtx } from '../../utils/context';
import { ChannelRequests, handlePhotoUrl } from '../../utils/services/request';
import CheerIcon from '../../assets/images/cheer.png';

function a11yProps(index: any) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

function TabPanel(props: any) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
}

const FollowersHome: React.FC = props => {
    
    const [followerCount, setFollowerCount] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    const [allFollowers, setAllFollowers] = useState<any[]>([]);
    const [cheerSenders, setCheerSenders] = useState<any[]>([]);
    const [filteredFollowers, setFilteredFollowers] = useState<any[]>([]);
    
    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            ctx.showPreloader();
            let res = await ChannelRequests.getFollowers({channel_id: ctx.channel.id});
            ctx.hidePreloader();

            if(res && res?.status){
                setAllFollowers(res.data);
                setFollowerCount(res.data?.length || 0);
                let senders: any[] = [];
                res.data.forEach((item: any) => {
                    if(item?.user?.transactions?.length > 0){
                        senders.push(item);
                    }
                });
                setCheerSenders(senders);
                return;
            }

            if(res && res?.message){
                ctx.showSnackbar(res.message || 'server error', 'error');
                return;
            }

            if(res?.response?.data?.data?.message){
                ctx.showSnackbar(res?.response?.data?.data?.message || 'server error', 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="followers-home">
            <header>
                <div className="l">
                    <p>{followerCount}</p>
                    <p>Followers</p>
                </div>

                {/* <div className="r">
                    <div className="search-box">
                        <input type="text" />  
                        <Button><BiSearchAlt2 /></Button>
                    </div>
                </div> */}
            </header>
            <div className="tabs-wrapper">
                    <Box style={{borderBottom: '1px solid #f7f7f739'}}>
                        <Tabs value={currentTab} onChange={(e, v) => {
                            setCurrentTab(v)
                        }} aria-label="basic tabs example">
                            <Tab className='tab-head' label="All" {...a11yProps(0)} />
                            <Tab className='tab-head' label="Cheer Senders" {...a11yProps(1)} />
                        </Tabs>
                        </Box>
                        <TabPanel className="tab-panel" value={currentTab} index={0}>
                            <div className="follower-list">
                                {
                                    allFollowers.map((item: any, i: number) => {
                                        return (
                                            <div className="list-item" key={`all-followers-list-item-${i}`}>
                                                <img src={handlePhotoUrl(item.user.photo, "user")} alt="" />
                                                <h1>{item.user.name}</h1>
                                                {
                                                    item?.user?.transactions?.length > 0 ? <img src={CheerIcon} className="cheer-sender-indicator" alt="cheer sender indicator" /> : null
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPanel>
                        <TabPanel className="tab-panel" value={currentTab} index={1}>
                            <div className="follower-list">
                                {
                                    cheerSenders.map((item: any, i: number) => {
                                        return (
                                            <div className="list-item" key={`cheer-senders-followers-list-item-${i}`}>
                                                <img src={handlePhotoUrl(item.user.photo, "user")} alt="" />
                                                <h1>{item.user.name}</h1>
                                                {
                                                    item?.user?.transactions?.length > 0 ? <img src={CheerIcon} className="cheer-sender-indicator" alt="cheer sender indicator" /> : null
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </TabPanel>
            </div>
        </div>
    );
}

export default FollowersHome;