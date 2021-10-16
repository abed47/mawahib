import axios from 'axios';
// const serverUrl = 'https://we-import.com/admin/backend/public/'
const serverUrl = 'http://localhost/public/';
const uploadsFolder = serverUrl + 'uploads/';

axios.defaults.headers = {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

const provider = {
    getList: (resource,ops = null) => {
        return axios.get(serverUrl + resource)
    },
    create: (resource, data,ops = null) => {
        if(ops && ops.progress){
            return axios.post(serverUrl + resource, data, {
                onUploadProgress: (progress) => ops.progress(progress)
            })
        }

        return axios.post(serverUrl + resource, data)
    },
    delete: (resource,data) => {
        return axios.delete(`${serverUrl}${resource}/${data}`)
    },
    update: (resource, data, id = null) => {
        if(id){
            return axios.put(`${serverUrl}${resource}/${id}`,data)
        }
        return axios.put(`${serverUrl}${resource}`,data)
    },
    getOne: (resource, id,options = null) => {
        return axios.get(`${serverUrl}${resource}/${id}`)
    },
    updateContract: (id,data) => {
        return axios.post(serverUrl + 'partner/contract/' + id, data)
    },
    getContact: (url) => {
        return axios.get(serverUrl + url ,{
            method: 'GET',
            responseType: 'blob',
        })
    },
    getItemImage: (url) => {
        return axios.get(serverUrl + url ,{
            method: 'GET',
            responseType: 'blob'
        })
    }
}

const payrollProvider = {
    getList: () => {
        return axios.get(serverUrl + 'accounting/transactions')
    },
    getAccounts: () => {
        return axios.get(serverUrl + 'accounting/accounts')
    },
    getAccountTypes: () => {
        return axios.get(serverUrl + 'accounting/types');
    },
    getAccountGroups: () => {
        return axios.get(serverUrl + 'accounting/groups');
    },
    search: (data) => {
        return axios.post(serverUrl + 'accounting/search', data);
    },
    getTransaction: (id) => {
        return axios.get(serverUrl + 'accounting/transactions/' + id);
    },
    searchAccounts: (body) => {
        return axios.post(serverUrl + 'accounting/transactions/search', body);
    },
    init: () => {
        return axios.patch(serverUrl + 'accounting/init')
    }
};

export default provider;

export {
    provider,
    serverUrl,
    uploadsFolder,
    payrollProvider,
    axios
}