import { Button } from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { ChannelRequests, getChannelPanelUrl, handlePhotoUrl } from '../../utils/services/request';
import { FiEdit3, FiUsers } from 'react-icons/fi';
import { BsCollectionPlay, BsFillCheckCircleFill } from 'react-icons/bs';
import { IoMdNotifications } from 'react-icons/io';
import * as store from '../../utils/services/store';
import ChannelHome from './ChannelHome';

const ChannelView: React.FC = props => {

    const [channel, setChannel] = useState<any>(null);
    const [subscribeCount, setSubscribeCount] = useState(0);
    const [subscribed, setSubscribed] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);

    const ctx = useCtx();
    const navigate = useNavigate();
    const params = useParams<{id: string}>();
    const bottomLineRef = useRef<HTMLDivElement>(null);
    const firstElRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadData();
        handleMount();
    }, []);

    const loadData = async () => {
        try{
            let { id } = params;
            if(!id) throw Error('Channel Not Found');
            let currentUser: any = store.getItem('currentUser');
            
            ctx.showPreloader();
            let c = await ChannelRequests.view(id, { user_id: currentUser?.id });
            ctx.hidePreloader();

            if(c && c?.status){
                setChannel(c.data);
                setSubscribeCount(c?.data?.subscriptions_count || 0);
                setSubscribed(c.data.subscribed);
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

    const handleMount = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = firstElRef.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && firstElRef?.current) bottomLineRef.current.style.top = (firstElRef.current?.offsetTop  + firstElRef.current?.clientHeight + 3) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = firstElRef.current?.clientWidth + 'px';
        setCurrentTab(0)
    }

    const handleTabChange = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>, i: number) => {
        if(bottomLineRef?.current) bottomLineRef.current.style.left = e.currentTarget.offsetLeft + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.width = e.currentTarget.clientWidth + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.top = (e.currentTarget.offsetTop + e.currentTarget.clientHeight + 3 )+ 'px'
        setCurrentTab(i)
    }

    const handleSubscribe = async () => {
        try{
            let currentUser: any = ctx.currentUser || store.getItem('currentUser');
            
            ctx.showPreloader();
            let res = await ChannelRequests.subscribe({channel_id: channel.id, user_id: currentUser?.id});
            ctx.hidePreloader();
            
            if(res && res?.status){
                loadData();
                return
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message, 'error');
                return;
            }

            if(res?.response?.data?.status){
                ctx.showSnackbar(res.response.data.message, 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleUnsubscribe = async () => {
        try{
            let currentUser: any = ctx.currentUser || store.getItem('currentUser');
            
            ctx.showPreloader();
            let res = await ChannelRequests.unsubscribe({channel_id: channel.id, user_id: currentUser?.id});
            ctx.hidePreloader();
            
            if(res && res?.status){
                loadData();
                return
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message, 'error');
                return;
            }

            if(res?.response?.data?.status){
                ctx.showSnackbar(res.response.data.message, 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const navigateTo = (url: string, redirect:boolean = false, includeToken: boolean = false) => {
        if(includeToken) url += '/login?tok=' + store.getItem('token');
        if(redirect) return window.open(url, '_blank')
        navigate(url);
    }

    
    return (
        <div className="channel-view-page">
            <header>
                <img className="cover" src={handlePhotoUrl(channel?.cover)} alt="cover" />
                
                <div className="info">
                    <div className="l">
                        <img src={handlePhotoUrl(channel?.photo)} alt="" />
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
                            ctx?.userChannel?.id ? 
                            <Button className="btn secondary edit-btn" onClick={() => navigateTo(getChannelPanelUrl(), true, true)}> <FiEdit3 className='icon' /> Edit Channel</Button> :
                            <div className="controls">
                                {
                                    subscribed ? 
                                    <Button className='btn-outlined secondary' onClick={handleUnsubscribe}>Following</Button> : 
                                    <Button className='btn-outlined' onClick={handleSubscribe}>Follow</Button>
                                }
                                <Button className='icon-btn'><IoMdNotifications /></Button>
                            </div> 
                        }
                    </div>
                </div>

                <div className="bottom">
                    <div className="channel-tabs-header">
                        <div className="titles">
                            <h1 ref={firstElRef} className={`${currentTab === 0 ? 'active' : ''}`} onClick={e => handleTabChange(e, 0)} >Home</h1>
                            <h1 className={`${currentTab === 1 ? 'active' : ''}`} onClick={e => handleTabChange(e, 1)} >About</h1>
                        </div>
                        <div ref={bottomLineRef} className="bottom-bar"></div>
                    </div>

                    <div className="top-fans">
                        <p className="title">Top fans</p>
                        <div className="top-fans-list">
                            {
                                channel?.top_fans?.length ? channel.top_fans?.map((item: any, index: number) => {
                                    return (
                                        <div className="top-fans-list-item" key={`top-fans-list-item-${index}`}>
                                            <img src={handlePhotoUrl(item.photo, "user")} alt="user" />
                                            <p>{item.name}</p>
                                        </div>
                                    );
                                }) : null
                            }
                        </div>
                    </div>
                </div>
            </header>
            <main>
                <div className={`tab-content ${currentTab === 0 ? 'active' : ''}`}>
                    <ChannelHome 
                        channel_id={channel?.id} 
                        latestVideos={channel?.latest_videos || []} 
                        scheduledVideos={channel?.scheduled || []} />
                </div>
                <div className={`tab-content ${currentTab === 1 ? 'active' : ''}`}>
                    <p className='channel-description'>{channel?.description}</p>
                </div>
            </main>
        </div>
    );
}

export default ChannelView;