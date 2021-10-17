export const users_ms_url   = "http://localhost:4001/api/v1/u/";
export const videos_ms_url  = "http://localhost:4002/api/v1/v/";
export const query_ms_url   = "http://localhost:4000/api/v1/q/";
export const getCategoryPhoto = (url) => `${videos_ms_url}uploads/images/${url}`;
const getServiceUrl = (num) => {
    switch(num){
        case 1:
            return query_ms_url;
        case 2:
            return users_ms_url;
        case 3:
            return videos_ms_url;
        default:
            return query_ms_url;
    }
}

export const login = (body) => {};
export const getCategories = async () => {

    try{
        let response = await fetch(`${videos_ms_url}category`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(JSON.parse(err));
    }

};
export const searchCategories = body => {};
export const createCategory = async body => {

    try{
        let response = await fetch(`${videos_ms_url}category`, {
            method: 'POST',
            body
        });

        let responseObj = await response.json();
        return responseObj;
    }catch(err){
        return JSON.parse(err);
    }
};

export const updateCategory = async (body, id) => {

    try{
        let response = await fetch(`${videos_ms_url}category/${id}`, {
            method: 'PUT',
            body
        });

        let responseObj = await response.json();
        return responseObj;
    }catch(err){
        return JSON.parse(err);
    }
};

export const deleteCategory = async id => {

    try{
        let response = await fetch(`${videos_ms_url}category/${id}`, {
            method: 'DELETE'
        });

        let responseObj = await response.json();
        return responseObj;
    }catch(err){
        return JSON.parse(err);
    }

};