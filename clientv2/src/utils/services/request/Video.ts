import axios from 'axios';
import StorageService from '../store';

const VideoApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
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