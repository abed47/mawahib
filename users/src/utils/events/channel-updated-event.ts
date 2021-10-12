import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Channel } from "../../database/models";

export interface ChannelUpdatedEvent{
    subject: Subjects.ChannelUpdated;
    data:any
}

export class ChannelUpdatedListener extends Listener<ChannelUpdatedEvent>{
    subject: Subjects.ChannelUpdated = Subjects.ChannelUpdated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Channel.update(data,{where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class ChannelUpdatedPublisher extends Publisher<ChannelUpdatedEvent>{
    subject: Subjects.ChannelUpdated = Subjects.ChannelUpdated;
}