import { After, Before } from "adminjs"
import * as path from 'path';
import * as fs from 'fs';
import * as faker from 'faker';

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
        const filePath = path.join('uploads', faker.random.alphaNumeric(5) + uploadImage.name.replace(/\ /ig, ""));
        await fs.promises.mkdir(path.dirname(filePath), {recursive: true});
        await fs.promises.rename(uploadImage.path, filePath);
        await record.update({ photo: `/${filePath}`});
    }
    return response;
}

export {
    after, before
}