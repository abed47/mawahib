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
        }
    }
}

export default eventsApis;