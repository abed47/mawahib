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
        getChannelVideo: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/channel/get-videos', body, {
                    headers:{
                        "Content-Type": "application/json"
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        channelDashboard: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/utils/channel-dashboard', body, {
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

export default ChannelApis;