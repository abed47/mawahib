import axios from 'axios';
import StorageService from '../store';

const PurchasesApis = (host: string) => {
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
        },
        getProduct: async (id: number | string) => {
            try{
                let { data } = await axios.get(host + 'v1/purchases/product/' + id, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                return data;
            }catch(err){
                return err;
            }
        },
        getPaymentIntent: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/purchases/payment-intent', body, {
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
        recordTransaction: async (body: any) => {
            try{
                let { data } = await axios.post(host + 'v1/purchases/confirm-payment', body, {
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
        getTransactionHistory: async () => {
            try{
                let { data } = await axios.get(host + 'v1/purchases/transaction-history', {
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

export default PurchasesApis;