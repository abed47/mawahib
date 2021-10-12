import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Comment from "../../database/models/comments";

export interface CommentDeletedEvent{
    subject: Subjects.CommentDeleted;
    data:any
}

export class CommentDeletedListener extends Listener<CommentDeletedEvent>{
    subject: Subjects.CommentDeleted = Subjects.CommentDeleted;
    queueGroupName = 'video-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Comment.destroy({where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CommentDeletedPublisher extends Publisher<CommentDeletedEvent>{
    subject: Subjects.CommentDeleted = Subjects.CommentDeleted;
}