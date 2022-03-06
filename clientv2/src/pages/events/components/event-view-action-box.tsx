import React from 'react';
import { EventViewResponseData } from '../../../utils/types';
import { handlePhotoUrl } from '../../../utils/services/request';

interface ComponentProps {
    data: EventViewResponseData;
    status: number;
    updateStatus?: (e: any) => void;
    videoPlaying?: boolean;
}
const EventViewActionBox: React.FC<ComponentProps> = ({data, status}) => {

    return (
        <div className="action-box">
            <div className="l">
                <img src={handlePhotoUrl(data.photo, "logo")} alt="logo" />
                <div className="info">
                    <p className="category">{data.category_id}</p>
                    <p className="">{data?.sponsor_name || data.title}</p> 
                </div>
            </div>
            <div className="r"></div>
        </div>
    )
}

export default EventViewActionBox;