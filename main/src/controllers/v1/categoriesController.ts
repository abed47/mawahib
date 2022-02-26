import { Request, Response } from "express";
import Category from "../../database/models/category";
import { errorResponse, returnErrResponse, successResponse } from "../../utils";
import * as securePin from 'secure-pin';
import { ControllerFunction } from "../../utils/types";
import { QueryTypes, literal} from "sequelize";
import { db } from "../../database";

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

export const getMostViewed: ControllerFunction = async (req, res) => {
    try{
        let results = await db.query(`
            SELECT 
            c.id,
            c.name,
            COUNT(*) AS view_count,
            c.photo AS photo
            FROM categories c
            LEFT JOIN videos v ON v.category_id = c.id
            LEFT JOIN views vw ON vw.video_id = v.id
            GROUP BY c.id
            ORDER BY view_count DESC
            LIMIT 10
        `, { raw: true, type: QueryTypes.SELECT});
        return successResponse(res, 200, 'retrieved successfully', results)
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const getPopular: ControllerFunction = async (req, res) => {
    try{
        let results = await db.query(`
            SELECT 
            c.id,
            c.name,
            COUNT(vw) AS like_count,
            c.photo AS photo
            FROM categories c
            LEFT JOIN videos v ON v.category_id = c.id
            LEFT JOIN views vw ON vw.video_id = v.id
            GROUP BY c.id
            ORDER BY like_count DESC
            LIMIT 10
        `, { raw: true, type: QueryTypes.SELECT});
        return successResponse(res, 200, 'retrieved successfully', results)
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const getHasNewVideo: ControllerFunction = async (req, res) => {
    try{
        let results = await db.query(`
            SELECT DISTINCT
            v.category_id as c_id
            FROM videos v
            LEFT JOIN categories c ON c.id = v.category_id
            ORDER BY 'createdAt' DESC
        `, { raw: true, type: QueryTypes.SELECT});
        return successResponse(res, 200, 'retrieved successfully', results)
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}