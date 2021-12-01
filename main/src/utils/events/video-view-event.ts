import { Subjects } from "./subjects";
import { Publisher } from "./base-publisher";

export interface VideoViewEvent{
    subject: Subjects.VideoViewed;
    data:any
}

export class VideoViewPublisher extends Publisher<VideoViewEvent>{
    subject: Subjects.VideoViewed = Subjects.VideoViewed;
}