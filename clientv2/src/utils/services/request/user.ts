import axios from 'axios';
import StorageService from '../store';

const UserApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
        getUserInfo: async () => {
            try{
                let { data } = await axios.post(host + 'v1/user/me', {}, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        updateUserInfo: async (id: any, body: any) => {
            try{
                let { data } = await axios.put(host + 'v1/user/' + id, body, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        uploadUserPhoto: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/user/upload-photo', body, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
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

export default UserApis;