import { Button } from '@mui/material';
import React from 'react';
import { handlePhotoUrl } from '../../../utils/services/request';
interface EventCardProps {
    id: number;
    photo: string;
    title: string;
    subscribed: boolean;
    categoryName: string
}

const EventCard: React.FC<EventCardProps> = props => {

    return (
        <div className="event-card">
            <img src={handlePhotoUrl(props.photo)} alt="event thumbnail" />
            <div className="info">
                <div className="l">
                    <p className='category'>{props.categoryName}</p>
                    <p className="title">{props.title}</p>    
                </div>
                <div className="r">
                    <Button className='btn'>Subscribe</Button>
                </div>
            </div>
        </div>
    );
}

export default EventCard;