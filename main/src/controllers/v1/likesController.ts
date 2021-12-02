import { Request, Response } from "express";
import { Like } from "../../database/models";
import { returnErrResponse } from "../../utils";
import { Op, Sequelize } from 'sequelize';
export const like = async (req: Request, res: Response) => {
    let {user_id, video_id} = req.body;

    if(!user_id || !video_id) return returnErrResponse(res, 'all fields are required', 400);

    try{
        let like: any = await Like.create({user_id, video_id});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'video liked successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const dislike = async (req: Request, res: Response) => {
    let {user_id, video_id} = req.body;

    if(!user_id || !video_id) return returnErrResponse(res, 'all fields are required', 400);

    try{
        let like: any = await Like.findOne({where: {video_id, user_id}});
        let id = like.id;
        await Like.destroy({where: {video_id, user_id}});
        res.status(200).json({
            status: true,
            type: 'success',
            data: like,
            message: 'dislike successful'
        })
        
    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const filter = async (req: Request, res: Response) => {
    let {fields, exact, pagination} = req.body;
    let likeCount = null;
    let filters = [];

    if(!fields || !Object.keys(fields).length) return returnErrResponse(res, 'some fields are required', 400);

    try{
        
        if(fields.user_id) filters.push({user_id: fields.user_id});        
        if(fields.video_id) filters.push({video_id: fields.video_id});

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']]
        }

        if(pagination){
            likeCount = await Like.count(filtersObj);
        }

        if(pagination?.offset) filtersObj['offset'] = pagination.offset;
        if(pagination?.limit) filtersObj['limit'] = pagination.limit;
        

        let videos = await Like.findAll(filtersObj);

        return res.status(200).json({
            status: true,
            type: "success",
            data: videos,
            message: 'retrieved successfully',
            pagination: {totalRows: likeCount}
        });

    }catch(err){
        return returnErrResponse(res, err.message || 'unknown error', 500);
    }
}