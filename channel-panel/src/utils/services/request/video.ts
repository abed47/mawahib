import axios from "axios";
import StorageService from "../store";

const VideoApis = (host: string) =>  {
    let token = StorageService.getItem('token');
    return {
        searchVideos: async (body: {fields: any, pagination: { limit: number, offset: number}}) => {
            try{
                let { data } = await axios.post(host + 'v1/video/search', body, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        createVideo: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/video/upload', body, {
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Bearer ${token}`
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        uploadVideoToCloudFlare: async (body: any) => {
            try{
                let { data } = await axios.post('https://api.cloudflare.com/client/v4/accounts/1e6757b7e23728bf86d2c06e4dda3046/stream', body, {
                headers: {
                    'Authorization': 'Bearer 6LnxT7snJrfGxvhwPfLcK0LYyEIgBhvfNuQgmNqN',
                    'Content-Type': 'multipart/form-data'
                    }
                });

                return data
            }catch(err){
                return err;
            }
        },
        startLiveStream: async (body: any) => {
            try{
                let { data } = await axios.post('https://api.cloudflare.com/client/v4/accounts/1e6757b7e23728bf86d2c06e4dda3046/stream/live_inputs', body, {
                headers: {
                    'Authorization': 'Bearer iw7_KA-UuHLGzwgJyYvpjFSm7LfwBSwybbhbc2F1',
                    // 'Content-Type': 'multipart/form-data'
                    }
                });

                return data
            }catch(err){
                return err;
            }
        }
    }
}

export default VideoApis;