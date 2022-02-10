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
        }
    }
}

export default ChannelApis;