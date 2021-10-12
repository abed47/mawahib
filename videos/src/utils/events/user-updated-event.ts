import { Subjects } from "./subjects";
import Listener from "./base-listener";
import { Publisher } from "./base-publisher";
import { Message } from "node-nats-streaming";

export interface UserUpdatedEvent{
    subject: Subjects.UserUpdated;
    data:any
}

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent>{
    subject: Subjects.UserUpdated = Subjects.UserUpdated;
}