import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Subscription } from "../../database/models";

export interface ChannelUnsubscribeEvent{
    subject: Subjects.ChannelUnsubscribe;
    data:any
}

export class ChannelUnsubscribeListener extends Listener<ChannelUnsubscribeEvent>{
    subject: Subjects.ChannelUnsubscribe = Subjects.ChannelUnsubscribe;
    queueGroupName = 'user-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Subscription.destroy({where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class ChannelUnsubscribePublisher extends Publisher<ChannelUnsubscribeEvent>{
    subject: Subjects.ChannelUnsubscribe = Subjects.ChannelUnsubscribe;
}