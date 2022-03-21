import axios from 'axios';
import StorageService from '../store';

const ChannelApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
        createChannel: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/channel', body, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                return data;
            }catch(err){
                return err;
            }
        },
        view: async (id: number | string, body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/channel/view/' + id, body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err: any){
                return err;
            }
        },
        subscribe: async (body: {channel_id: number, user_id: number}) => {
            try{
                const { data } = await axios.post(host + 'v1/channel/subscribe', body, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        unsubscribe: async (body: {channel_id: number, user_id: number}) => {
            try{
                const { data } = await axios.post(host + 'v1/channel/unsubscribe', body, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        search: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/channel/search', body, {
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

export default ChannelApis;