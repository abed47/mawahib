import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Channel, Subscription } from "../../database/models";

export interface ChannelSubscriptionEvent{
    subject: Subjects.ChannelSubscription;
    data:any
}

export class ChannelSubscriptionListener extends Listener<ChannelSubscriptionEvent>{
    subject: Subjects.ChannelSubscription = Subjects.ChannelSubscription;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Subscription.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class ChannelSubscriptionPublisher extends Publisher<ChannelSubscriptionEvent>{
    subject: Subjects.ChannelSubscription = Subjects.ChannelSubscription;
}