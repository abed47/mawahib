import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { EventRequests } from '../../utils/services/request';

const EventsHome: React.FC = props => {

    const ctx = useCtx();
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try{
            let user_id = ctx?.currentUser?.id;
            ctx.showPreloader();
            let res = await EventRequests.getHome({user_id});
            ctx.hidePreloader();

            console.log(res);
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="events-page home">
            Event-home
        </div>
    );
}

export default EventsHome;