import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Video from "../../database/models/videos";

export interface VideoUpdatedEvent{
    subject: Subjects.VideoUpdated;
    data:any
}

export class VideoUpdatedListener extends Listener<VideoUpdatedEvent>{
    subject: Subjects.VideoUpdated = Subjects.VideoUpdated;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Video.update(data,{where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoUpdatedPublisher extends Publisher<VideoUpdatedEvent>{
    subject: Subjects.VideoUpdated = Subjects.VideoUpdated;
}