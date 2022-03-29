import { Request, Response } from "express";
import seeders from "../../utils/seeders";
import * as SecurePin from 'secure-pin';
import {errorResponse, returnErrResponse, successResponse} from "../../utils";
import {ControllerFunction} from "../../utils/types";
import {Category, Channel, Comments, Like, Subscription, Transaction, User, Video, View} from "../../database/models";
import {db} from "../../database";
import {Op} from "sequelize";
import * as moment from 'moment';
import axios from 'axios';
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
        let startDate = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD');
        let endDate = moment(new Date()).format('YYYY-MM-DD');

        let recent_followers: any = await Subscription.findAll({ 
            where: {
                channel_id,
                createdAt: {
                    [Op.between]: [today.startOf('day').toISOString(), today.endOf('day').toISOString()]
                }
            },
            include: [ User ],
            order: [['createdAt', 'DESC']],
            limit: 3
        });

        let recent_followers_all = await Subscription.count({ 
            where: {
                channel_id,
                createdAt: {
                    [Op.between]: [today.startOf('day').toISOString(), today.endOf('day').toISOString()]
                }
            },
            order: [['createdAt', 'DESC']],
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
        });
        
        let views_stats = await db.query(`
        SELECT COUNT(vw.id),
        DATE(vw."createdAt") as cat
        FROM channels c
        
        LEFT JOIN videos v ON v.channel_id = c.id
        LEFT JOIN views vw ON vw.video_id = v.id

        WHERE c.id = ${channel_id} AND vw."createdAt" BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY cat
        ORDER BY cat ASC
        `);

        let subscription_stats = await db.query(`
        SELECT COUNT(s.id),
        DATE(s."createdAt") as cat
        FROM channels c
        LEFT JOIN subscriptions s ON s.channel_id = c.id
        WHERE c.id = ${channel_id} AND s."createdAt" BETWEEN '${startDate}' AND '${endDate}'
        GROUP BY cat
        ORDER BY cat ASC
        `)

        let watch_time = null //await getWatchTime(channel_id);

        let latest_comments = await Comments.findAll({
            include: [ 
                {model: User},
                {model: Video, required: true, include: [
                    {model: Channel, where: { id: channel_id }, required: true}
                ]},
            ],
            limit: 3,
            order: [['createdAt', 'DESC']]
        })

        return successResponse(res, 200, 'success', {
            recentFollowers: recent_followers,
            likes,
            earnings,
            watchTime: watch_time,
            views_stats: views_stats[0],
            subscription_stats: subscription_stats[0],
            latest_comments,
            recent_followers_all
        });
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

const getWatchTime = async (channel_id) => {
    try{
        let videos = await Video.findAll({where: { channel_id } });

        let video_ids = [];
        let my_video_stats = [];

        videos.forEach((el: any, index) => {
            video_ids.push(el.url.replace(/https\:\/\/videodelivery\.net\//ig, '').replace(/\/manifest.*/ig, ''));
        });

        let endDate = moment(new Date()).format('YYYY-MM-DD');
        let startDate = moment(new Date()).subtract(6, 'days').format('YYYY-MM-DD')

        let data = {
            "query":
                `query {\n  
                    viewer {\n    
                        accounts(filter:{\n      
                            accountTag:\"1e6757b7e23728bf86d2c06e4dda3046\"\n\n    
                        }) 
                        {\n      
                            streamMinutesViewedAdaptiveGroups(\n        
                                filter: {\n          
                                    date_lt: \"${endDate}\"\n          
                                    date_gt: \"${startDate}\"\n        
                                }\n        orderBy:[sum_minutesViewed_DESC]\n        
                                limit: 10000\n      ) 
                        {\n   
                            count\n   
                            sum {\n          minutesViewed\n         }\n       
                            dimensions{\n      uid\n   datetimeHour\n    }\n      }\n    }\n  }\n}\n\n`
        }

        let allWatchTimes: any = await axios.post('https://api.cloudflare.com/client/v4/graphql',
            JSON.parse(JSON.stringify(data)),
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer 1dKNSWW4oclx5q0QD3u2ccL_g7Bt-x8Abr10IVVb'
                }
            }
            )

        // for(let i = 0; i < allWatchTimes.data.data.viewer.accounts[0].streamMinutesViewedAdaptiveGroups.length; i++){
        //     video_ids.forEach((vid: any, index) => {
        //         if(allWatchTimes.data.data.viewer.accounts[0].streamMinutesViewedAdaptiveGroups[i].dimensions.uid === vid) my_video_stats.push(allWatchTimes.data.data.viewer.accounts[0].streamMinutesViewedAdaptiveGroups[i])
        //     })
        // }

        // return my_video_stats;
        return allWatchTimes.data
        return video_ids;
    }catch(err){
        console.log(err?.response || 'server error')
        throw err;
    }
}