import { Request, Response } from "express";
import { Video, View } from "../../database/models";
import { returnErrResponse, successResponse } from "../../utils";
import * as securePin from 'secure-pin';
import { Op } from "sequelize";

export const view = async (req: Request, res: Response) => {
    let {user_id, video_id} = req.body;

    try{

        let v: any = await View.create({user_id, video_id});

        
        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
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
    let {fields, exact, pagination} = req.body;
    let videoCount: any;

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

        

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']]
        }

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