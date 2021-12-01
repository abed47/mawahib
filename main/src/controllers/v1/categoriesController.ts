import { Request, Response } from "express";
import Category from "../../database/models/category";
import { returnErrResponse } from "../../utils";
import * as securePin from 'secure-pin';
import { CategoryDeletedPublisher } from "../../utils/events/category-deleted-event";
import { natsWrapper } from "../../nats-wrapper";
import { CategoryUpdatedPublisher } from "../../utils/events/category-updated-event";
import { CategoryCreatedPublisher } from "../../utils/events/category-created-event";

export const getAll = async (req: Request, res: Response) => {
    
    try{
        let categories = await Category.findAll();

        res.status(200).json({
            status: true,
            type: 'success',
            data: categories,
            message: 'retrieved successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const getOne = async (req: Request, res: Response) => {
    let id = req.params.id;

    try{

        let category = await Category.findOne({where: {id}});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'retrieved successfully'
        });

    }catch(err){
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const create = async (req: Request, res: Response) => {
    let { name, description, type } = req.body;

    if(!name) return returnErrResponse(res, 'all fields are required', 400);

    if(!req.files.photo) return returnErrResponse(res, 'no files to upload', 400);

    let photo: any = req.files.photo;
    let filepath = 'cat-' + securePin.generatePinSync(5) + '.png';
    
    photo.mv('./uploads/images/' + filepath , async photoError => {

        try{

            if(photoError) return returnErrResponse(res, photoError.message || 'unable to upload', 400);

            let v:any = await Category.create({name, description, photo: filepath});

            new CategoryCreatedPublisher(natsWrapper.client).publish(v.dataValues);

            return res.status(200).json({
                status: true,
                type: 'success',
                data: v,
                message: 'created successfully'
            });

        }catch(err){
            return returnErrResponse(res, err.message || 'unknown error', 500);
        }
    } )
}

export const updateOne = async (req: Request, res: Response) => {
    let id = req.params.id;
    let {name, description} = req.body;

    if(req.files.photo){
        let photo: any = req.files.photo;
        let filepath = 'cat-' + securePin.generatePinSync(5) + '.png';
        
        photo.mv('./uploads/images/' + filepath , async photoError => {

            try{

                if(photoError) return returnErrResponse(res, photoError.message || 'unable to upload', 400);

                let v:any = await Category.update({name, description, photo: filepath}, {where:{id}});

                new CategoryUpdatedPublisher(natsWrapper.client).publish({name, description, id});

                return res.status(200).json({
                    status: true,
                    type: 'success',
                    data: v,
                    message: 'updated successfully'
                });

            }catch(err){
                return returnErrResponse(res, err.message || 'unknown error', 500);
            }
        } )
    }else{
        try{

            await Category.update({name, description}, {where: {id}});
    
            new CategoryUpdatedPublisher(natsWrapper.client).publish({name, description, id});
    
            return res.status(200).json({
                status: true,
                type: 'success',
                data: null,
                message: 'updated successfully'
            });
        }catch(err){
            return returnErrResponse(res, err.message || 'unknown error', 500);
        }
    }
}

export const destroy = async (req: Request, res: Response) => {
    let id = req.params.id;
    
    try{
        
        await Category.destroy({where: {id}});

        new CategoryDeletedPublisher(natsWrapper.client).publish({id});

        return res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'deleted successfully'
        });

    }catch(err){
        return returnErrResponse(res, err.message || 'unknown error', 500);
    }
}