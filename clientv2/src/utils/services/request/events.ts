import axios, { AxiosError } from 'axios';
import { EventViewResponse, RequestResponse } from '../../types';
import StorageService from '../store';

type entityId = string | number | any;

const eventsApis = (host: string) => {
    let token = StorageService.getItem('token');

    return {
        getHome: async (body: { user_id: entityId}) => {
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
        subscribe: async (body: {user_id: entityId, event_id: entityId}) => {
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
        unsubscribe: async (body: {user_id: entityId, event_id: entityId}) => {
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
        view: async (body: {user_id?: entityId, channel_id: entityId}, id: entityId) => {
            try{
                let { data } = await axios.post<EventViewResponse>(host + 'v1/event/view/' + id, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err: any){
                return err;
            }
        },
        participate: async (body: { channel_id: entityId, event_id: entityId}) => {
            try{
                let { data } = await axios.post<RequestResponse>(host + 'v1/event/participate', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
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