import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface ChannelCreatedEvent{
    subject: Subjects.ChannelCreated;
    data:any
}

export class ChannelCreatedPublisher extends Publisher<ChannelCreatedEvent>{
    subject: Subjects.ChannelCreated = Subjects.ChannelCreated;
}