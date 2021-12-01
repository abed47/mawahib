import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";
import { Channel } from "../../database/models";

export interface VideoLikeEvent{
    subject: Subjects.VideoLiked;
    data:any
}

export class VideoLikePublisher extends Publisher<VideoLikeEvent>{
    subject: Subjects.VideoLiked = Subjects.VideoLiked;
}