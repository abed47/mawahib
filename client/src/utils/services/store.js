// let storage = (localStorage.getItem('type') == 2 ? localStorage : sessionStorage);

const store = (key, val, type = null) => {
    let storage = (localStorage.getItem('type') == 2 ? localStorage : sessionStorage);
    let s = storage;
    let d = val;
    if((type && type == 2) || localStorage.getItem('type')) {
        s = localStorage;
        sessionStorage.removeItem(key)
    };

    if(typeof d == 'object') d = JSON.stringify(val);

    s.setItem(key, d);
}

const get = (key, type = null) => {
    let storage = (localStorage.getItem('type') == 2 ? localStorage : sessionStorage);
    let s = storage;
    if(type && type == 2) s = localStorage;

    let d = s.getItem(key);
    if(d && key !== 'token') d = JSON.parse(d);
    return d;
}

const clear = () => {
    let storage = (localStorage.getItem('type') == 2 ? localStorage : sessionStorage);
    storage.clear();
}

let StoreService = {store, get,clear};
export default StoreService;