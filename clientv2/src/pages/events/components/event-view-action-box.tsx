import React, { useEffect, useState } from 'react';
import { EventViewResponseData } from '../../../utils/types';
import { handlePhotoUrl } from '../../../utils/services/request';
import { FiUsers } from 'react-icons/fi';
import { BsCollectionPlay } from 'react-icons/bs';
import { Button } from '@mui/material';
import { BsShareFill } from 'react-icons/bs';
import { useCtx } from '../../../utils/context';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { EventRequests } from '../../../utils/services/request';
interface ComponentProps {
    data: EventViewResponseData;
    status: number;
    updateStatus?: (e: any) => void;
    videoPlaying?: boolean;
    videoProps?: any
    reload?: () => void;
}
const EventViewActionBox: React.FC<ComponentProps> = ({data, status, reload}) => {

    const [participated, setParticipated] = useState(false);
    const [canRegister, setCanRegister] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [hasChannel, setHasChannel] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        handleMount();
    }, [ctx?.currentUser, ctx?.userChannel, data])

    const handleMount = () => {
        //if registered
        const p = data.participated;
        //check if can upload
        const canU = moment(data.start_date).isBefore(moment(new Date()));
        //check if can register
        const canR = moment(data.registration_start).isBefore(moment(new Date())) && moment(data.registration_end).isAfter(moment(new Date()))
        
        setParticipated(p);
        setCanSubmit(canU);
        setCanRegister(canR);
        if(ctx.userChannel) setHasChannel(true);
        setSubscribed(data.subscribed);
    }

    const handleParticipate = () => {
        //check if registration permitted
        //check if user is logged_in
        //check if user has a channel
    }

    const handleSubscribe = async () => {
        try{
            ctx.showPreloader();
            let user_id = ctx?.currentUser?.id || null;
            let res = await EventRequests.subscribe({event_id: data.id, user_id: user_id});
            ctx.hidePreloader();

            if(res && res.status){
                if(reload) reload();
                return;
            }
            
            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                navigate('/events');
                return;
            }

            if(res?.response?.data?.message){
                ctx.showSnackbar(res?.response?.data?.message! || 'server error', 'error');
            }
            navigate('/events');
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleUnsubscribe = async () => {
        try{
            ctx.showPreloader();
            let user_id = ctx?.currentUser?.id || null;
            let res = await EventRequests.unsubscribe({event_id: data.id, user_id: user_id});
            ctx.hidePreloader();

            if(res && res.status){
                if(reload) reload();
                return;
            }
            
            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                navigate('/events');
                return;
            }

            if(res?.response?.data?.message){
                ctx.showSnackbar(res?.response?.data?.message! || 'server error', 'error');
            }
            navigate('/events');
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        ctx.showSnackbar('Copied to clipboard', 'info');
    }

    const handleSubmit = () => {}

    return (
        <div className="action-box">
            <div className="l">
                <img src={handlePhotoUrl(data.photo, "logo")} alt="logo" />
                <div className="info">
                    <p className="category">{data.category.name}</p>
                    <p className="title">{data?.sponsor_name || data.title}</p> 
                    <div className="icons">
                        <span>
                            <FiUsers className='icon' /> <p>{data.subscription_count || 0}</p>
                        </span>
                        <span>
                            <BsCollectionPlay className='icon' /> <p>{data.submission_count || 0}</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className="r">
                {
                    canRegister && !participated ? <Button className='btn' onClick={handleParticipate}>participate</Button> : null
                }
                {
                    canSubmit && participated ? <Button className='btn' onClick={handleSubmit}>Submit</Button> : null
                }
                <div className="vr"></div>
                {
                    subscribed === true ? 
                    <Button className='btn disabled' onClick={handleUnsubscribe}>Subscribed</Button> :
                    <Button className='btn' onClick={handleSubscribe}>Subscribe</Button>
                }
                <Button className='btn transparent' onClick={handleShare}> <BsShareFill className='icon' /> Share</Button>
            </div>
        </div>
    )
}

export default EventViewActionBox;