import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCtx } from '../../utils/context';
import { EventRequests } from '../../utils/services/request';
import EventCategoryList from './components/event-category-list';

const EventsHome: React.FC = props => {

    const [categoryList, setCategoryList] = useState([]);
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

            if(res && res?.status){
                setCategoryList(res.data.event_categories);
                return;
            }
            console.log(res);
        }catch(err: any){
            ctx.hidePreloader();
            ctx.showSnackbar(err?.message || 'server error', 'error');
        }
    }

    return (
        <div className="events-page home">
            <EventCategoryList dataList={categoryList} />
        </div>
    );
}

export default EventsHome;