import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Video from "../../database/models/videos";

export interface VideoDeletedEvent{
    subject: Subjects.VideoDeleted;
    data:any
}

export class VideoDeletedListener extends Listener<VideoDeletedEvent>{
    subject: Subjects.VideoDeleted = Subjects.VideoDeleted;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Video.destroy({where:{id: data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class VideoDeletedPublisher extends Publisher<VideoDeletedEvent>{
    subject: Subjects.VideoDeleted = Subjects.VideoDeleted;
}