import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { ChannelRequests, getServerPhoto } from '../../utils/services/request';
import { FiEdit3, FiUsers } from 'react-icons/fi';
import { BsCollectionPlay, BsFillCheckCircleFill } from 'react-icons/bs';
import { IoMdNotificationsOff, IoMdNotifications } from 'react-icons/io';

const ChannelView: React.FC = props => {

    const [channel, setChannel] = useState<any>(null);
    const [subscribeCount, setSubscribeCount] = useState(0);
    const [currentTab, setCurrentTab] = useState(0);

    const ctx = useCtx();
    const navigate = useNavigate();
    const params = useParams<{id: string}>();
    const bottomLineRef = useRef<HTMLDivElement>(null);
    const firstTabRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        handleMount();
    }, []);

    const loadData = async () => {
        try{
            let { id } = params;
            if(!id) throw Error('Channel Not Found');
            
            ctx.showPreloader();
            let c = await ChannelRequests.view(id);
            ctx.hidePreloader();

            if(c && c?.status){
                setChannel(c.data);
                setSubscribeCount(c?.data?.subscriptions_count || 0)
                return;
            }
            
            //error handler for request
            if(c?.response?.data?.status === false){
                ctx.hidePreloader();
                ctx.showSnackbar(c.response.data.message, 'error');
                navigate('/')
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleMount = () => {}
    
    return (
        <div className="channel-view-page">
            <header>
                <img className="cover" src={getServerPhoto('/uploads/' + channel?.cover)} alt="cover" />
                <div className="info">
                    <div className="l">
                        <img src={getServerPhoto('/uploads/' +channel?.photo)} alt="" />
                        <div className="texts">
                            <p className="channel-category">{channel?.category?.name}</p>
                            <p className="title">{channel?.name} {channel?.verified ? <BsFillCheckCircleFill className='icon' /> : ''}</p>
                            <span className='more' >
                                <span>
                                    <FiUsers /> <p>{subscribeCount || 0}</p>
                                </span>
                                <span>
                                    <BsCollectionPlay /> <p>{channel?.playlists_count || 0}</p>
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="r">
                        {
                            ctx?.userChannel?.id === 7 ? 
                            <Button className="btn secondary edit-btn"> <FiEdit3 className='icon' /> Edit Channel</Button> :
                            <div className="controls">
                                <Button className='btn-outlined'>Follow</Button>
                                <Button className='icon-btn'><IoMdNotifications /></Button>
                            </div> 
                        }
                    </div>
                </div>
                {/* <div className="tabs"></div> */}
            </header>
            <main></main>
        </div>
    );
}

export default ChannelView;