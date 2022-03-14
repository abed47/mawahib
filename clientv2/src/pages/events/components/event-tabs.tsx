import { Button } from '@mui/material';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { handlePhotoUrl } from '../../../utils/services/request';
import { EventViewResponseData } from '../../../utils/types';
import EventInfoTab from './event-info-tab';

interface ComponentProps {
    data: EventViewResponseData | any
}

const EventTabs: React.FC<ComponentProps> = props => {

    const [currentTab, setCurrentTab] = useState(0);

    const handleTabChange = (t: number) => {
        setCurrentTab(t);
    }

    return (
        <div className="event-tabs">
            <div className="tool-bar">
                <div className="event-tabs-buttons">
                    <div onClick={() => handleTabChange(0)} className={`tab-title ${currentTab === 0 ? 'active' : ''}`}>Info</div>
                    <div onClick={() => handleTabChange(1)} className={`tab-title ${currentTab === 1 ? 'active' : ''}`}>Participants</div>
                    <div onClick={() => handleTabChange(2)} className={`tab-title ${currentTab === 2 ? 'active' : ''}`}>Performances</div>
                    <div onClick={() => handleTabChange(3)} className={`tab-title ${currentTab === 3 ? 'active' : ''}`}>Highlights</div>
                </div>

                <div className="search-box">
                    <input type="text" placeholder="Search this section" />
                    <Button className='btn'> <FaSearch /> </Button>
                </div>
            </div>

            <div className="tabs-contents">
                <div className={`tab-content ${currentTab === 0 ? 'active' : ''}`}><EventInfoTab data={props.data} /></div>
                <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>
                    <div className="participants">
                        {
                            props.data.participants.map((item: any, index: number) => {
                                return (
                                    <div className="participant" key={`event-participant-${index}`}>
                                        <img src={handlePhotoUrl(item?.channel?.photo)} alt="channel img" />
                                        <p>{item?.channel?.name}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
                <div className={`tab-content ${currentTab === 2 ? 'active' : ''}`}>Tab 1</div>
                <div className={`tab-content ${currentTab === 3 ? 'active' : ''}`}>Tab 1</div>
            </div>
        </div>
    )
}

export default EventTabs;