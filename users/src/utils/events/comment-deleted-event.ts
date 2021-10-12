import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface CommentDeletedEvent{
    subject: Subjects.CommentDeleted;
    data:any
}

export class CommentDeletedPublisher extends Publisher<CommentDeletedEvent>{
    subject: Subjects.CommentDeleted = Subjects.CommentDeleted;
}