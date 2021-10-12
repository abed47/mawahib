import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Like from "../../database/models/likes";

export interface VideoDislikeEvent{
    subject: Subjects.VideoDisliked;
    data:any
}

export class VideoDislikeListener extends Listener<VideoDislikeEvent>{
    subject: Subjects.VideoDisliked = Subjects.VideoDisliked;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Like.destroy({where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoDislikePublish extends Publisher<VideoDislikeEvent>{
    subject: Subjects.VideoDisliked = Subjects.VideoDisliked;
}