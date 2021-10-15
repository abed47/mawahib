import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { db } from "../../database";
import { Channel, Video, View } from "../../database/models";
import Like from "../../database/models/likes";
import { returnErrResponse } from "../../utils";

export const getOne = async (req: Request, res: Response) => {
    
}

export const filter = async (req: Request, res: Response) => {

    let {fields, exact, pagination} = req.body;
    let videoCount: any;

    if(!fields || !Object.keys(fields)) return returnErrResponse(res, 'all fields are required', 400);

    let filters = [];

    try{

        if(fields.channel_id) filters.push({channel_id: fields.channel_id});
        if(fields.title) filters.push({title: {[Op.like]: `%${fields.title}%`}});
        // if(fields.description) filters.push({description: {[Op.like]: `%${fields.description}%`}});
        if(fields.user_id) filters.push({user_id: fields.user_id});
        if(fields.banner) filters.push({banner: fields.banner});
        if(fields.video_id) filters.push({id: fields.video_id});

        

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']],
            include: [{
                model: Channel,
                as: 'channel',
                required: true
            }],
        attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) from views WHERE "video_id" = video.id)'), 'view_count'],
                    [Sequelize.literal('(SELECT COUNT(*) from likes WHERE "video_id" = video.id AND "likes"."deletedAt" IS NULL)'), "like_count"]
                ]
            },
        group: ['video.id', 'channel.id'],
        }

        if(pagination){
            // videoCount = await Video.count(filtersObj);
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


const getTagFilters: (s: string) => any[] = s => {
    let splitted: any[] = s.split(',-,');

    let arr = [];

    splitted.forEach(item => {
        arr.push({tags: {[Op.like]: `%${item}%`}});
    })

    return arr;
}

const getTitleFilters: (s: string) => any[] = s => {
    let splitted: any[] = s.split(' ');

    let arr = [];

    splitted.forEach(item => {
        arr.push({tags: {[Op.like]: `%${item}%`}});
    })

    return arr;
}

export const getRelated = async (req: Request, res: Response) => {

    let {fields, exact, pagination} = req.body;
    let videoCount: any;

    if(!fields || !Object.keys(fields)) return returnErrResponse(res, 'all fields are required', 400);

    let filters = [];

    try{

        if(fields.channel_id) filters.push({channel_id: fields.channel_id});
        if(fields.title) filters.push({title: {[Op.like]: `%${fields.title}%`}});
        // if(fields.description) filters.push({description: {[Op.like]: `%${fields.description}%`}});
        if(fields.user_id) filters.push({user_id: fields.user_id});
        if(fields.banner) filters.push({banner: fields.banner});
        if(fields.video_id) filters.push({id: fields.video_id});
        if(fields.tags) filters.concat(getTagFilters(fields.tags));
        if(fields.title) filters.concat(getTitleFilters(fields.title));

        

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']],
            include: {
                model: Channel,
                as: 'channel'
            },
            attributes: {
                include: [
                    [Sequelize.literal('(SELECT COUNT(*) from views WHERE "video_id" = video.id)'), 'view_count'],
                    [Sequelize.literal('(SELECT COUNT(*) from likes WHERE "video_id" = video.id AND "likes"."deletedAt" IS NULL)'), "like_count"]
                ]
            },
            group: ['video.id', 'channel.id'],
        }

        console.log(req.body);

        if(pagination){
            videoCount = await Video.count(filtersObj);
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