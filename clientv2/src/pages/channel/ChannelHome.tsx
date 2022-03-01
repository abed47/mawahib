import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultVideoCard from '../../components/DefaultVideoCard';
import { useCtx } from '../../utils/context';
import UploadsSection from './components/UploadsSection';

interface ComponentInterface {
    channel_id: string,
    latestVideos: any[],
    scheduledVideos: any[]
}

const ChannelHome: React.FC<ComponentInterface> = props => {
        
    const ctx = useCtx();
    const navigate = useNavigate();
    

    return (
        <div className="channel-home">
            <section className="latest-releases">
                <h1>Latest Releases</h1>
                <div className="latest-releases-video-list">
                    {
                        props.latestVideos.map((item: any, index: number) => {
                            return <DefaultVideoCard 
                                    key={`latest-video-list-item-${index}`}
                                    id={item.id} 
                                    channel={item.channel}
                                    category={item.category}
                                    views={item.view_count}
                                    thumbnail={item.thumbnail}
                                    title={item.title}
                                    className="mr mt"
                                    />
                        })
                    }
                </div>
            </section>

            <UploadsSection id={props?.channel_id} />
        </div>
    )
}

export default ChannelHome;