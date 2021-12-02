import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { Channel, Subscription, User } from "../../database/models";
import { returnErrResponse } from "../../utils";

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
    let {name, description, photo, userId, cover, slogan, watermark, category_id} = req.body;

    if(!name || !userId) return returnErrResponse(res, 'all fields are required', 400);

    try {

        let c = await Channel.findOne({where: {user_id: userId}});

        if(c) return returnErrResponse(res, 'user already has a channel', 401);

        let channel: any = await Channel.create({name, description, photo, user_id: userId, cover, slogan, watermark, category_id});

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