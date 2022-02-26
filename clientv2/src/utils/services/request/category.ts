import axios from 'axios';
import StorageService from '../store';

const CategoryApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
        // createChannel: async (body: any) => {
        //     try{
        //         let { data } = await axios.post(host + 'v1/category', body, {
        //             headers: {
        //                 "Content-Type": "application/json",
        //                 "Authorization": `Bearer ${token}`
        //             }
        //         });

        //         return data;
        //     }catch(err){
        //         return err;
        //     }
        // },
        getNew: async () => {
            try{
                let { data } = await axios.get(host + 'v1/category/new');
                return data;
            }catch(err){
                return err;
            }
        },
        getPopular: async () => {
            try{
                let { data } = await axios.get(host + 'v1/category/popular');
                return data;
            }catch(err){
                return err;
            }
        },
        getMostViewed: async () => {
            try{
                let { data } = await axios.get(host + 'v1/category/most-viewed');
                return data;
            }catch(err){
                return err;
            }
        },
        getAll: async () => {
            try{
                let { data } = await axios.get(host + 'v1/category', {
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

export default CategoryApis;