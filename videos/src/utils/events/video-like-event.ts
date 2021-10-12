import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Like from "../../database/models/likes";

export interface VideoLikeEvent{
    subject: Subjects.VideoLiked;
    data:any
}

export class VideoLikeListener extends Listener<VideoLikeEvent>{
    subject: Subjects.VideoLiked = Subjects.VideoLiked;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Like.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoLikePublisher extends Publisher<VideoLikeEvent>{
    subject: Subjects.VideoLiked = Subjects.VideoLiked;
}