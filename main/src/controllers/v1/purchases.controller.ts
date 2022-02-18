import {Wallet, Product, Transaction} from "../../database/models";
import { errorResponse, returnErrResponse, successResponse } from "../../utils";
import { ControllerFunction } from "../../utils/types";

export const getWalletInfo: ControllerFunction = async (req, res) => {
    try{
        //TODO:fix this
        // @ts-ignore
        let u = req.user;
        if(!u) return errorResponse(res, 401, 'user was not supplied with the request');
        let results = await Wallet.findOrCreate({where: { user_id: u.id}, defaults: {user_id: u.id, balance: 0}});
        return successResponse(res, 200, 'retrieved successfully', results);
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const createCheckoutPage: ControllerFunction = (req, res) => {

}

export const productListing: ControllerFunction = async (req, res) => {
    try{
        let results = await Product.findAll();
        return successResponse(res, 200, 'retrieved successfully', results);
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}