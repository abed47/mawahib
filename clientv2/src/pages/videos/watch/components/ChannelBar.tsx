import React, { useEffect, useState } from 'react';
import { Button, IconButton } from '@mui/material';
import { FiUsers } from 'react-icons/fi';
import { BsCollectionPlay, BsShareFill, BsBellFill } from 'react-icons/bs';
import { AiOutlineLike, AiOutlineDislike } from 'react-icons/ai';
import { useCtx } from '../../../../utils/context';
import { VideoRequests, ChannelRequests } from '../../../../utils/services/request';
const ChannelBar: React.FC<any> = props => {

    const [channelInfo, setChannelInfo] = useState<any>(null);
    const [videoInfo, setVideoInfo] = useState<any>(null);
    const [liked, setLiked] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const ctx = useCtx();

    useEffect(() => {
        loadData();
    }, [props.channel, props.video]);

    const loadData = () => {
        setChannelInfo(props?.channel);
        setVideoInfo(props?.video);
        setLiked(props?.video?.liked);
        setSubscribed(props?.video?.subscribed);
        setLikeCount(props?.video?.likeCount);
    }

    const handleLike = async () => {
        try{
            let res = await VideoRequests.like({video_id: videoInfo?.id || 0, user_id: ctx.currentUser?.id || 0});
            
            if(res?.status){
                ctx.showSnackbar('Like successfully', 'success');
                setLiked(true);
                setLikeCount(likeCount + 1)
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return;
            }
            
            ctx.showSnackbar(res?.message || 'server error', 'error')
        }catch(err:any){
            console.log(err.message);
        }
    }

    const handleUnlike = async (video: any) => {
        try{
            let res = await VideoRequests.unlike({video_id: videoInfo?.id || 0, user_id: ctx.currentUser?.id || 0});
            if(res?.status){
                ctx.showSnackbar('Like successfully', 'success');
                setLikeCount(likeCount - 1)
                setLiked(false);
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return
            }

            ctx.showSnackbar(res?.message || 'server error', 'error')
        }catch(err: any){
            console.log(err.message);
        }
    }
    
    const handleSubscribe = async (video: any) => {
        try{
            let res = await ChannelRequests.subscribe({channel_id: channelInfo?.id || 0, user_id: ctx?.currentUser?.id || 0});

            if(res?.status){
                setSubscribed(true);
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res.message, res.type);
                return
            }
            ctx.showSnackbar(res?.message || 'server error', 'error')

        }catch(err: any){
            console.log(err.message);
        }
    }
    const handleUnsubscribe = async (video: any) => {
        try{
            let res = await ChannelRequests.unsubscribe({channel_id: channelInfo?.id || 0, user_id: ctx?.currentUser?.id || 0});

            if(res?.status){
                setSubscribed(false);
                return;
            }

            if(res?.status === false){
                ctx.showSnackbar(res.message, res.type);
                return
            }
            
            ctx.showSnackbar(res?.response?.data?.message || 'server error', 'error')
        }catch(err: any){
            console.log(err.message);
            if(err?.message){
                ctx.showSnackbar(err.message, 'error')
            }
        }
    }

    const handleShare = async () => {
        navigator.clipboard.writeText(window.location.href);
        ctx.showSnackbar('Copied to clipboard', 'info');
    }

    return (
        <div className="channel-bar">
            <div className="l">
                <img src={'http://localhost:4000/api/v1/uploads/' + channelInfo?.photo} alt="s" />
                <div className="in">
                    <p className='category'>{channelInfo?.category?.title || videoInfo?.category?.name}</p>
                    <h1 className='title'>{videoInfo?.title}</h1>
                    <span className='more' >
                        <span>
                            <FiUsers /> <p>{channelInfo?.subscriptions?.length || 0}</p>
                        </span>
                        <span>
                            <BsCollectionPlay /> <p>{channelInfo?.playlists?.length || 0}</p>
                        </span>
                    </span>
                </div>
            </div>
            <div className="r">
                {
                    !liked ?
                    <Button className='btn' onClick={handleLike}>
                        <AiOutlineLike />
                        <p>{likeCount || 0} like</p>
                    </Button> :
                    <Button className='btn' onClick={handleUnlike}>
                        <AiOutlineDislike />
                        <p>{likeCount || 0} like</p>
                    </Button>
                }

                <Button className='btn' onClick={handleShare}> 
                    <BsShareFill /> 
                    <p>Share</p>    
                </Button>

                <div className="vr"></div>

                {subscribed ? 
                    <Button className="btn outline active" onClick={handleUnsubscribe}>Following</Button> : 
                    <Button className="btn outline" onClick={handleSubscribe}>Follow</Button>
                }
                <IconButton className='btn'><BsBellFill /></IconButton>
            </div>
        </div>
    );
}

export default ChannelBar;