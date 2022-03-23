import { Button } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { BiSearchAlt2 } from 'react-icons/bi';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

const FollowersHome: React.FC = props => {
    
    const [followerCount, serFollowerCount] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);
    
    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {}

    return (
        <div className="followers-home">
            <header>
                <div className="l">
                    <p>{followerCount}</p>
                    <p>Followers</p>
                </div>

                <div className="r">
                    <div className="search-box">
                        <input type="text" />  
                        <Button><BiSearchAlt2 /></Button>
                    </div>
                </div>
            </header>
            <div className="tabs-wrapper">
                <Tabs>
                    <TabList>
                        <Tab>Title 1</Tab>
                        <Tab>Title 2</Tab>
                    </TabList>

                    <TabPanel>
                        <h2>Any content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Any content 2</h2>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

export default FollowersHome;