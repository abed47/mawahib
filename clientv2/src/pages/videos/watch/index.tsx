import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../../utils/context';
import { VideoRequests } from '../../../utils/services/request';
import ChannelBar from './components/ChannelBar';
import ExtraInfoTabs from './components/ExtraInfoTabs';
import VideoWrapper from './components/Video';
import V2Wrapper from './components/V2PlayerWrapper';
//@ts-ignore
const WatchScreen: React.FC = props => {

    const [videoDetails, setVideoDetails] = useState<any>(null);

    const params = useParams();
    const ctx = useCtx();
    const navigate = useNavigate();
    
    


    const loadData =async () => {
            try{
                let { id } = params;
                if(!id) navigate('/');
                ctx.showPreloader();
                let body = {
                    user_id: ctx?.currentUser?.id,
                    video_id: +id!
                }
                let res = await VideoRequests.viewVideo(body);
                ctx.hidePreloader();
                setVideoDetails(null);
                setVideoDetails(res.data);
            }catch(err: any){
                ctx.hidePreloader();
                ctx.showSnackbar(err.message || 'server error', 'error');
            }
        }
    ;

    useEffect(() => {
        loadData();
    }, [params]);

    return(
        <div className="watch-video-page">
            {/* <VideoWrapper url={videoDetails?.url} /> */}
            {videoDetails?.url ? <V2Wrapper url={videoDetails?.url} /> : null}
            <ChannelBar channel={ videoDetails?.channel } video={ videoDetails } />
            <ExtraInfoTabs data={videoDetails} />
        </div>
    );
}

export default WatchScreen;