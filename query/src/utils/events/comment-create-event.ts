import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import Comment from "../../database/models/comments";

export interface CommentCreatedEvent{
    subject: Subjects.CommentCreated;
    data:any
}

export class CommentCreatedListener extends Listener<CommentCreatedEvent>{
    subject: Subjects.CommentCreated = Subjects.CommentCreated;
    queueGroupName = 'query-service';

    async onMessage(data: any, msg: Message){        
        try{
            await Comment.create(data);
            msg.ack();
        }catch(err){
            throw new Error(err);
        }
    }
}

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent>{
    subject: Subjects.CommentCreated = Subjects.CommentCreated;
}