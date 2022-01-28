import axios from 'axios';
import StorageService from '../store';

const PlaylistApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
        list: async () => {
            try{
                let { data } = await axios.get(host + 'v1/playlist/list', {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        getOne: async (id: number | string) => {
            try{
                let { data } = await axios.get(host + 'v1/playlist/' + id, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        }
    }
}

export default PlaylistApis;