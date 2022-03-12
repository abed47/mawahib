let storage = [localStorage, sessionStorage];

export const getItem: (key: string, type?: number) => string | number | any[] | {} | null = (key, type = 0) => {
    let item: any = storage[type].getItem(key);
    // console.log(item);
    if(!item) return false;
    return JSON.parse(item);
}

export const setItem: (key: string, value: any, type?: number) => void = (key, value, type = 0) => {
    //TODO: update to b2
    storage[type].setItem(key, JSON.stringify(value));
}

export const clear: (type?: number) => void = (type = 0) => {
    storage[type].clear();
}

 const StorageService = {
    getItem,
    setItem,
    clear
}

export default StorageService;