import { Request, Response } from "express";
import { Subscription } from "../../database/models";
import { natsWrapper } from "../../nats-wrapper";
import { returnErrResponse } from "../../utils";
import { ChannelSubscriptionPublisher } from "../../utils/events/channel-subscription-event";
import { ChannelUnsubscribePublisher } from "../../utils/events/channel-unsubscribe-event";

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

        new ChannelSubscriptionPublisher(natsWrapper.client).publish({user_id, channel_id, channel_name});
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

        new ChannelUnsubscribePublisher(natsWrapper.client).publish({id:subscription_id})

    } catch (err) {
        returnErrResponse(res, err.message || 'unknown error', 500);
    }
}