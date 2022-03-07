import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { EventRequests, handlePhotoUrl } from '../../utils/services/request';
import { EventViewResponseData, EventViewResponse } from '../../utils/types';
import EventViewActionBox from './components/event-view-action-box';

import EventViewHeader from './components/event-view-header';

const EventPage: React.FC = props => {

    const [data, setData] = useState<EventViewResponseData>();
    const [eventEnded, setEventEnded] = useState(false);
    const [eventStatus, setEventStatus] = useState(1);

    const ctx = useCtx();
    const navigate = useNavigate();
    const params = useParams<{id: string}>();

    useEffect(() => {
        loadData();
    }, [ctx?.currentUser]);

    const loadData = async () => {
        try{
            let user_id = ctx?.currentUser?.id || null;
            let channel_id = ctx?.userChannel?.id || null;
            ctx.showPreloader();
            let res: EventViewResponse = await EventRequests.view({user_id, channel_id}, params.id!);
            ctx.hidePreloader();

            if(res && res.status){
                setData(res.data);
                return;
            }

            if(res && res?.status === false){
                ctx.showSnackbar(res.message, 'error');
                return;
            }

            // if(res?.response?.data?.message){
            //     ctx.showSnackbar(res.response.data.message, 'error');
            //     navigate('/');
            // }
        }catch(err: any){
            ctx.showSnackbar(err?.response?.data?.message || err?.message || 'server error', 'error');
            navigate('/')
        }
    }



    return (
        <div className="event-page">
            {data?.id ? <EventViewHeader data={data} updateStatus={setEventStatus} /> : null}
            {data?.id ? <EventViewActionBox data={data} updateStatus={setEventStatus} status={eventStatus} reload={loadData} /> : null}
        </div>
    )
}

export default EventPage;