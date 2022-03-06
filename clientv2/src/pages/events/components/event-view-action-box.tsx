import React from 'react';
import { EventViewResponseData } from '../../../utils/types';
import { handlePhotoUrl } from '../../../utils/services/request';
import { FiUsers } from 'react-icons/fi';
import { BsCollectionPlay } from 'react-icons/bs';
import { Button } from '@mui/material';

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
                    <div className="icons">
                        <span>
                            <FiUsers /> <p>{data.subscription_count || 0}</p>
                        </span>
                        <span>
                            <BsCollectionPlay /> <p>{data.submission_count || 0}</p>
                        </span>
                    </div>
                </div>
            </div>
            <div className="r">
                <Button>participate</Button>
                <div className="vr"></div>
                <Button>Subscribe</Button>
                <Button>Share</Button>
            </div>
        </div>
    )
}

export default EventViewActionBox;