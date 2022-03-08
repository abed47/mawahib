import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import {Channel, Playlist, Subscription, Transaction, User, Video, View} from "../../database/models";
import {errorResponse, returnErrResponse, successResponse} from "../../utils";
import {ControllerFunction} from "../../utils/types";
import Category from "../../database/models/category";
import { db } from "../../database";
import * as moment from 'moment';
import Comment from "../../database/models/comments";

export const getAll = async (req: Request, res: Response) => {
    
    try{

        let channels = await Channel.findAll({
            include: [
                {model: User},
                {model: Subscription}
            ]
        });

        res.status(200).json({
            status: true,
            type: 'success',
            data: channels,
            message: 'retrieved successfully'
        });
        
    }catch(err){
        returnErrResponse(res, err.message ||  'unknown error', 500);
    }
}

export const getOne = async (req: Request, res: Response) => {

    let id = req.params.id;

    try{
        let channel = await Channel.findOne({where: {id}});

        res.status(200).json({
            status: true,
            type: 'success',
            data: channel,
            message: 'retrieved successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const create = async (req: Request, res: Response) => {
    let {name, description, photo, userId, cover, slogan, watermark, category_id, mysterious} = req.body;

    if(!name || !userId) return returnErrResponse(res, 'all fields are required', 400);

    try {

        let c = await Channel.findOne({where: {user_id: userId}});

        if(c) return returnErrResponse(res, 'user already has a channel', 401);

        let channel: any = await Channel.create({name, description, photo, user_id: userId, cover, slogan, watermark, category_id, mysterious});

        res.status(200).json({
            status: true,
            type: 'success',
            data: channel,
            message: 'created successfully'
        });


    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

//TODO:create an update for admin - another for channel owner
export const update = async (req: Request, res: Response) => {
    let user = req['user'];
    let updateObj = req.body;
    let channelId = req.params.id;

    try{

        if(updateObj.user_id) delete updateObj.user_id;

        //if admin or modirator
        if(user.type > 1 && user.type < 4) await Channel.update(updateObj, {where: {id: channelId}});

        //if channel owner
        if(user.type == 1) await Channel.update(updateObj, {where: {
            [Op.and]: [
                {id: channelId},
                {user_id: channelId}
            ]
        }});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'updated successfully'
        });

    updateObj.id = channelId;

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const destroy = async (req: Request, res: Response) => {
    let user = req['user'];
    let id = req.params.id;

    try {

        //if admin or moderator
        if(user.type > 1 && user.type <  4) await Channel.destroy({
            where: {id}
        });

        //if channel owner
        if(user.type == 1) await Channel.destroy({where:{
            [Op.and]:[
                {id},
                {user_id: user.id}
            ]
        }});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'deleted successfully'
        });


    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const view: ControllerFunction = async (req, res) => {
    try{
        let { id } = req.params;
        let { user_id } = req.body;
        let subscribed = false;

        if(user_id){
            let subscribedCheck = await Subscription.findOne({where: { channel_id: id, user_id: user_id }});
            if(subscribedCheck) subscribed = true;
        }

        //get channel's top fans
        let top_fans: any = await db.query(`SELECT u.name as name, 
            u.id as id, 
            u.photo as photo, 
            SUM(t.amount) as amount_given 
            FROM users u LEFT JOIN transactions t ON t.user_id = u.id 
            WHERE t.channel_id = 1 
            GROUP BY u.id ORDER BY amount_given DESC LIMIT 3`, { raw: true })

        // let latest_videos = await Video.findAll({
        //     where: {
        //         channel_id: id,
        //         [Op.or]: [{premier: null}, {premier: {[Op.gt]: moment().format('YYYY-MM-DDThh:mm:ss')}}]
        //     },
        //     attributes: ['id', 'createdAt', 'category_id', 'title', 'thumbnail', [Sequelize.fn('COUNT', Sequelize.col('views.id')), 'view_count']],
        //     include: [{ model: View, attributes: [], required: false}, { model: Category, required: false}],
        //     limit: 4,
        //     group: ['video.id', 'category.id'],
        //     order: [['createdAt', 'DESC']]
        // })

        let latest_videos = await Video.findAll({
            where: {
                channel_id: id,
                [Op.or]: [{premier: null}, {premier: {[Op.gt]: moment().format('YYYY-MM-DDThh:mm:ss')}}]
            },
            attributes: [[Sequelize.fn("COUNT", Sequelize.col("views.id")), "view_count"], 'id', 'title', 'thumbnail', 'category_id'],
            include: [ { model: View, required: false, attributes: [] }, { model: Category, required: false, attributes: ['id', 'name']}],
            group: ['video.id', 'category.id'],
            order: [['createdAt', 'DESC']]
        })

        //TODO: get listen for notifications
        let c: any = await Channel.findOne({where: { id },
            attributes: {
                include: [ "id", "createdAt", "updatedAt",
                    [Sequelize.fn("COUNT", Sequelize.col("subscriptions.id")), "subscriptions_count"],
                    [Sequelize.fn("COUNT", Sequelize.col("playlists.id")), "playlists_count"]
                ],

            },
            include: [
                { model: Category, required: false },
                { model: Subscription, required: false, attributes: []},
                {model: Playlist, required: false, attributes: []}

            ],
            group: ['channel.id', 'category.id']
        });
        if(!c) return errorResponse(res, 404, 'channel does not exist');
        return successResponse(res, 200, 'retrieved successfully', {...c.dataValues, subscribed, top_fans: top_fans[0], latest_videos});
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const getChannelVideos: ControllerFunction = async (req, res) => {
    let { pagination, channel_id } = req.body;
    let filters = {
        where: {
            channel_id
        },
        order: [['createdAt', 'DESC']]
    };

    if(pagination && pagination?.limit && pagination?.offset >= 0){
        filters['offset'] = pagination.offset;
        filters['limit'] = pagination.limit;
    }

    try{

        let totalRows = await Video.count({ where: { channel_id }});

        let videos: any = await Video.findAll({
            where: {
                channel_id
            },
            attributes: [
                'id',
                'title',
                'thumbnail',
                'createdAt',
                [Sequelize.literal('(SELECT COUNT(id) FROM comments WHERE video_id = "video"."id")'), 'comment_count'],
                [Sequelize.literal('(SELECT COUNT(id) FROM likes WHERE video_id = "video"."id")'), 'like count'],
                [Sequelize.fn('COUNT', Sequelize.col('views.id')), 'view_count'],
            ],
            include: [
                { model: View, required: false, attributes: []},
            ],
            group: ['video.id'],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            type: 'success',
            status: true,
            data: videos,
            pagination: {totalRows: 50},
            message: 'retrieved successfully'
        })

    }catch (err) {
        return errorResponse(res, 500, err?.message || 'server error');
    }
}