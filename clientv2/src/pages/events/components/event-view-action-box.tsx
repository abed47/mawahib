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
import { EventRequests, getChannelPanelUrl } from '../../../utils/services/request';
import ParticipateDialog from './participate-dialog';
import WithdrawDialog from './withdraw-dialog';
import simpleCrypto from 'simple-crypto-js';
import { getQe } from '../../../utils/helpers';
import ConfirmationDialog from './confirmation-dialog';

interface ComponentProps {
    data: EventViewResponseData;
    status: number;
    updateStatus?: (e: any) => void;
    videoPlaying?: boolean;
    videoProps?: any
    reload?: () => void;
}

const EventViewActionBox: React.FC<ComponentProps> = ({data, status, reload, videoPlaying, videoProps}) => {

    const [participated, setParticipated] = useState(false);
    const [canRegister, setCanRegister] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);
    const [hasChannel, setHasChannel] = useState(false);
    const [subscribed, setSubscribed] = useState(false);
    const [participateDialogOpen, setParticipateDialogOpen] = useState(false);
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
    const [confirmVoteDialogOpen, setConfirmVoteDialogOpen] = useState(false);
    const [canVote, setCanVote] = useState(false);

    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        handleMount();
    }, [ctx?.currentUser, ctx?.userChannel, data])

    const handleMount = () => {
        //if registered
        const p = data.participated;
        //check if can upload
        const canU = typeof data?.can_submit?.id === "string" || typeof data?.can_submit?.id === "number";
        //check if can register
        const canR = moment(data.registration_start).isBefore(moment(new Date())) && moment(data.registration_end).isAfter(moment(new Date()))
        setParticipated(p);
        setCanSubmit(canU);
        setCanRegister(canR);
        if(ctx.userChannel) setHasChannel(true);
        setSubscribed(data.subscribed);
        setCanVote(data.can_vote);
        console.log(data);
    }

    const handleParticipate = () => {
        let user_id = ctx?.currentUser?.id;
        let channel_id = ctx?.userChannel?.id;
        if(!user_id) return navigate('/login');
        if(!channel_id) return navigate('/create/channel')

        setParticipateDialogOpen(true);
    }

    const handleWithdraw = () => {
        let user_id = ctx?.currentUser?.id;
        let channel_id = ctx?.userChannel?.id;
        if(!user_id) return navigate('/login');
        if(!channel_id) return navigate('/create/channel')

        setWithdrawDialogOpen(true);
    }

    const participateInEvent = async () => {
        try{
            let event_id = data.id;
            let channel_id = ctx?.userChannel?.id;
            setParticipateDialogOpen(false);
            ctx.showPreloader();
            let res: any = await EventRequests.participate({channel_id, event_id});

            if(res && res?.status){
                if(reload) return reload();
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                return;
            }

            if(res?.response?.data?.message){
                ctx.showSnackbar(res.response.data.message, 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'serve error', 'error');
        }
    }

    const withdrawFromEvent = async () => {
        try{
            let event_id = data.id;
            let channel_id = ctx?.userChannel?.id;
            setWithdrawDialogOpen(false);
            ctx.showPreloader();
            let res: any = await EventRequests.participate({channel_id, event_id});

            if(res && res?.status){
                if(reload) return reload();
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
                return;
            }

            if(res?.response?.data?.message){
                ctx.showSnackbar(res.response.data.message, 'error');
            }
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'serve error', 'error');
        }
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

    const handleSubmit = () => {
        let channel_id = ctx.userChannel.id;
        let event_id = data.id;
        let action = 'event_submit';

        let s = JSON.stringify({
            channel_id,
            event_id,
            action
        });
        
        let crypto = new simpleCrypto(getQe());
        let encrypted = crypto.encrypt(s);
        console.log(encrypted)
        let token = ctx.token;
        let url = getChannelPanelUrl() + '/login?tok=' + token + '&act=' + encodeURI(encrypted);
        return window.open(url, '_blank');
    }

    const handleVote = async () => {
        setConfirmVoteDialogOpen(false);
        let body = {
            event_id: videoProps.event_id,
            submission_id: videoProps.id,
            participation_id: videoProps.participation_id,
            stage_number: videoProps.stage_number,
            user_id: ctx?.currentUser?.id
        }

        try{
            ctx.showPreloader();
            let res = await EventRequests.vote(body);
            ctx.hidePreloader();

            if(res && res?.status){
                // ctx.showSnackbar(res.messgae)
                setCanVote(false);
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res?.message || 'server error', 'error');
            }

            if(res?.response?.data?.status === false){
                ctx.showSnackbar(res.response.data?.message || 'server error', 'error')
            }
        }catch(err: any){
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

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
                    videoPlaying && data.user_vote && canVote ? <Button className="btn" onClick={() => setConfirmVoteDialogOpen(true)}>Vote</Button> : null
                }
                {
                    canRegister && !participated ? <Button className='btn' onClick={handleParticipate}>participate</Button> : null
                }
                {
                    canSubmit && participated && data.submitted === false ? <Button className='btn' onClick={handleSubmit}>Submit</Button> : null
                }
                {
                    participated ? <Button className='btn disabled' onClick={handleWithdraw}>Withdraw</Button> : null
                }
                <div className="vr"></div>
                {
                    subscribed === true ? 
                    <Button className='btn disabled' onClick={handleUnsubscribe}>Subscribed</Button> :
                    <Button className='btn' onClick={handleSubscribe}>Subscribe</Button>
                }
                <Button className='btn transparent' onClick={handleShare}> <BsShareFill className='icon' /> Share</Button>
            </div>

            <ParticipateDialog 
                open={participateDialogOpen} 
                onSuccess={participateInEvent}
                onClose={() => setParticipateDialogOpen(false)}
            />

            <WithdrawDialog 
                open={withdrawDialogOpen}
                onSuccess={withdrawFromEvent}
                onClose={() => setWithdrawDialogOpen(false)}
            />

            <ConfirmationDialog 
                open={confirmVoteDialogOpen}
                onSuccess={handleVote}
                onClose={() => setConfirmVoteDialogOpen(false)}
                message={"once you vote you cannot revoke your vote or vote for anyone else during the current event Stage"}
            />
        </div>
    )
}

export default EventViewActionBox;