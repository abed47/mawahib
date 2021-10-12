import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface ChannelUnsubscribeEvent{
    subject: Subjects.ChannelUnsubscribe;
    data:any
}

export class ChannelUnsubscribePublisher extends Publisher<ChannelUnsubscribeEvent>{
    subject: Subjects.ChannelUnsubscribe = Subjects.ChannelUnsubscribe;
}