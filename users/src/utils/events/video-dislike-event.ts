import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface VideoDislikeEvent{
    subject: Subjects.VideoDisliked;
    data:any
}

export class VideoDislikePublish extends Publisher<VideoDislikeEvent>{
    subject: Subjects.VideoDisliked = Subjects.VideoDisliked;
}