import { Request, Response } from "express";
import { Subscription } from "../../database/models";
import { returnErrResponse } from "../../utils";

export const subscribe = async (req: Request, res: Response) => {
    let {user_id, channel_id, channel_name} = req.body;

    if(!user_id || !channel_id) return returnErrResponse(res, 'all fields are required', 400);

    try {
        await Subscription.create({channel_id, user_id, channel_name});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'subscribed successfully'
        });

    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}

export const unsubscribe = async (req: Request, res: Response) => {
    let {subscription_id} = req.body;

    if(!subscription_id) return returnErrResponse(res, 'all fields are required', 400);

    try {
        await Subscription.destroy({where: {id: subscription_id}});

        res.status(200).json({
            status: true,
            type: 'success',
            data: null,
            message: 'unsubscribe successful'
        });


    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}