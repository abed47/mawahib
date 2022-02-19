import {Wallet, Product, Transaction, User} from "../../database/models";
import { errorResponse, returnErrResponse, successResponse } from "../../utils";
import { ControllerFunction } from "../../utils/types";
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51Hrg9GLptxnxkf6KbyaC5WyI39WDFIZty7m38tU8aHSneE2phHMruw3qSdFPo5NknHGaTxuxG9nzthVhmcsUzwYH00xddQBgLc', {apiVersion: '2020-08-27'});


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

export const getProduct: ControllerFunction = async (req, res) => {
    try{
        let { id } = req.params;
        let product = await Product.findOne({where: { id }});
        return successResponse(res, 200, 'retrieved successfully', product);
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const createPaymentIntent: ControllerFunction = async (req, res) => {
    if(req.method === "POST"){
        try{
            const { amount } = req.body;

            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: "usd"
            });

            return successResponse(res, 200, 'successful', {client_secret: paymentIntent.client_secret});
        }catch(err){
            return errorResponse(res, 500, err?.message || 'server error');
        }
    }else{
        res.setHeader("Allow", "POST");
        res.status(405).end("Method Not Allowed");
    }
}

export const confirmPayment: ControllerFunction = async (req, res) => {
    try{
        let { ref, product_id, price, amount, user_id, status } = req.body;
        let w:any = await Wallet.findOne({where: { user_id : user_id }});
        console.log(+w.dataValues.balance, +amount)
        await Transaction.create({ref, product_id, amount, paid_amount: price, user_id, status, wallet_id: w?.dataValues?.id});
        await Wallet.update({balance: +w.dataValues.balance + +amount}, { where: { id: w.dataValues.id}});
        return successResponse(res, 200, 'created successfully')
    }catch(err){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}

export const getTransactionHistory: ControllerFunction = async (req, res) => {
    try{
        //@ts-ignore
        let u = req.user;
        let results = await Transaction.findAll({ where: { user_id: u.id}});
        return successResponse(res, 200, 'retrieved successfully', results);
    }catch(err: any){
        return errorResponse(res, 500, err?.message || 'server error');
    }
}