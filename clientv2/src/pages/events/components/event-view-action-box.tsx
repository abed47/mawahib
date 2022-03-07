import React, { useEffect, useState } from 'react';
import { EventViewResponseData } from '../../../utils/types';
import { handlePhotoUrl } from '../../../utils/services/request';
import { FiUsers } from 'react-icons/fi';
import { BsCollectionPlay } from 'react-icons/bs';
import { Button } from '@mui/material';
import { BsShareFill } from 'react-icons/bs';
import { useCtx } from '../../../utils/context';
import moment from 'moment';

interface ComponentProps {
    data: EventViewResponseData;
    status: number;
    updateStatus?: (e: any) => void;
    videoPlaying?: boolean;
    videoProps?: any
}
const EventViewActionBox: React.FC<ComponentProps> = ({data, status}) => {

    const [participated, setParticipated] = useState(false);
    const [canRegister, setCanRegister] = useState(false);
    const [canSubmit, setCanSubmit] = useState(false);

    const ctx = useCtx();

    useEffect(() => {
        handleMount();
    }, [])

    const handleMount = () => {}

    const handleParticipate = () => {
        //check if registration permitted
        //check if user is logged_in
        //check if user has a channel
    }

    const handleSubscribe = () => {
        //check if user is logged in
    }

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        ctx.showSnackbar('Copied to clipboard', 'info');
    }

    /**
     * @description check weather the user can participate in the event or not
     */
    const canParticipate = () => {
        //if registered
        const participated = data.participated;
        //check if can upload
        const canUpload = moment(data.start_date).isAfter(moment(new Date()));
        //check if can register
        const canRegister = moment(data.registration_start).isBefore(moment(new Date())) && moment(data.registration_end).isAfter(moment(new Date()))
        
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
                <Button className='btn' onClick={canParticipate}>participate</Button>
                <div className="vr"></div>
                <Button className='btn'>Subscribe</Button>
                <Button className='btn transparent' onClick={handleShare}> <BsShareFill className='icon' /> Share</Button>
            </div>
        </div>
    )
}

export default EventViewActionBox;