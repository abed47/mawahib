import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Channel } from "../../database/models";

export interface ChannelDeletedEvent{
    subject: Subjects.ChannelDeleted;
    data:any
}

export class ChannelDeletedListener extends Listener<ChannelDeletedEvent>{
    subject: Subjects.ChannelDeleted = Subjects.ChannelDeleted;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Channel.destroy({where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class ChannelDeletedPublisher extends Publisher<ChannelDeletedEvent>{
    subject: Subjects.ChannelDeleted = Subjects.ChannelDeleted;
}