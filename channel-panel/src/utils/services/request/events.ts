import axios from 'axios';
import StorageService from '../store';

type entityId = string | number | any;

const eventsApis = (host: string) => {
    let token = StorageService.getItem('token');

    return {
        getEvent: async (id: entityId) => {
            try{
                let { data } = await axios.get(host + 'v1/event/' + id);
                return data;
            }catch(err){
                return err;
            }
        }
    }
}

export default eventsApis;