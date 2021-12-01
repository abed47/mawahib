import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface CommentCreatedEvent{
    subject: Subjects.CommentCreated;
    data:any
}

export class CommentCreatedPublisher extends Publisher<CommentCreatedEvent>{
    subject: Subjects.CommentCreated = Subjects.CommentCreated;
}