import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Channel } from "../../database/models";

export interface ChannelCreatedEvent{
    subject: Subjects.ChannelCreated;
    data:any
}

export class ChannelCreatedListener extends Listener<ChannelCreatedEvent>{
    subject: Subjects.ChannelCreated = Subjects.ChannelCreated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){
        console.log('message recieved', msg, data);
        
        try{
            await Channel.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class ChannelCreatedPublisher extends Publisher<ChannelCreatedEvent>{
    subject: Subjects.ChannelCreated = Subjects.ChannelCreated;
}