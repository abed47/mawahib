import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface VideoCreatedEvent{
    subject: Subjects.VideoUploaded;
    data:any
}

export class VideoCreatedPublisher extends Publisher<VideoCreatedEvent>{
    subject: Subjects.VideoUploaded = Subjects.VideoUploaded;
}