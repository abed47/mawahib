import { Request, Response } from "express";
import { Comments, User } from "../../database/models";
import { returnErrResponse } from "../../utils";
import { Op } from 'sequelize';

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
            order:[['createdAt', 'DESC']],
            include:[
                {
                    model: User,
                    as: 'user',
                    required: true
                }
            ]
        }

        if(pagination){
            commentCount = await Comments.count(filtersObj);
        }

        if(pagination?.offset) filtersObj['offset'] = pagination.offset;
        if(pagination?.limit) filtersObj['limit'] = pagination.limit;
        

        let videos = await Comments.findAll(filtersObj);

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