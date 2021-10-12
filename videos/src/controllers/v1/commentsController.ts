import { Request, Response } from "express";
import { Comment } from "../../database/models";
import { natsWrapper } from "../../nats-wrapper";
import { returnErrResponse } from "../../utils";
import { CommentCreatedPublisher } from "../../utils/events/comment-create-event";
import { Op } from 'sequelize';

export const create = async (req: Request, res: Response) => {
    let {user_id, content, video_id} = req.body;

    if(!user_id || !content || !video_id) return returnErrResponse(res, 'all fields are required', 400);

    try {
        let c:any = await Comment.create({user_id, video_id, content});

        new CommentCreatedPublisher(natsWrapper.client).publish(c.dataValues);

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'created successfully'
        });

    } catch (err) {
     returnErrResponse(res, err.message || 'unknown error', 500)   
    }
}

export const filter = async (req: Request, res: Response) => {
    let {fields, exact, pagination} = req.body;
    let commentCount = null;
    let filters = [];

    if(!fields || !Object.keys(fields).length) return returnErrResponse(res, 'some fields are required', 400);

    try{
        
        if(fields.user_id) filters.push({user_id: fields.user_id});        
        if(fields.video_id) filters.push({video_id: fields.video_id});
        if(fields.content) filters.push({content: { [Op.like] : `%${fields.content}%`}})

        let filtersObj:any = {
            where:{
                [exact ? Op.and : Op.or]: filters
            },
            order:[['createdAt', 'DESC']]
        }

        if(pagination){
            commentCount = await Comment.count(filtersObj);
        }

        if(pagination?.offset) filtersObj['offset'] = pagination.offset;
        if(pagination?.limit) filtersObj['limit'] = pagination.limit;
        

        let videos = await Comment.findAll(filtersObj);

        return res.status(200).json({
            status: true,
            type: "success",
            data: videos,
            message: 'retrieved successfully',
            pagination: {totalRows: commentCount}
        });

    }catch(err){
        return returnErrResponse(res, err.message || 'unknown error', 500);
    }
}