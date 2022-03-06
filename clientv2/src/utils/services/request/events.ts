import axios from 'axios';
import StorageService from '../store';

const eventsApis = (host: string) => {
    let token = StorageService.getItem('token');

    return {
        getHome: async (body: { user_id: number | string}) => {
            try{
                let { data } = await axios.post(host + 'v1/event/home', body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        subscribe: async (body: {user_id: number | string, event_id: number | string}) => {
            try{
                let { data } = await axios.post(host + 'v1/event/subscribe', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        unsubscribe: async (body: {user_id: number | string, event_id: number | string}) => {
            try{
                let { data } = await axios.post(host + 'v1/event/unsubscribe', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        view: async (body: {user_id?: string | number | any, channel_id: number | string | any}, id: number | string) => {
            try{
                let { data } = await axios.post(host + 'v1/event/view/' + id, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        }
    }
}

export default eventsApis;