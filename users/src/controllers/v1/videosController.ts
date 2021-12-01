import { Request, Response } from "express";
import { Video, View } from "../../database/models";
import { returnErrResponse } from "../../utils";
import * as securePin from 'secure-pin';
import { Op } from "sequelize";
import { VideoCreatedPublisher } from "../../utils/events/video-created-event";
import { natsWrapper } from "../../nats-wrapper";
import { VideoViewPublisher } from "../../utils/events/video-view-event";

export const view = async (req: Request, res: Response) => {
    let {user_id, video_id} = req.body;

    try{

        let v: any = await View.create({user_id, video_id});

        new VideoViewPublisher(natsWrapper.client).publish(v.dataValues);
        
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
    let { title, description, channel_id, user_id, category_id, tags, video_type} = req.body;

    if(!title || !description || !channel_id || !user_id || !video_type) return returnErrResponse(res, 'all fields are required', 400);

    if(!req.files.thumb || !req.files.video) return returnErrResponse(res, 'no files to upload', 400);

    try{

        if(!tags) tags = "";
        if(!category_id) category_id = 1;

        let video: any = req.files.video;
        let thumb: any = req.files.thumb;
        video_type = video_type.match(/([^\/]+$)/ig)[0];
        
        //thumbnail name
        let thumbnail = 'thumb-' + securePin.generatePinSync(5) + '.png';
        //video file name
        let url = 'video-' + securePin.generatePinSync(5) + '-' + channel_id + '.' + video_type;

        video.mv('./uploads/videos/' + url, videoErr => {
            
            if(videoErr) return returnErrResponse(res, videoErr.message || videoErr, 500);

            thumb.mv('./uploads/images/' + thumbnail, async thumbErr => {

                if(thumbErr) return returnErrResponse(res, thumbErr.message || thumbErr, 500);
                
                try{
                    
                    let v: any = await Video.create({title, description, channel_id, user_id, thumbnail, category_id, tags, url});

                    res.status(200).json({
                        status: true,
                        type: 'success',
                        data: v,
                        message: 'uploaded successfully'
                    });

                    new VideoCreatedPublisher(natsWrapper.client).publish(v.dataValues);

                }catch(err){
                    return returnErrResponse(res, err.message || 'unknown error', 500);
                }

            })
        })

        
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