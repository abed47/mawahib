import axios from 'axios';
import StorageService from '../store';

const ChannelApis = (host: string) => {
    let token = StorageService.getItem('token');
    return {
        listProducts: async () => {
            try{
                let { data } = await axios.get(host + 'v1/purchases/product-list',{
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        walletInfo: async () => {
            try{
                let { data } = await axios.get(host + 'v1/purchases/wallet-info', {
                    headers: {
                        'Content-Type': 'application/json',
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

export default ChannelApis;