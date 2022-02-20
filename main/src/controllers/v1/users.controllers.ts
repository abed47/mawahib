import { Request, Response } from "express";
import { Channel, Subscription, User } from "../../database/models";
import { errorResponse, returnErrResponse, successResponse } from "../../utils";
import { Model, Op } from "sequelize";
import * as securePin from 'secure-pin';
import { ControllerFunction } from "../../utils/types";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

dotenv.config();

interface ChannelAttributes {
    id: string | number
}

export const me: ControllerFunction = async (req, res) => {
    try{
        //@ts-ignore
        let u = req.user;
        let user: any = await User.findOne({where: { id: u.id}});
        let token = jwt.sign(user.dataValues ,process.env.JWT_SECRET);
        return successResponse(res, 200, 'retrieved successfully', { token, user});
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const getOne = async (req: Request, res: Response) => {
    let userId = req.params.id;
    
    try {
        let user:any = await User.findOne({where: {id: userId}});

        if(!user) return returnErrResponse(res, 'user not found', 404);

        delete user.dataValues.password;

        res.status(200).json({
            status: true,
            type: 'success',
            data: user,
            message: 'retrieved successfully'
        })
    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const update = async (req: Request, res: Response) => {
    let userId = req.params.id;
    let data = req.body;

    if(data && data?.password) delete data.password;

    if(Object.keys(data).length < 1) return returnErrResponse(res, 'no data to update', 400);

    try{

        if(data?.username){
            let usernameCheck = await User.findAll({where: { [Op.and]: [
                { username: { [Op.eq]: data.username}},
                { id: { [Op.ne]: userId}}
            ] }});
            if(usernameCheck.length) return errorResponse(res, 400, 'username already taken')
        }

        if(data?.email){
            let emailCheck = await User.findAll({where: { [Op.and]: [
                { email: { [Op.eq]: data.email}},
                { id: { [Op.ne]: userId}}
            ] }});
            if(emailCheck.length) return errorResponse(res, 400, 'email already taken')
        }

        if(data?.phone){
            let phoneCheck = await User.findAll({where: { [Op.and]: [
                { phone: { [Op.eq]: data.phone}},
                { id: { [Op.ne]: userId}}
            ] }});
            if(phoneCheck.length) return errorResponse(res, 400, 'phone already taken')
        }

        await User.update(data, {where: {id: userId}});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'updated successfully'
        });
        
        data.id = userId;
    }catch(err){
        returnErrResponse(res, err.message || 'unknown err', 500);
    }
}

export const updateUserProfile = async (req: Request, res: Response) => {
    if(req.files){
        let { id } = req.body;

        if(!id) return returnErrResponse(res, 'all fields are required', 400);

        let file:any = req.files.file;
        let filename = `${id}-${securePin.generatePinSync(5)}.png`;
        file.mv('./uploads/' + filename , async err => {
            
            try {
                if(err) return returnErrResponse(res, err.message || err, 500);

                await User.update({photo: filename}, {where: {id}});
            
                res.status(200).json({
                    status: true,
                    type: 'success',
                    data: filename,
                    message: 'uploaded successfully'
                });
            } catch (e) {
                returnErrResponse(res, e.message || 'unknown error', 500)
            }
        });

        let eventData = {id, photo: filename}
        return
    }

    returnErrResponse(res, 'no files to upload', 400);
}

export const getUserChannel = async (req: Request, res: Response) => {
    let id = req.params.id;
    try{
        let channel: any= await Channel.findOne({where: {user_id: id}});

        if(!channel){
            return res.status(404).json({
                status: false,
                type: 'error',
                data: null,
                message: 'user has no channel'
            });
        }

        let subscriptions = await Subscription.count({where: {channel_id: channel.id}});

        channel.dataValues.subscriptions = subscriptions;

        res.status(200).json({
            status:true,
            type: 'success',
            data: channel,
            message: 'retrieved successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}