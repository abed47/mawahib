import { After, Before } from "adminjs"
import * as path from 'path';
import * as fs from 'fs';
import * as faker from 'faker';
import * as chance from 'chance';

const before: Before = async (request, context) => {
    if(request.method === 'post'){
        const { uploadImage, ...otherParams} = request.payload;
        
        context.uploadImage = uploadImage;

        return {
            ...request,
            payload: otherParams
        }
    }

    return request;
}

const after: After<any> = async (response, request, context) => {
    const { record, uploadImage } = context;

    if(record.isValid() && uploadImage){
        const filePath = path.join('uploads', chance().string({ length: 5, alpha: true, numeric: true, casing: "lower" }) + uploadImage.name.replace(/\ /ig, ""));
        await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
        await fs.promises.rename(uploadImage.path, filePath);
        await record.update({ photo: `/${filePath}`});
    }
    return response;
}

export {
    after, before
}