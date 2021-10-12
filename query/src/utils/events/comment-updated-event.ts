import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Comment from "../../database/models/comments";

export interface CommentUpdatedEvent{
    subject: Subjects.CommentUpdated;
    data:any
}

export class CommentUpdatedListener extends Listener<CommentUpdatedEvent>{
    subject: Subjects.CommentUpdated = Subjects.CommentUpdated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Comment.update(data,{where:{id:data.id}});
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CommentUpdatedPublisher extends Publisher<CommentUpdatedEvent>{
    subject: Subjects.CommentUpdated = Subjects.CommentUpdated;
}