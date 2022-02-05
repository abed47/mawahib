import axios from 'axios';
import { cacheAdapterEnhancer } from 'axios-extensions';
import StorageService from '../store';

const VideoApis = (host: string) => {
    let token = StorageService.getItem('token');
    const cachedHttp = axios.create({
        baseURL: host,
        headers: { 'Cache-Control': 'no-cache'},
        adapter: cacheAdapterEnhancer(axios.defaults.adapter!)
    });

    return {
        getRelatedVideos: async (body: { id: number}) => {
            try{
                let res = await cachedHttp.post('v1/video/related', body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return res;
            }catch(err){
                return err;
            }
        },
        viewVideo: async (body: {user_id: number, video_id: number}) => {
            try{
                let { data } = await axios.post(host + 'v1/video/view', body, {
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

export default VideoApis;