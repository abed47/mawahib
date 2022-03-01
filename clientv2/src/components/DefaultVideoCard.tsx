import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handlePhotoUrl } from '../utils/services/request';

interface DefaultVideoCardProps {
    thumbnail: string,
    id: string | number,
    channel: any,
    views: number,
    category: any,
    title: any | string,
    className?: any| string
}

const DefaultVideoCard: React.FC<DefaultVideoCardProps> = props => {

    const navigate = useNavigate();

    const handleVideoClick = () => navigate('/watch/' + props.id);

    return (
        <div onClick={handleVideoClick} className={`default-video-list-item ${props?.className ? props.className : ''}`}>
            <img src={handlePhotoUrl(props.thumbnail, 2)} alt="thumbnail"/>
            <div className="info">
                <div className="l">
                    <h2 className='title'>{props?.title}</h2>
                    <p className='category'>{props?.category?.name}</p>
                </div>
                <div className="r">
                    <p className='views'>{props.views} views</p>
                </div>
            </div>
        </div>
    );
}

export default DefaultVideoCard;