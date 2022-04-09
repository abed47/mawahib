import { CircularProgress } from '@mui/material';
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultVideoCard from '../../../components/DefaultVideoCard';
import { useCtx } from '../../../utils/context';
import { VideoRequests } from '../../../utils/services/request';

const UploadsSection: React.FC<{id: any | string}> = props => {

    const [currentTab, setCurrentTab] = useState(0);
    const [dataList, setDataList] = useState([]);
    const [uploads, setUploads] = useState([]);
    const [uploadsTotal, setUploadsTotal] = useState(0);
    const [playlists, setPlaylists] = useState([]);
    const [playlistsTotal, setPlaylistsTotal] = useState(0);
    const [events, setEvent] = useState([]);
    const [eventsTotal, setEventTotal] = useState(0);
    const [processing, setProcessing] = useState(false);

    const ctx = useCtx();
    const navigate = useNavigate();

    const bottomLineRef = useRef<HTMLDivElement>(null);
    const firstElRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleMount();
    }, [props.id])

    const handleMount = () => {
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.left = firstElRef.current?.offsetLeft + 'px';
        if(bottomLineRef?.current?.style && firstElRef?.current) bottomLineRef.current.style.top = (firstElRef.current?.offsetTop  + firstElRef.current?.clientHeight + 3) + 'px';
        if(bottomLineRef?.current?.style) bottomLineRef.current.style.width = firstElRef.current?.clientWidth + 'px';
        setCurrentTab(0)
        handleLoadItems(0);
    }

    const handleTabChange = (e: React.MouseEvent<HTMLHeadingElement, MouseEvent>, i: number) => {
        if(bottomLineRef?.current) bottomLineRef.current.style.left = e.currentTarget.offsetLeft + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.width = e.currentTarget.clientWidth + 'px';
        if(bottomLineRef?.current) bottomLineRef.current.style.top = (e.currentTarget.offsetTop + e.currentTarget.clientHeight + 3 )+ 'px'
        setCurrentTab(i)
        handleLoadItems(i);
    }
    
    const handleLoadItems = (i: number) => {
        if(i === 0 && uploads.length === 0){
            loadAllUploads();
        }
    }

    const loadAllUploads = async () => {
        try{
            setProcessing(true);
            let res = await VideoRequests.searchVideos({fields: {channel_id: props.id}, pagination: {limit: 12, offset: 0}});
            setProcessing(false);
            
            if(res && res?.status){
                setUploads(res.data);
                setUploadsTotal(res.pagination.totalRows);
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message, 'error');
                navigate('/');
                return;
            }

            if(res?.response?.data?.message){
                ctx.showSnackbar(res?.response?.data?.message || 'server error', 'error');
            }

            navigate('/')
        }catch(err: any){
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }
    
    return (
        <section className="channel-uploads">
                <div className="titles">
                    <h1>Uploads</h1>
                    <div className="tab-titles">
                        <p ref={firstElRef} className={`tab ${currentTab === 0 ? 'active' : ''}`} onClick={e => handleTabChange(e, 0)}>All uploads</p>
                        <p className={`tab ${currentTab === 1 ? 'active' : ''}`} onClick={e => handleTabChange(e, 1)}>Playlists</p>
                        <p className={`tab ${currentTab === 2 ? 'active' : ''}`} onClick={e => handleTabChange(e, 2)}>Events</p>
                        <div className="tabs-bottom-line" ref={bottomLineRef}></div>
                    </div>
                </div>

                <div className="uploads-tab-content">

                    <div className={`channel-upload-tab ${currentTab === 0 ? 'active' : ''}`}>
                        {
                            processing ? 
                            <div className="progress"><CircularProgress className='circle' /></div> :
                            <div className="video-list">
                                {
                                    uploads.map((item: any, index) => {
                                        return (
                                            <DefaultVideoCard 
                                                key={`total-upload-video-list-item-${index}`}
                                                id={item?.id}
                                                category={item.category}
                                                views={item.views.length}
                                                channel={item.channel}
                                                thumbnail={item.thumbnail}
                                                title={item.title}
                                                className={'mr mt'}
                                            />
                                        )
                                    })
                                }
                            </div>
                        }
                    </div>
                    <div className={`channel-upload-tab ${currentTab === 1 ? 'active' : ''}`}>Playlists</div>
                    <div className={`channel-upload-tab ${currentTab === 2 ? 'active' : ''}`}>Events</div>
                </div>
            </section>
    );
}

export default UploadsSection;