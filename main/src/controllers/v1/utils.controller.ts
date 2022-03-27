import { Request, Response } from "express";
import seeders from "../../utils/seeders";
import * as SecurePin from 'secure-pin';
import {errorResponse, returnErrResponse, successResponse} from "../../utils";
import {ControllerFunction} from "../../utils/types";
import {Category, Like, Subscription, Transaction, User, Video} from "../../database/models";
import {db} from "../../database";
import {Op} from "sequelize";
import * as moment from 'moment';

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
        let bannerItems = await Video.findAll({ where: 
            { [Op.and]: [
                    { type: 1},
                    { banner: true }
                ] 
            }, order: [['createdAt', 'DESC']], limit: 6});

        let topTalents = await db.query(`SELECT 
            c.id, 
            c.name,
            (SELECT COUNT(*) FROM subscriptions where subscriptions.channel_id = c.id) as subscription_count,
            c.photo
            from channels c
            ORDER BY subscription_count DESC
            LIMIT 15`);

        let recommended = await Video.findAll({ where: { [Op.and]: [
                    {type: 1},
                    {recommended_home: true}
                ] }, order: [['createdAt', 'DESC']], limit: 6});

        let categories = await Category.findAll({ where: { home: true }, limit: 7});

        let otherVideos = await Video.findAll({ where: { type: 1 }, order: [['createdAt', 'DESC']], limit: 6})

        return successResponse(res, 200, 'retrieved successfully', {
            bannerItems,
            topTalents,
            recommended,
            categories,
            otherVideos
        });
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const channelDashboard: ControllerFunction = async (req, res) => {
    let { channel_id } = req.body;
    if(!channel_id) return errorResponse(res, 400, 'missing required fields');
    try{
        let today = moment(new Date());
        let recentFollowers: any = await Subscription.findAll({ 
            where: {
                channel_id,
                createdAt: {
                    [Op.between]: [today.startOf('day').toISOString(), today.endOf('day').toISOString()]
                }
            },
            include: [ User ]
        });

        let likes = await Like.count({
            include: [
                { model: Video, required: true, where: { channel_id }}
            ]
        });

        let earnings = await Transaction.sum('amount', { 
            where: { 
                [Op.and]: [
                    {channel_id},
                    { createdAt: {
                        [Op.between]: [moment(new Date()).subtract(6, 'days').format('YYYY-MM-DDThh:mm:ssZ'), moment(new Date()).endOf('day').format('YYYY-MM-DDThh:mm:ssZ')]
                    }}
                ]
             }
        })

        return successResponse(res, 200, 'success', {
            recentFollowers,
            likes,
            earnings
        });
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}