import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface ChannelDeletedEvent{
    subject: Subjects.ChannelDeleted;
    data:any
}

export class ChannelDeletedPublisher extends Publisher<ChannelDeletedEvent>{
    subject: Subjects.ChannelDeleted = Subjects.ChannelDeleted;
}