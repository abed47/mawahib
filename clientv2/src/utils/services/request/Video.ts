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
        getRelatedVideos: async (body: { fields: {category_id: number}, pagination: {limit: number, offset: number}}) => {
            try{
                let { data: res } = await cachedHttp.post('v1/video/search', body, {
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
        },
        like: async (body: {user_id: number, video_id: number}) => {
            try{
                let { data } = await axios.post(host + 'v1/like', body, {
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
        unlike: async (body: {user_id: number, video_id: number}) => {
            try{
                let { data } = await axios.delete(host + 'v1/like',{
                    data: body,
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
        searchComments: async (body: {fields?:{user_id?: number, video_id?: number, content?: string}, exact?:boolean, pagination?: any}) => {
            try{
                let { data } = await axios.post(host + 'v1/comment/search', body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err:any){
                return err;
            }
        },
        createComment: async (body: {user_id: number, video_id: number, content: string}) => {
            try{
                let { data } = await axios.post(host + 'v1/comment', body, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
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

export default VideoApis;