import { Request, Response } from "express";
import seeders from "../../utils/seeders";
import * as SecurePin from 'secure-pin';
import { returnErrResponse } from "../../utils";

export const seed = async (req: Request, res: Response) => {
    try{
        await seeders();

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'seeded successfully'
        });
    }catch(err){
        res.status(500).json({
            status: false,
            type: 'error',
            data: null,
            message: err.message || err
        });
    }
};

export const uploadPhoto = async (req: Request, res: Response) => {
    if(!req.files) return returnErrResponse(res, 'no files to upload', 400);
    try{
        let {name} = req.body;
        if(!name) name = 'upload';

        let file:any = req.files.file;
        let filename = `${name}-${SecurePin.generatePinSync(5)}-${new Date().getTime()}.png`;
        console.log(filename)
        file.mv('./uploads/' + filename, err => {
            if(err) return returnErrResponse(res, err.message || 'could not upload file', 500);

            res.status(200).json({
                status: true,
                type: 'success',
                data: filename,
                message: 'upload successful'
            });
        })
    }catch(err){
        return returnErrResponse(res, err.message || 'unknown error', 500);
    }
}