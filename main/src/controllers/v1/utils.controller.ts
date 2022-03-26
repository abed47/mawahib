import { Request, Response } from "express";
import seeders from "../../utils/seeders";
import * as SecurePin from 'secure-pin';
import {errorResponse, returnErrResponse, successResponse} from "../../utils";
import {ControllerFunction} from "../../utils/types";
import {Category, Video} from "../../database/models";
import {db} from "../../database";
import {Op} from "sequelize";

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

export const getHomeData: ControllerFunction = async (req, res) => {
    try{
        let bannerItems = await Video.findAll({ where: { [Op.and]: [
                    {type: { [Op.eq]: 1}},
                    {banner: { [Op.eq]: true}}
                ] }, order: [['createdAt', 'DESC']], limit: 6});

        let topTalents = await db.query(`SELECT 
            c.id, 
            c.name,
            (SELECT COUNT(*) FROM subscriptions where subscriptions.channel_id = c.id) as subscription_count,
            c.photo
            from channels c
            ORDER BY subscription_count DESC
            LIMIT 15`);

        let recommended = await Video.findAll({ where: { [Op.and]: [
                    {type: { [Op.eq]: 1}},
                    {recommended_home: { [Op.eq]: true}}
                ] }, order: [['createdAt', 'DESC']], limit: 6});

        let categories = await Category.findAll({ where: { home: true }, limit: 7});

        return successResponse(res, 200, 'retrieved successfully', {
            bannerItems,
            topTalents,
            recommended,
            categories
        });
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}