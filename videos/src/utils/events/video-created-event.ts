import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Video from "../../database/models/videos";

export interface VideoCreatedEvent{
    subject: Subjects.VideoUploaded;
    data:any
}

export class VideoCreatedListener extends Listener<VideoCreatedEvent>{
    subject: Subjects.VideoUploaded = Subjects.VideoUploaded;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Video.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoCreatedPublisher extends Publisher<VideoCreatedEvent>{
    subject: Subjects.VideoUploaded = Subjects.VideoUploaded;
}