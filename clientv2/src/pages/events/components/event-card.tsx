import { Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useCtx } from '../../../utils/context';
import { EventRequests, handlePhotoUrl } from '../../../utils/services/request';

interface EventCardProps {
    id: number;
    photo: string;
    title: string;
    subscribed: boolean;
    categoryName: string;
    reload?: () => void
}

const EventCard: React.FC<EventCardProps> = props => {

    const ctx = useCtx();

    const handleSubscribe = async () => {
        try{
            let res = await EventRequests.subscribe({user_id: ctx?.currentUser?.id, event_id: props.id});
            
            if(res && res?.status){
                if(props?.reload) props.reload();
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return;
            }
            
        }catch(err: any){
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    const handleUnsubscribe = async () => {
        try{
            try{
                let res = await EventRequests.unsubscribe({user_id: ctx?.currentUser?.id, event_id: props.id});
                
                if(res && res?.status){
                    if(props?.reload) props.reload();
                    return;
                }
    
                if(res && res?.status === false){
                    ctx.showSnackbar(res.message, 'error');
                    return;
                }
                
            }catch(err: any){
                ctx.showSnackbar(err?.message || 'server error', 'error');
            }
        }catch(err: any){
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="event-card">
            <img src={handlePhotoUrl(props.photo)} alt="event thumbnail" />
            <div className="info">
                <div className="l">
                    <p className='category'>{props.categoryName}</p>
                    <p className="title">{props.title}</p>    
                </div>
                <div className="r">
                    {
                        props.subscribed === false ?
                        <Button className='btn' onClick={handleSubscribe}>Subscribe</Button> :
                        <Button className='btn disabled' onClick={handleUnsubscribe}>Subscribed</Button>
                    }
                    
                </div>
            </div>
        </div>
    );
}

export default EventCard;