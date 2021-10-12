import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface ChannelUpdatedEvent{
    subject: Subjects.ChannelUpdated;
    data:any
}

export class ChannelUpdatedPublisher extends Publisher<ChannelUpdatedEvent>{
    subject: Subjects.ChannelUpdated = Subjects.ChannelUpdated;
}