import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { EventRequests, handlePhotoUrl } from '../../utils/services/request';
import { EventViewResponseData, EventViewResponse } from '../../utils/types';
import EventTabs from './components/event-tabs';
import EventViewActionBox from './components/event-view-action-box';

import EventViewHeader from './components/event-view-header';

const EventPage: React.FC = props => {

    const [data, setData] = useState<EventViewResponseData>();
    const [eventEnded, setEventEnded] = useState(false);
    const [eventStatus, setEventStatus] = useState(1);

    //video related states
    const [playingVideo, setPlayingVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [playingVideoData, setPlayingVideoData] = useState<any>(null);

    const ctx = useCtx();
    const navigate = useNavigate();
    const params = useParams<{id: string}>();

    useEffect(() => {
        loadData();

        return () => {
            setVideoUrl('');
            setPlayingVideo(false);
            setPlayingVideoData(null);
        }

    }, [ctx?.currentUser]);

    const loadData = async () => {
        try{
            let user_id = ctx?.currentUser?.id || null;
            let channel_id = ctx?.userChannel?.id || null;
            ctx.showPreloader();
            let res: EventViewResponse = await EventRequests.view({user_id, channel_id}, params.id!);
            ctx.hidePreloader();

            if(res && res.status){
                setData(res.data);
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return;
            }

            // if(res?.response?.data?.message){
            //     ctx.showSnackbar(res.response.data.message, 'error');
            //     navigate('/');
            // }
        }catch(err: any){
            ctx.showSnackbar(err?.response?.data?.message || err?.message || 'server error', 'error');
            navigate('/')
        }
    }

    const handleVideoSelected = (e: any) => {
        setVideoUrl(e.video.url);
        setPlayingVideo(true);
        setPlayingVideoData(e);
    }

    return (
        <div className="event-page">
            {data?.id ? <EventViewHeader data={data} updateStatus={setEventStatus} playerUrl={videoUrl} showPlayer={playingVideo} hidePlayer={setPlayingVideo} /> : null}
            {data?.id ? <EventViewActionBox videoProps={playingVideoData} videoPlaying={playingVideo} data={data} updateStatus={setEventStatus} status={eventStatus} reload={loadData} /> : null}
            {data?.id ? <EventTabs data={data} setPlayerUrl={handleVideoSelected} playerUrl={videoUrl} showPlayer={playingVideo} hidePlayer={setPlayingVideo} /> : null}
        </div>
    )
}

export default EventPage;