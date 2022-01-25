import axios from 'axios';
import StorageService from '../store';

const UtilsApis = (host: string) => {
    return {
        uploadPhoto: async (body: any) => {
            const token = StorageService.getItem('token');
            try{
                let { data } = await axios(host + 'v1/utils/upload-image', {
                    method: 'POST',
                    data: body,
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        "Authorization": `Bearer ${token}`
                    }
                });
    
                return data
            }catch(err){
                return err;
            }
        }
    }
}

export default UtilsApis;