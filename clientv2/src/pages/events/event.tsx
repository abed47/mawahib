import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { EventRequests } from '../../utils/services/request';

const EventPage: React.FC = props => {

    const [data, setData] = useState<any>({});

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
            let res = await EventRequests.view({user_id, channel_id}, params.id!);
            ctx.hidePreloader();

            console.log(res);
        }catch(err){
            return err;
        }
    }

    return (
        <div className="event-page">
            <header>
                <img src={data?.cover} alt="Event cover" />
                <div className="info"></div>
            </header>
        </div>
    )
}

export default EventPage;