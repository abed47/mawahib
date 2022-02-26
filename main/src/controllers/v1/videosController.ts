import { Request, Response } from "express";
import { Channel, Like, Playlist, Subscription, User, Video, View } from "../../database/models";
import { returnErrResponse, successResponse } from "../../utils";
import * as securePin from 'secure-pin';
import { Op } from "sequelize";
import Comment from "../../database/models/comments";
import Category from "../../database/models/category";

export const view = async (req: Request, res: Response) => {
    let {user_id, video_id} = req.body;

    try{
        if(!user_id) user_id = 0;
        let v: any = await View.create({user_id, video_id});
        let video: any = await Video.findOne({where: { id: video_id}, include: [
            { model: Channel , include: [
                {
                    model: Subscription,
                    required: false,
                },
                {
                    model: Playlist,
                    required: false,
                },
                {
                    model: Category,
                    required: false
                }
            ]},
            { model: View, required: false },
            { model: Like, required: false },
            { model: Category, required: false}
        ]});
        
        let liked = false;
        let likeCount = 0;
        let subscribed = false;
        let subscribeCount = 0;
        let likeCheck = null;
        let subCheck = null;

        if(user_id){
            likeCheck = await Like.findAll({where: {video_id, user_id}});
            subCheck = await Subscription.findAll({where: { channel_id: video?.channel?.id, user_id}});
        }

        if(likeCheck?.length) liked = true;
        if(subCheck?.length) subscribed = true;
        likeCount = video.likes?.length || 0;
        subscribeCount =  video?.channel?.subscriptions?.length || 0;

        let results = {
            ...video.dataValues,
            liked,
            likeCount,
            subscribed,
            subscribeCount
        }
        
        res.status(200).json({
            status: true,
            type: 'success',
            data: results,
            message: 'view created successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const create = async (req: Request, res: Response) => {
    let { title, description, channel_id, user_id, category_id, tags, kids, mysterious, has_promotion, visible, url, thumbnail} = req.body;

    if(!title || !description || !channel_id || !user_id) return returnErrResponse(res, 'all fields are required', 400);

    try{

        await Video.create({title, description, channel_id, user_id, category_id, tags, kids, mysterious, has_promotion, visible, url, thumbnail});
        return successResponse(res, 200, 'created successfully', null);

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const filter = async (req: Request, res: Response) => {
    //TODO: enhance - convert to promise
    let {fields, exact, pagination} = req.body;
    let videoCount: any = 0;

    console.log(req.body)
    if(!fields || !Object.keys(fields)) return returnErrResponse(res, 'all fields are required', 400);

    let filters = [];

    try{

        if(fields.channel_id) filters.push({channel_id: fields.channel_id});
        if(fields.title) filters.push({title: {[Op.like]: `%${fields.title}%`}});
        // if(fields.description) filters.push({description: {[Op.like]: `%${fields.description}%`}});
        if(fields.user_id) filters.push({user_id: fields.user_id});
        if(fields.banner) filters.push({banner: fields.banner});
        if(fields.video_id) filters.push({id: fields.video_id});
        if(fields.category_id) filters.push({category_id: fields.category_id});

        

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']],
            include: [
                { model: Channel, required: false },
                { model: View, require: false }
            ]
        }

        if(pagination){
            videoCount = await Video.count({...filtersObj, include: []});
        }

        if(pagination?.offset) filtersObj['offset'] = pagination.offset;
        if(pagination?.limit) filtersObj['limit'] = pagination.limit;
        

        let videos = await Video.findAll(filtersObj);

        return res.status(200).json({
            status: true,
            type: "success",
            data: videos,
            message: 'retrieved successfully',
            pagination: {totalRows: videoCount}
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}