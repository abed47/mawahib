import { After, Before } from "adminjs"
import * as path from 'path';
import * as fs from 'fs';
import * as faker from 'faker';
import * as chance from 'chance';

const before: Before = async (request, context) => {
    if(request.method === 'post'){
        const { uploadCover, ...otherParams} = request.payload;
        
        context.uploadCover = uploadCover;

        return {
            ...request,
            payload: otherParams
        }
    }

    return request;
}

const after: After<any> = async (response, request, context) => {
    const { record, uploadCover } = context;

    if(record.isValid() && uploadCover){
        const filePath = path.join('uploads', chance().string({length: 5, numeric: true, alpha: true, casing: "lower"}) + uploadCover.name.replace(/\ /ig, ""));
        await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
        await fs.promises.rename(uploadCover.path, filePath);
        await record.update({ cover: `/${filePath}`});
    }
    return response;
}

export {
    after, before
}