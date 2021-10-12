import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface VideoUpdatedEvent{
    subject: Subjects.VideoUpdated;
    data:any
}

export class VideoUpdatedPublisher extends Publisher<VideoUpdatedEvent>{
    subject: Subjects.VideoUpdated = Subjects.VideoUpdated;
}