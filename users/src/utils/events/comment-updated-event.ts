import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface CommentUpdatedEvent{
    subject: Subjects.CommentUpdated;
    data:any
}

export class CommentUpdatedPublisher extends Publisher<CommentUpdatedEvent>{
    subject: Subjects.CommentUpdated = Subjects.CommentUpdated;
}