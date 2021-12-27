import axios from 'axios';
import StoreService from './store';
const host = "staging.mawahib.tv";
const port = 4001;
export const users_ms_url   = `http://${host}:${port}/api/v1/`;
export const videos_ms_url  = `http://${host}:${port}/api/v1/`;
export const query_ms_url   = `http://${host}:${port}/api/v1/`;

// export const users_ms_url   = "http://localhost:4001/api/v1/u/";
// export const videos_ms_url  = "http://localhost:4002/api/v1/v/";
// export const query_ms_url   = "http://localhost:4000/api/v1/q/";


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

export const getPhotoPublicPath = (file) => users_ms_url + 'uploads/' + file;
export const getVideoThumbnailPublicPath = (file) => videos_ms_url + 'uploads/images/' + file;
export const getVideoPublicPath = (file) => videos_ms_url + 'uploads/video/' + file;
export const getCategoryImage = (file) => videos_ms_url + 'uploads/images/' + file;

const signup = async (body) => {
    try {
        let response  = await fetch( users_ms_url + 'auth/register',{
            
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST'
        });

        let responseObj = await response.json();

        return responseObj;

    } catch (err) {
        throw new Error(err);
    }
};

const login = async (body) => {
    let form = JSON.stringify(body);
    try{
        let response = await fetch(users_ms_url + 'auth/login', {
            method: 'POST',
            body: form,
            headers:{
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err) {
        throw new Error(err);
    }
};

export const updateUserProfilePicture = async (body) => {
    let token = StoreService.get('token');
    try{
        let response = await fetch(users_ms_url + 'user/update-user-profile', {
            method: 'POST',
            body: body,
            headers: {
                // 'Content-Type': 'multipart/form-data',
                'Authorization': 'Bearer ' + token
            }
        })

        let responseObj = await response.json();

        return responseObj;

    }catch(err){
        return err
    }
}

export const uploadPhoto = async (body) => {
    let token = StoreService.get('token');
    try{
        
        let response = await fetch(users_ms_url + 'utils/upload-image', {
            method: 'POST',
            body,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        let responseObj = response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}
export const updateUserProfile = async (id, body) => {
    let token = StoreService.get('token');
    try{
        let response = await fetch(users_ms_url + 'user/' + id, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        let responseObj = await response.json();

        return responseObj;

    }catch(err){
        return err
    }
}

export const getCurrentUser = async () => {

    let token = StoreService.get('token');
    let id = StoreService.get('currentUser').id;

    try{
        let response = await fetch(users_ms_url + 'user/' + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })

        let responseObj = await response.json();

        return responseObj;

    }catch(err){
        return err
    }
}

export const createChannel = async (body) => {
    let token = StoreService.get('token');
    try{
        let response = await fetch(users_ms_url + 'channel', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        return err;
    }
}

export const getCurrentUserChannel = async () => {
    let token = StoreService.get('token');
    try{
        let response = await fetch(users_ms_url + `user/${StoreService.get('currentUser').id}/channel`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();
        return responseObj;

    }catch(err){
        return err;
    }
}

/* ============================================= VIDEO REQUEST =================================================== */

export const createComment = async (body, service = null) => {
    
    let token = StoreService.get('token');
    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);

    try{

        let response = await fetch(sUrl + 'comments', {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const searchComments = async (body, service = null) => {

    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);
    
    try{
        let response = await fetch(sUrl + 'comments/search', {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const uploadChannelVideo = async (body) => {

    let token = StoreService.get('token');

    try{
        
        let response = await fetch(videos_ms_url + 'video/upload', {
            method: 'POST',
            body,
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        let responseObj = await response.json();

        return responseObj;

    }catch(err){
        throw new Error(err);
    }
}

export const searchVideos = async (body, service = null) => {
    
    let token = StoreService.get('token');
    let sUrl = videos_ms_url;
    if(service > 0) sUrl = getServiceUrl(service);

    try{

        let response = await fetch(sUrl + 'video/search',{
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const getRelatedVideos = async (body, service = null) => {
    
    let sUrl = videos_ms_url;
    if(service > 0) sUrl = getServiceUrl(service);

    try{

        let response = await fetch(sUrl + 'video/related',{
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const likeVideo = async (body, service = null) => {

    let token = StoreService.get('token');
    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);

    try{
        let response = await fetch(sUrl + 'like', {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const dislikeVideo = async (body, service = null) => {

    let token = StoreService.get('token');
    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);

    try{
        let response = await fetch(sUrl + 'like', {
            method: 'DELETE',
            body: JSON.stringify(body),
            headers:{
                'Authorization': 'Bearer ' + token,
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const searchLikes = async (body, service = null) => {

    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);
    
    console.log(body)

    try{
        let response = await fetch(sUrl + 'like/search', {
            method: 'POST',
            body: JSON.stringify(body),
            headers:{
                'Content-Type': 'application/json'
            }
        });

        let responseObj = await response.json();

        return responseObj;
    }catch(err){
        throw new Error(err);
    }
}

export const recordView = async (body, service = null) => {
    let sUrl = videos_ms_url;
    if(service) sUrl = getServiceUrl(service);

    try {
        let response = await fetch(sUrl + 'video/view', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let responseObj =  await response.json();

        return responseObj;
    } catch (err) {
        throw new Error(err);
    }
}


export const getCategories = async () => {
    let sUrl = videos_ms_url;

    try {
        let response = await fetch(sUrl + 'category', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        let responseObj =  await response.json();

        return responseObj;
    } catch (err) {
        throw new Error(err);
    }
}

const RequestService = {signup, login};

export default RequestService;