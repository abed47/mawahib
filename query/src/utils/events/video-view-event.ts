import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import View from "../../database/models/views";

export interface VideoViewEvent{
    subject: Subjects.VideoViewed;
    data:any
}

export class VideoViewListener extends Listener<VideoViewEvent>{
    subject: Subjects.VideoViewed = Subjects.VideoViewed;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await View.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoViewPublisher extends Publisher<VideoViewEvent>{
    subject: Subjects.VideoViewed = Subjects.VideoViewed;
}